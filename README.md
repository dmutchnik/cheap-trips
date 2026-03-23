# Cheap Trips MVP

Responsive flight-deal web app for threshold-based leisure trip discovery, assisted checkout, and AI itinerary generation.

## Stack

- Next.js 15 App Router
- TypeScript
- Drizzle ORM with Postgres schema
- Clerk auth with demo fallback
- Inngest jobs
- Resend email with console fallback
- OpenAI itinerary generation with local fallback

## Quick start

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Run `npm run dev`.

The app works in a demo mode if Clerk, Resend, OpenAI, or Skyscanner credentials are not configured.
