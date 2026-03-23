import Link from "next/link";
import { getCatalogStats, getRegionGroups, regions } from "@/lib/data/regions";

export default function HomePage() {
  const stats = getCatalogStats();
  const groups = getRegionGroups();

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
            <strong>{stats.totalOriginAirports}</strong>
            <p>U.S. origin airports already modeled in the catalog.</p>
          </div>
          <div className="metric-card">
            <strong>{stats.totalRegions}</strong>
            <p>destination regions spanning {groups.join(", ")}.</p>
          </div>
          <div className="metric-card">
            <strong>{stats.totalDestinationAirports}</strong>
            <p>destination airports across {stats.totalCountries} countries.</p>
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
        {regions.slice(0, 4).map((region) => (
          <article className="list-card" key={region.id}>
            <span className="status-chip">{region.group}</span>
            <h2>{region.name}</h2>
            <p>{region.summary}</p>
            <p className="muted-text">Spotlight: {region.spotlightCities.join(", ")}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
