import Link from "next/link";
import { notFound } from "next/navigation";
import { BookedForm } from "@/components/booked-form";
import { getCurrentUser } from "@/lib/auth";
import { getAirportById } from "@/lib/data/regions";
import { getRepository } from "@/lib/repositories";
import { currency } from "@/lib/utils";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DealMatchDetailPage({ params }: PageProps) {
  const user = await getCurrentUser();
  const { id } = await params;
  const repository = getRepository();
  const match = await repository.getDealMatch(user.userId, id);

  if (!match) {
    notFound();
  }

  return (
    <section className="panel">
      <div className="section-title">
        <div>
          <h1>{match.destinationCity}</h1>
          <p>Review the fare, open the partner booking handoff, then confirm if you booked it.</p>
        </div>
        <span className="status-chip">{match.status}</span>
      </div>
      <div className="card-grid">
        <article className="list-card">
          <h2>Fare details</h2>
          <p>
            {getAirportById(match.originAirportId)?.iataCode ?? match.originAirportId} to{" "}
            {getAirportById(match.destinationAirportId)?.iataCode ?? match.destinationAirportId}
          </p>
          <p>
            {match.departureDate} to {match.returnDate}
          </p>
          <p>{currency(match.totalFareUsd)}</p>
          <p>Transfer type: {match.transferType}</p>
          <p>Stops: {match.stops}</p>
          <div className="action-row">
            <a className="primary-button" href={match.deepLink} rel="noreferrer" target="_blank">
              Open booking handoff
            </a>
            <Link className="ghost-button" href="/dashboard">
              Back to dashboard
            </Link>
          </div>
        </article>
        <article className="list-card">
          <h2>Booking confirmation</h2>
          <p>
            v1 uses assisted checkout. If partner prefill is supported, it can be used in
            the handoff; otherwise the traveler re-enters their details on the booking site.
          </p>
          <BookedForm matchId={match.id} />
        </article>
      </div>
    </section>
  );
}
