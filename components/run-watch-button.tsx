"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RunWatchButton({ watchId }: { watchId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setMessage(null);
    const response = await fetch(`/api/internal/run-watch/${watchId}`, { method: "POST" });
    const payload = await response.json().catch(() => undefined);

    if (!response.ok) {
      setMessage(payload?.error ?? "Unable to run watch.");
      setPending(false);
      return;
    }

    setMessage(`Created ${payload.createdMatches} qualifying deal match${payload.createdMatches === 1 ? "" : "es"}.`);
    setPending(false);
    router.refresh();
  }

  return (
    <div className="inline-action">
      <button className="primary-button" disabled={pending} onClick={handleClick} type="button">
        {pending ? "Scanning..." : "Run watch now"}
      </button>
      {message ? <span className="muted-text">{message}</span> : null}
    </div>
  );
}
