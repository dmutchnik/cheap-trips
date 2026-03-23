import { TravelerProfileForm } from "@/components/traveler-profile-form";
import { getCurrentUser } from "@/lib/auth";
import { airports } from "@/lib/data/regions";
import { getRepository } from "@/lib/repositories";

export default async function TravelerProfilePage() {
  const user = await getCurrentUser();
  const repository = getRepository();
  const profile = await repository.getTravelerProfile(user.userId);

  return (
    <section className="panel">
      <div className="section-title">
        <div>
          <h1>Traveler profile</h1>
          <p>Store passenger details and itinerary preferences. Payment cards stay outside the app.</p>
        </div>
      </div>
      <TravelerProfileForm airports={airports} initialProfile={profile} />
    </section>
  );
}
