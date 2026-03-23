import { addHours, isAfter, subHours } from "date-fns";
import { getAirportById, regionAirports } from "@/lib/data/regions";
import type { AppRepository } from "@/lib/repositories/types";
import type {
  DealMatch,
  DealSearchRequest,
  DealWatch,
  FlightCandidate,
} from "@/lib/types";
import { addDaysDate, enumerateDates, isoNow, unique } from "@/lib/utils";

export interface FlightProvider {
  searchIndicative(request: DealSearchRequest): Promise<FlightCandidate[]>;
  refreshLive(candidate: FlightCandidate): Promise<FlightCandidate | null>;
  getBookingHandoff(candidate: FlightCandidate): Promise<{
    deepLink: string;
    bookingPrefillSupported: boolean;
  }>;
}

export function expandDestinationAirportIds(regionIds: string[]) {
  return unique(
    regionAirports
      .filter((item) => regionIds.includes(item.regionId))
      .map((item) => item.airportId),
  );
}

export function buildSearchRequests(watch: DealWatch): DealSearchRequest[] {
  const departures = enumerateDates(watch.departureStart, watch.departureEnd);
  const destinationAirportIds = expandDestinationAirportIds(watch.regionIds);
  const requests: DealSearchRequest[] = [];

  for (const originAirportId of watch.originAirportIds) {
    for (const destinationAirportId of destinationAirportIds) {
      if (originAirportId === destinationAirportId) {
        continue;
      }

      for (const departureDate of departures) {
        for (
          let tripLength = watch.tripLengthMinDays;
          tripLength <= watch.tripLengthMaxDays;
          tripLength += 1
        ) {
          requests.push({
            watchId: watch.id,
            originAirportId,
            destinationAirportId,
            departureDate,
            returnDate: addDaysDate(departureDate, tripLength),
            maxFareUsd: watch.maxFareUsd,
          });
        }
      }
    }
  }

  return requests;
}

export function rankCandidates(candidates: FlightCandidate[]) {
  return [...candidates].sort((a, b) => {
    if (a.totalFareUsd !== b.totalFareUsd) {
      return a.totalFareUsd - b.totalFareUsd;
    }

    return a.stops - b.stops;
  });
}

export function shouldSuppressDuplicate(
  existingMatches: DealMatch[],
  candidate: FlightCandidate,
) {
  const cutoff = subHours(new Date(), 24);
  return existingMatches.some((match) => {
    if (
      match.watchId !== candidate.request.watchId ||
      match.originAirportId !== candidate.request.originAirportId ||
      match.destinationAirportId !== candidate.destinationAirportId ||
      match.departureDate !== candidate.request.departureDate ||
      match.returnDate !== candidate.request.returnDate
    ) {
      return false;
    }

    return isAfter(new Date(match.createdAt), cutoff);
  });
}

export async function processDealWatch(params: {
  repository: AppRepository;
  provider: FlightProvider;
  watch: DealWatch;
  userId: string;
}) {
  const { repository, provider, watch, userId } = params;
  const requests = buildSearchRequests(watch);
  const allCandidates = (
    await Promise.all(requests.map((request) => provider.searchIndicative(request)))
  ).flat();
  const underThreshold = allCandidates.filter(
    (candidate) => candidate.totalFareUsd <= watch.maxFareUsd,
  );
  const rankedCandidates = rankCandidates(underThreshold).slice(0, 6);
  const existingMatches = await repository.listDealMatches(userId);
  const createdMatches: DealMatch[] = [];
  const seenKeys = new Set<string>();

  for (const candidate of rankedCandidates) {
    const dedupeKey = [
      candidate.request.watchId,
      candidate.request.originAirportId,
      candidate.destinationAirportId,
      candidate.request.departureDate,
      candidate.request.returnDate,
    ].join(":");

    if (seenKeys.has(dedupeKey) || shouldSuppressDuplicate([...existingMatches, ...createdMatches], candidate)) {
      continue;
    }

    const refreshed = await provider.refreshLive(candidate);
    if (!refreshed || refreshed.totalFareUsd > watch.maxFareUsd) {
      continue;
    }

    const booking = await provider.getBookingHandoff(refreshed);
    const destinationAirport = getAirportById(refreshed.destinationAirportId);
    if (!destinationAirport) {
      continue;
    }

    const match = await repository.saveDealMatch(userId, {
      watchId: watch.id,
      userId,
      provider: "skyscanner",
      destinationAirportId: refreshed.destinationAirportId,
      destinationCity: refreshed.destinationCity || destinationAirport.city,
      originAirportId: refreshed.request.originAirportId,
      departureDate: refreshed.request.departureDate,
      returnDate: refreshed.request.returnDate,
      totalFareUsd: refreshed.totalFareUsd,
      currency: refreshed.currency,
      transferType: refreshed.transferType,
      stops: refreshed.stops,
      deepLink: booking.deepLink,
      bookingPrefillSupported: booking.bookingPrefillSupported,
      itinerarySnapshot: { cabin: "economy", adults: 1 },
      expiresAt: refreshed.expiresAt,
      emailedAt: undefined,
      bookedAt: undefined,
      confirmationCode: undefined,
    });

    createdMatches.push(match);
    seenKeys.add(dedupeKey);
  }

  return createdMatches;
}

export function computeExpiry(hours = 6) {
  return addHours(new Date(isoNow()), hours).toISOString();
}
