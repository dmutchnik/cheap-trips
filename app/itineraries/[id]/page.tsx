import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getRepository } from "@/lib/repositories";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ItineraryPage({ params }: PageProps) {
  const user = await getCurrentUser();
  const { id } = await params;
  const repository = getRepository();
  const itinerary = await repository.getItinerary(user.userId, id);

  if (!itinerary) {
    notFound();
  }

  return (
    <section className="panel">
      <div className="section-title">
        <div>
          <h1>{itinerary.destinationCity} itinerary</h1>
          <p>
            {itinerary.travelDates.departureDate} to {itinerary.travelDates.returnDate}
          </p>
        </div>
      </div>
      <article className="list-card markdown">{itinerary.markdown}</article>
    </section>
  );
}
