"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import type { Airport, TravelerProfile } from "@/lib/types";

const interestOptions = [
  "food",
  "nightlife",
  "nature",
  "museums",
  "beaches",
  "architecture",
];

export function TravelerProfileForm({
  airports,
  initialProfile,
}: {
  airports: Airport[];
  initialProfile?: TravelerProfile;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState(initialProfile?.fullName ?? "");
  const [email, setEmail] = useState(initialProfile?.email ?? "");
  const [citizenship, setCitizenship] = useState(initialProfile?.citizenship ?? "United States");
  const [passportCountry, setPassportCountry] = useState(
    initialProfile?.passportCountry ?? "United States",
  );
  const [notes, setNotes] = useState(initialProfile?.notes ?? "");
  const [budgetStyle, setBudgetStyle] = useState<TravelerProfile["budgetStyle"]>(
    initialProfile?.budgetStyle ?? "balanced",
  );
  const [selectedAirports, setSelectedAirports] = useState<string[]>(
    initialProfile?.homeAirportIds ?? ["mia"],
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialProfile?.interests ?? ["food", "nature"],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const response = await fetch("/api/traveler-profile", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fullName,
        email,
        homeAirportIds: selectedAirports,
        citizenship,
        passportCountry,
        interests: selectedInterests,
        budgetStyle,
        notes: notes || undefined,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => undefined);
      setError(payload?.error ?? "Unable to save traveler profile.");
      setPending(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="field-grid">
        <label>
          <span>Full name</span>
          <input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          <span>Citizenship</span>
          <input
            value={citizenship}
            onChange={(event) => setCitizenship(event.target.value)}
            required
          />
        </label>
        <label>
          <span>Passport country</span>
          <input
            value={passportCountry}
            onChange={(event) => setPassportCountry(event.target.value)}
            required
          />
        </label>
      </div>

      <fieldset>
        <legend>Home airports</legend>
        <div className="pill-grid">
          {airports
            .filter((airport) => airport.country === "United States")
            .map((airport) => {
              const checked = selectedAirports.includes(airport.id);
              return (
                <label className={`pill ${checked ? "active" : ""}`} key={airport.id}>
                  <input
                    checked={checked}
                    onChange={(event) => {
                      setSelectedAirports((current) =>
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
        <legend>Trip interests</legend>
        <div className="pill-grid">
          {interestOptions.map((interest) => {
            const checked = selectedInterests.includes(interest);
            return (
              <label className={`pill ${checked ? "active" : ""}`} key={interest}>
                <input
                  checked={checked}
                  onChange={(event) => {
                    setSelectedInterests((current) =>
                      event.target.checked
                        ? [...current, interest]
                        : current.filter((value) => value !== interest),
                    );
                  }}
                  type="checkbox"
                />
                {interest}
              </label>
            );
          })}
        </div>
      </fieldset>

      <label>
        <span>Budget style</span>
        <select value={budgetStyle} onChange={(event) => setBudgetStyle(event.target.value as TravelerProfile["budgetStyle"])}>
          <option value="shoestring">Shoestring</option>
          <option value="balanced">Balanced</option>
          <option value="premium-lite">Premium-lite</option>
        </select>
      </label>

      <label>
        <span>Notes for itinerary generation</span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Examples: no red-eye flights, prefer walkable neighborhoods, local food over tours."
          rows={4}
        />
      </label>

      {error ? <p className="error-text">{error}</p> : null}
      <button className="primary-button" disabled={pending} type="submit">
        {pending ? "Saving..." : "Save traveler profile"}
      </button>
    </form>
  );
}
