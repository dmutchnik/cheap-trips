import { DealWatchForm } from "@/components/deal-watch-form";
import { airports, regions } from "@/lib/data/regions";

export default function NewDealWatchPage() {
  return (
    <section className="panel">
      <div className="section-title">
        <div>
          <h1>Create deal watch</h1>
          <p>Choose U.S. origin airports, destination regions, a travel window, and a price ceiling.</p>
        </div>
      </div>
      <DealWatchForm airports={airports} regions={regions} />
    </section>
  );
}
