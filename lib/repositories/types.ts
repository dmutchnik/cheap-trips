import type {
  BookedMatchInput,
  DashboardData,
  DealMatch,
  DealWatch,
  DealWatchInput,
  GeneratedItinerary,
  Region,
  TravelerProfile,
} from "@/lib/types";

export interface AppRepository {
  getDashboardData(userId: string): Promise<DashboardData>;
  getTravelerProfile(userId: string): Promise<TravelerProfile | undefined>;
  upsertTravelerProfile(
    profile: Omit<TravelerProfile, "updatedAt">,
  ): Promise<TravelerProfile>;
  getRegions(): Promise<Region[]>;
  getDealWatch(userId: string, watchId: string): Promise<DealWatch | undefined>;
  listActiveDealWatches(): Promise<DealWatch[]>;
  listDealMatches(userId: string): Promise<DealMatch[]>;
  getDealMatch(userId: string, matchId: string): Promise<DealMatch | undefined>;
  createDealWatch(userId: string, input: DealWatchInput): Promise<DealWatch>;
  updateDealWatch(
    userId: string,
    watchId: string,
    input: Partial<DealWatchInput>,
  ): Promise<DealWatch | undefined>;
  saveDealMatch(
    userId: string,
    match: Omit<DealMatch, "id" | "createdAt" | "status"> & {
      status?: DealMatch["status"];
    },
  ): Promise<DealMatch>;
  markDealMatchEmailed(matchId: string): Promise<DealMatch | undefined>;
  markDealMatchBooked(
    userId: string,
    matchId: string,
    input: BookedMatchInput,
  ): Promise<DealMatch | undefined>;
  getItinerary(userId: string, itineraryId: string): Promise<GeneratedItinerary | undefined>;
  getItineraryByMatchId(matchId: string): Promise<GeneratedItinerary | undefined>;
  saveItinerary(
    itinerary: Omit<GeneratedItinerary, "id" | "createdAt">,
  ): Promise<GeneratedItinerary>;
}
