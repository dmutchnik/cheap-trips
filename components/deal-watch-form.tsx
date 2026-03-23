"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
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
        <div className="region-grid">
          {regions.map((region) => {
            const checked = regionIds.includes(region.id);
            return (
              <label className={`region-card ${checked ? "active" : ""}`} key={region.id}>
                <input
                  checked={checked}
                  onChange={(event) => {
                    setRegionIds((current) =>
                      event.target.checked
                        ? [...current, region.id]
                        : current.filter((value) => value !== region.id),
                    );
                  }}
                  type="checkbox"
                />
                <strong>{region.name}</strong>
                <span>{region.summary}</span>
              </label>
            );
          })}
        </div>
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
