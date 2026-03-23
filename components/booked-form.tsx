"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export function BookedForm({ matchId }: { matchId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    const response = await fetch(`/api/deal-matches/${matchId}/booked`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        confirmationCode: confirmationCode || undefined,
      }),
    });
    const payload = await response.json().catch(() => undefined);

    if (!response.ok) {
      setMessage(payload?.error ?? "Unable to save booking.");
      setPending(false);
      return;
    }

    setPending(false);
    router.push(`/itineraries/${payload.itinerary.id}`);
    router.refresh();
  }

  return (
    <form className="form-card compact" onSubmit={handleSubmit}>
      <label>
        <span>Confirmation code (optional)</span>
        <input
          value={confirmationCode}
          onChange={(event) => setConfirmationCode(event.target.value)}
          placeholder="ABC123"
        />
      </label>
      {message ? <p className="error-text">{message}</p> : null}
      <button className="primary-button" disabled={pending} type="submit">
        {pending ? "Generating..." : "I booked this"}
      </button>
    </form>
  );
}
