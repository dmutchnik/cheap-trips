import type { ReactNode } from "react";
import Link from "next/link";
import type { Route } from "next";
import { hasClerk } from "@/lib/env";

export function SiteShell({
  children,
  demoMode,
}: {
  children: ReactNode;
  demoMode: boolean;
}) {
  return (
    <div className="site-shell">
      <header className="topbar">
        <Link className="brand" href="/">
          Cheap Trips
        </Link>
        <nav className="nav">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/traveler-profile">Traveler Profile</Link>
          <Link href="/deal-watches/new">New Watch</Link>
          {hasClerk() ? <Link href={"/sign-in" as Route}>Sign in</Link> : null}
        </nav>
      </header>
      {demoMode ? (
        <div className="demo-banner">
          Demo mode is active. Clerk, Skyscanner, Resend, and OpenAI fall back to local behavior until credentials are configured.
        </div>
      ) : null}
      <main>{children}</main>
    </div>
  );
}
