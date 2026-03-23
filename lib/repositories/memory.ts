import { airports, regionAirports, regions } from "@/lib/data/regions";
import type { AppRepository } from "@/lib/repositories/types";
import type {
  BookedMatchInput,
  DashboardData,
  DealMatch,
  DealWatch,
  DealWatchInput,
  GeneratedItinerary,
  TravelerProfile,
} from "@/lib/types";
import { isoNow, unique } from "@/lib/utils";

type MemoryState = {
  travelerProfiles: TravelerProfile[];
  dealWatches: DealWatch[];
  dealMatches: DealMatch[];
  itineraries: GeneratedItinerary[];
};

declare global {
  var __cheapTripsMemory__: MemoryState | undefined;
}

function createInitialState(): MemoryState {
  return {
    travelerProfiles: [],
    dealWatches: [],
    dealMatches: [],
    itineraries: [],
  };
}

export function resetMemoryState() {
  globalThis.__cheapTripsMemory__ = createInitialState();
}

function getState() {
  if (!globalThis.__cheapTripsMemory__) {
    globalThis.__cheapTripsMemory__ = createInitialState();
  }

  return globalThis.__cheapTripsMemory__;
}

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export class MemoryRepository implements AppRepository {
  async getDashboardData(userId: string): Promise<DashboardData> {
    const state = getState();
    return {
      profile: state.travelerProfiles.find((item) => item.userId === userId),
      watches: state.dealWatches.filter((item) => item.userId === userId),
      matches: state.dealMatches.filter((item) => item.userId === userId),
      itineraries: state.itineraries.filter((item) => item.userId === userId),
    };
  }

  async getTravelerProfile(userId: string) {
    return getState().travelerProfiles.find((item) => item.userId === userId);
  }

  async upsertTravelerProfile(profile: Omit<TravelerProfile, "updatedAt">) {
    const state = getState();
    const next: TravelerProfile = { ...profile, updatedAt: isoNow() };
    const existingIndex = state.travelerProfiles.findIndex(
      (item) => item.userId === profile.userId,
    );

    if (existingIndex >= 0) {
      state.travelerProfiles[existingIndex] = next;
    } else {
      state.travelerProfiles.push(next);
    }

    return next;
  }

  async getRegions() {
    return regions;
  }

  async getDealWatch(userId: string, watchId: string) {
    return getState().dealWatches.find(
      (watch) => watch.userId === userId && watch.id === watchId,
    );
  }

  async listActiveDealWatches() {
    return getState().dealWatches.filter((watch) => watch.status === "active");
  }

  async listDealMatches(userId: string) {
    return getState().dealMatches.filter((match) => match.userId === userId);
  }

  async getDealMatch(userId: string, matchId: string) {
    return getState().dealMatches.find(
      (match) => match.userId === userId && match.id === matchId,
    );
  }

  async createDealWatch(userId: string, input: DealWatchInput) {
    const state = getState();
    const now = isoNow();
    const watch: DealWatch = {
      id: id("watch"),
      userId,
      ...input,
      cabin: "economy",
      adults: 1,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
    state.dealWatches.unshift(watch);
    return watch;
  }

  async updateDealWatch(
    userId: string,
    watchId: string,
    input: Partial<DealWatchInput>,
  ) {
    const state = getState();
    const existing = state.dealWatches.find(
      (watch) => watch.userId === userId && watch.id === watchId,
    );
    if (!existing) {
      return undefined;
    }

    Object.assign(existing, input, { updatedAt: isoNow() });
    return existing;
  }

  async saveDealMatch(
    userId: string,
    match: Omit<DealMatch, "id" | "createdAt" | "status"> & {
      status?: DealMatch["status"];
    },
  ) {
    const state = getState();
    const duplicate = state.dealMatches.find(
      (item) =>
        item.watchId === match.watchId &&
        item.originAirportId === match.originAirportId &&
        item.destinationAirportId === match.destinationAirportId &&
        item.departureDate === match.departureDate &&
        item.returnDate === match.returnDate,
    );

    if (duplicate) {
      return duplicate;
    }

    const next: DealMatch = {
      id: id("match"),
      createdAt: isoNow(),
      status: match.status ?? "pending",
      ...match,
      userId,
    };

    state.dealMatches.unshift(next);
    return next;
  }

  async markDealMatchEmailed(matchId: string) {
    const match = getState().dealMatches.find((item) => item.id === matchId);
    if (!match) {
      return undefined;
    }

    match.emailedAt = isoNow();
    match.status = match.status === "booked" ? "booked" : "emailed";
    return match;
  }

  async markDealMatchBooked(userId: string, matchId: string, input: BookedMatchInput) {
    const match = getState().dealMatches.find(
      (item) => item.userId === userId && item.id === matchId,
    );
    if (!match) {
      return undefined;
    }

    match.bookedAt = isoNow();
    match.confirmationCode = input.confirmationCode;
    match.status = "booked";
    return match;
  }

  async getItinerary(userId: string, itineraryId: string) {
    return getState().itineraries.find(
      (item) => item.userId === userId && item.id === itineraryId,
    );
  }

  async getItineraryByMatchId(matchId: string) {
    return getState().itineraries.find((item) => item.dealMatchId === matchId);
  }

  async saveItinerary(itinerary: Omit<GeneratedItinerary, "id" | "createdAt">) {
    const state = getState();
    const next: GeneratedItinerary = {
      ...itinerary,
      id: id("itinerary"),
      createdAt: isoNow(),
    };

    state.itineraries.unshift(next);
    return next;
  }
}

export function getAirportOptionsForUserProfile(homeAirportIds: string[]) {
  return unique(homeAirportIds)
    .map((idValue) => airports.find((airport) => airport.id === idValue))
    .filter(Boolean);
}

export function listAirportsForRegions(regionIds: string[]) {
  return unique(
    regionAirports
      .filter((item) => regionIds.includes(item.regionId))
      .map((item) => item.airportId),
  )
    .map((airportId) => airports.find((airport) => airport.id === airportId))
    .filter(Boolean);
}
