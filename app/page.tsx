import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="hero">
        <div className="hero-card hero-copy">
          <span className="status-chip">Cheap flight threshold engine</span>
          <h1>Let the trip pick itself.</h1>
          <p>
            Users set a price ceiling, a travel window, and a region. Cheap Trips scans
            partner inventory, confirms live fares, hands off the booking, then writes a
            destination-aware itinerary once the trip is confirmed.
          </p>
          <div className="action-row">
            <Link className="primary-button" href="/traveler-profile">
              Set up traveler profile
            </Link>
            <Link className="ghost-button" href="/dashboard">
              View dashboard
            </Link>
          </div>
        </div>

        <div className="hero-grid">
          <div className="metric-card">
            <strong>1</strong>
            <p>adult traveler, round-trip economy, U.S. departure airports.</p>
          </div>
          <div className="metric-card">
            <strong>Hourly</strong>
            <p>watch scanning via Inngest cron plus manual run-now support in the dashboard.</p>
          </div>
          <div className="metric-card">
            <strong>Regions</strong>
            <p>Predefined region sets like South America, Central America, and Andes Cities.</p>
          </div>
        </div>
      </section>

      <section className="card-grid">
        <article className="list-card">
          <h2>What the MVP does</h2>
          <p>Captures traveler defaults, creates deal watches, live-refreshes cheap fares, emails matches, and generates a post-booking itinerary.</p>
        </article>
        <article className="list-card">
          <h2>What it does not do</h2>
          <p>No scraping, no payment-card storage, and no fully automated purchase flow in v1.</p>
        </article>
      </section>
    </div>
  );
}
