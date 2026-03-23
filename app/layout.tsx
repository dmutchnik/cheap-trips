import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Cheap Trips MVP",
  description: "Threshold-based cheap flight discovery with assisted booking and AI itineraries.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body>
        <SiteShell demoMode={user.demoMode}>{children}</SiteShell>
      </body>
    </html>
  );
}
