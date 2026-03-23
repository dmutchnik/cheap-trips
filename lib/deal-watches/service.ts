import { generateItinerary } from "@/lib/ai/itinerary";
import { processDealWatch } from "@/lib/deal-watches/engine";
import { sendDealMatchEmail, sendItineraryEmail } from "@/lib/email";
import { SkyscannerFlightProvider } from "@/lib/providers/flights/skyscanner";
import { getRepository } from "@/lib/repositories";
import type { BookedMatchInput, DealMatch, GeneratedItinerary } from "@/lib/types";

export async function runDealWatchForUser(userId: string, watchId: string) {
  const repository = getRepository();
  const watch = await repository.getDealWatch(userId, watchId);
  if (!watch) {
    throw new Error("Deal watch not found.");
  }

  const profile = await repository.getTravelerProfile(userId);
  if (!profile) {
    throw new Error("Traveler profile required before running watch.");
  }

  const provider = new SkyscannerFlightProvider();
  const matches = await processDealWatch({
    repository,
    provider,
    watch,
    userId,
  });

  for (const match of matches) {
    await sendDealMatchEmail(match, profile);
    await repository.markDealMatchEmailed(match.id);
  }

  return matches;
}

export async function markDealMatchBookedAndGenerate(
  userId: string,
  matchId: string,
  input: BookedMatchInput,
) {
  const repository = getRepository();
  const profile = await repository.getTravelerProfile(userId);
  if (!profile) {
    throw new Error("Traveler profile required before generating itinerary.");
  }

  const match = await repository.markDealMatchBooked(userId, matchId, input);
  if (!match) {
    throw new Error("Deal match not found.");
  }

  const existing = await repository.getItineraryByMatchId(match.id);
  if (existing) {
    return { match, itinerary: existing };
  }

  const generated = await generateItinerary(match, profile);
  const itinerary = await repository.saveItinerary(generated);
  await sendItineraryEmail(itinerary, profile);

  return { match, itinerary };
}

export async function runAllActiveWatches() {
  const repository = getRepository();
  const watches = await repository.listActiveDealWatches();
  const created: DealMatch[] = [];

  for (const watch of watches) {
    const matches = await runDealWatchForUser(watch.userId, watch.id);
    created.push(...matches);
  }

  return created;
}

export async function getGeneratedItineraryForUser(
  userId: string,
  itineraryId: string,
): Promise<GeneratedItinerary | undefined> {
  const repository = getRepository();
  return repository.getItinerary(userId, itineraryId);
}
