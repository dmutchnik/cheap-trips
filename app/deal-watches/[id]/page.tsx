import { notFound } from "next/navigation";
import { DealWatchForm } from "@/components/deal-watch-form";
import { RunWatchButton } from "@/components/run-watch-button";
import { getCurrentUser } from "@/lib/auth";
import { airports, regions } from "@/lib/data/regions";
import { getRepository } from "@/lib/repositories";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DealWatchDetailPage({ params }: PageProps) {
  const user = await getCurrentUser();
  const { id } = await params;
  const repository = getRepository();
  const watch = await repository.getDealWatch(user.userId, id);

  if (!watch) {
    notFound();
  }

  return (
    <section className="panel">
      <div className="section-title">
        <div>
          <h1>Edit deal watch</h1>
          <p>Update thresholds or manually trigger a scan.</p>
        </div>
        <RunWatchButton watchId={watch.id} />
      </div>
      <DealWatchForm airports={airports} initialWatch={watch} regions={regions} />
    </section>
  );
}
