"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useDeferredValue, useState } from "react";
import {
  getDestinationAirportCountForRegions,
  getRegionAirportIds,
  getRegionGroups,
} from "@/lib/data/regions";
import type { Airport, DealWatch, Region } from "@/lib/types";

export function DealWatchForm({
  airports,
  regions,
  initialWatch,
}: {
  airports: Airport[];
  regions: Region[];
  initialWatch?: DealWatch;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originAirportIds, setOriginAirportIds] = useState<string[]>(
    initialWatch?.originAirportIds ?? ["mia"],
  );
  const [regionIds, setRegionIds] = useState<string[]>(initialWatch?.regionIds ?? ["central-america"]);
  const [departureStart, setDepartureStart] = useState(
    initialWatch?.departureStart ?? new Date().toISOString().slice(0, 10),
  );
  const [departureEnd, setDepartureEnd] = useState(
    initialWatch?.departureEnd ??
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString().slice(0, 10),
  );
  const [tripLengthMinDays, setTripLengthMinDays] = useState(
    initialWatch?.tripLengthMinDays ?? 4,
  );
  const [tripLengthMaxDays, setTripLengthMaxDays] = useState(
    initialWatch?.tripLengthMaxDays ?? 7,
  );
  const [maxFareUsd, setMaxFareUsd] = useState(initialWatch?.maxFareUsd ?? 250);
  const [regionQuery, setRegionQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<Region["group"] | "All">("All");
  const deferredRegionQuery = useDeferredValue(regionQuery);
  const visibleRegionGroups = getRegionGroups();
  const normalizedQuery = deferredRegionQuery.trim().toLowerCase();
  const filteredRegions = regions.filter((region) => {
    const matchesGroup = activeGroup === "All" || region.group === activeGroup;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      region.name.toLowerCase().includes(normalizedQuery) ||
      region.summary.toLowerCase().includes(normalizedQuery) ||
      region.spotlightCities.some((city) => city.toLowerCase().includes(normalizedQuery));

    return matchesGroup && matchesQuery;
  });
  const selectedAirportCount = getDestinationAirportCountForRegions(regionIds);

  function toggleRegion(regionId: string, checked: boolean) {
    setRegionIds((current) =>
      checked ? [...current, regionId] : current.filter((value) => value !== regionId),
    );
  }

  function selectVisibleRegions() {
    setRegionIds((current) => [...new Set([...current, ...filteredRegions.map((region) => region.id)])]);
  }

  function clearVisibleRegions() {
    const visibleIds = new Set(filteredRegions.map((region) => region.id));
    setRegionIds((current) => current.filter((value) => !visibleIds.has(value)));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const endpoint = initialWatch ? `/api/deal-watches/${initialWatch.id}` : "/api/deal-watches";
    const response = await fetch(endpoint, {
      method: initialWatch ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        originAirportIds,
        regionIds,
        departureStart,
        departureEnd,
        tripLengthMinDays: Number(tripLengthMinDays),
        tripLengthMaxDays: Number(tripLengthMaxDays),
        maxFareUsd: Number(maxFareUsd),
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => undefined);
      setError(payload?.error ?? "Unable to save deal watch.");
      setPending(false);
      return;
    }

    const watch = await response.json();
    router.push(`/deal-watches/${watch.id}`);
    router.refresh();
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Origin airports</legend>
        <div className="pill-grid">
          {airports
            .filter((airport) => airport.country === "United States")
            .map((airport) => {
              const checked = originAirportIds.includes(airport.id);
              return (
                <label className={`pill ${checked ? "active" : ""}`} key={airport.id}>
                  <input
                    checked={checked}
                    onChange={(event) => {
                      setOriginAirportIds((current) =>
                        event.target.checked
                          ? [...current, airport.id]
                          : current.filter((value) => value !== airport.id),
                      );
                    }}
                    type="checkbox"
                  />
                  {airport.iataCode} · {airport.city}
                </label>
              );
            })}
        </div>
      </fieldset>

      <fieldset>
        <legend>Destination regions</legend>
        <div className="region-toolbar">
          <label className="search-field">
            <span>Search regions</span>
            <input
              onChange={(event) => setRegionQuery(event.target.value)}
              placeholder="Search by region or city"
              value={regionQuery}
            />
          </label>
          <div className="action-row">
            <button className="ghost-button" onClick={selectVisibleRegions} type="button">
              Select visible
            </button>
            <button className="ghost-button" onClick={clearVisibleRegions} type="button">
              Clear visible
            </button>
          </div>
        </div>

        <div className="stats-strip">
          <div className="metric-card compact">
            <strong>{regionIds.length}</strong>
            <p>selected regions</p>
          </div>
          <div className="metric-card compact">
            <strong>{selectedAirportCount}</strong>
            <p>destination airports covered</p>
          </div>
        </div>

        <div className="pill-grid">
          <label className={`pill ${activeGroup === "All" ? "active" : ""}`}>
            <input
              checked={activeGroup === "All"}
              onChange={() => setActiveGroup("All")}
              type="radio"
            />
            All groups
          </label>
          {visibleRegionGroups.map((group) => (
            <label className={`pill ${activeGroup === group ? "active" : ""}`} key={group}>
              <input
                checked={activeGroup === group}
                onChange={() => setActiveGroup(group)}
                type="radio"
              />
              {group}
            </label>
          ))}
        </div>

        <div className="region-grid">
          {filteredRegions.map((region) => {
            const checked = regionIds.includes(region.id);
            const airportCount = getRegionAirportIds(region.id).length;
            return (
              <label className={`region-card ${checked ? "active" : ""}`} key={region.id}>
                <input
                  checked={checked}
                  onChange={(event) => toggleRegion(region.id, event.target.checked)}
                  type="checkbox"
                />
                <span className="status-chip">{region.group}</span>
                <strong>{region.name}</strong>
                <span>{region.summary}</span>
                <small>
                  {airportCount} airports · {region.spotlightCities.join(", ")}
                </small>
              </label>
            );
          })}
        </div>
        {filteredRegions.length === 0 ? (
          <p className="muted-text">No regions match the current search.</p>
        ) : null}
      </fieldset>

      <div className="field-grid">
        <label>
          <span>Departure start</span>
          <input type="date" value={departureStart} onChange={(event) => setDepartureStart(event.target.value)} />
        </label>
        <label>
          <span>Departure end</span>
          <input type="date" value={departureEnd} onChange={(event) => setDepartureEnd(event.target.value)} />
        </label>
        <label>
          <span>Min trip length</span>
          <input
            min={2}
            max={21}
            type="number"
            value={tripLengthMinDays}
            onChange={(event) => setTripLengthMinDays(Number(event.target.value))}
          />
        </label>
        <label>
          <span>Max trip length</span>
          <input
            min={2}
            max={30}
            type="number"
            value={tripLengthMaxDays}
            onChange={(event) => setTripLengthMaxDays(Number(event.target.value))}
          />
        </label>
        <label>
          <span>Fare threshold (USD)</span>
          <input
            min={120}
            max={1500}
            type="number"
            value={maxFareUsd}
            onChange={(event) => setMaxFareUsd(Number(event.target.value))}
          />
        </label>
      </div>

      {error ? <p className="error-text">{error}</p> : null}
      <button className="primary-button" disabled={pending} type="submit">
        {pending ? "Saving..." : initialWatch ? "Update watch" : "Create watch"}
      </button>
    </form>
  );
}
