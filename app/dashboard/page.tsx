import Link from "next/link";
import { RunWatchButton } from "@/components/run-watch-button";
import { getCurrentUser } from "@/lib/auth";
import {
  getAirportById,
  getCatalogStats,
  getDestinationAirportCountForRegions,
  getRegionById,
} from "@/lib/data/regions";
import { getRepository } from "@/lib/repositories";
import { currency } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const repository = getRepository();
  const dashboard = await repository.getDashboardData(user.userId);
  const catalogStats = getCatalogStats();

  return (
    <div className="dashboard-grid">
      <section className="panel">
        <div className="section-title">
          <div>
            <h1>Dashboard</h1>
            <p>Deal watches, matches, and itineraries for the current traveler.</p>
          </div>
        </div>
        {dashboard.profile ? (
          <div className="list-card">
            <div className="stat-line">
              <span className="status-chip">{dashboard.profile.budgetStyle}</span>
              <span>{dashboard.profile.fullName}</span>
            </div>
            <p>{dashboard.profile.email}</p>
            <p>
              Home airports:{" "}
              {dashboard.profile.homeAirportIds
                .map((airportId) => getAirportById(airportId)?.iataCode ?? airportId)
                .join(", ")}
            </p>
            <Link className="ghost-button" href="/traveler-profile">
              Edit traveler profile
            </Link>
          </div>
        ) : (
          <div className="list-card">
            <p>Create a traveler profile before running your first watch.</p>
            <Link className="primary-button" href="/traveler-profile">
              Add traveler profile
            </Link>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="section-title">
          <div>
            <h2>Deal watches</h2>
            <p>Thresholds, regions, and date windows.</p>
          </div>
          <Link className="ghost-button" href="/deal-watches/new">
            New watch
          </Link>
        </div>
        {dashboard.watches.length ? (
          dashboard.watches.map((watch) => (
            <article className="list-card" key={watch.id}>
              <div className="stat-line">
                <span className="status-chip">{currency(watch.maxFareUsd)}</span>
                <strong>
                  {watch.originAirportIds
                  .map((airportId) => getAirportById(airportId)?.iataCode ?? airportId)
                  .join(", ")}{" "}
                  to{" "}
                  {watch.regionIds
                    .map((regionId) => getRegionById(regionId)?.name ?? regionId)
                    .join(", ")}
                </strong>
              </div>
              <p>
                {watch.departureStart} to {watch.departureEnd} · {watch.tripLengthMinDays}-
                {watch.tripLengthMaxDays} day trips
              </p>
              <p className="muted-text">
                Coverage: {getDestinationAirportCountForRegions(watch.regionIds)} destination airports
              </p>
              <div className="action-row">
                <Link className="ghost-button" href={`/deal-watches/${watch.id}`}>
                  View watch
                </Link>
                <RunWatchButton watchId={watch.id} />
              </div>
            </article>
          ))
        ) : (
          <div className="list-card">
            <p>No deal watches yet.</p>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="section-title">
          <div>
            <h2>Network scale</h2>
            <p>Current catalog coverage available to every new watch.</p>
          </div>
        </div>
        <div className="stats-strip">
          <div className="metric-card compact">
            <strong>{catalogStats.totalRegions}</strong>
            <p>regions</p>
          </div>
          <div className="metric-card compact">
            <strong>{catalogStats.totalDestinationAirports}</strong>
            <p>destination airports</p>
          </div>
          <div className="metric-card compact">
            <strong>{catalogStats.totalCountries}</strong>
            <p>countries covered</p>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <div>
            <h2>Recent matches</h2>
            <p>Live-refreshed fares that met the watch threshold.</p>
          </div>
        </div>
        {dashboard.matches.length ? (
          dashboard.matches.map((match) => (
            <article className="list-card" key={match.id}>
              <div className="stat-line">
                <span className="status-chip">{match.status}</span>
                <strong>
                  {getAirportById(match.originAirportId)?.iataCode ?? match.originAirportId} to{" "}
                  {match.destinationCity}
                </strong>
              </div>
              <p>
                {match.departureDate} to {match.returnDate} · {currency(match.totalFareUsd)} ·{" "}
                {match.transferType}
              </p>
              <Link className="ghost-button" href={`/deal-matches/${match.id}`}>
                View match
              </Link>
            </article>
          ))
        ) : (
          <div className="list-card">
            <p>No matches yet. Run a watch to simulate or fetch qualifying fares.</p>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="section-title">
          <div>
            <h2>Itineraries</h2>
            <p>Generated only after the user confirms a booking.</p>
          </div>
        </div>
        {dashboard.itineraries.length ? (
          dashboard.itineraries.map((itinerary) => (
            <article className="list-card" key={itinerary.id}>
              <strong>{itinerary.destinationCity}</strong>
              <p>
                {itinerary.travelDates.departureDate} to {itinerary.travelDates.returnDate}
              </p>
              <Link className="ghost-button" href={`/itineraries/${itinerary.id}`}>
                View itinerary
              </Link>
            </article>
          ))
        ) : (
          <div className="list-card">
            <p>No itineraries yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
