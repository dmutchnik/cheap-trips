import { describe, expect, it } from "vitest";
import {
  buildSearchRequests,
  processDealWatch,
  rankCandidates,
  shouldSuppressDuplicate,
} from "@/lib/deal-watches/engine";
import { MemoryRepository, resetMemoryState } from "@/lib/repositories/memory";
import type { DealWatch, FlightCandidate } from "@/lib/types";

const watch: DealWatch = {
  id: "watch_1",
  userId: "user_1",
  originAirportIds: ["mia"],
  regionIds: ["central-america"],
  departureStart: "2026-04-01",
  departureEnd: "2026-04-02",
  tripLengthMinDays: 4,
  tripLengthMaxDays: 5,
  maxFareUsd: 250,
  cabin: "economy",
  adults: 1,
  status: "active",
  createdAt: "2026-03-23T00:00:00.000Z",
  updatedAt: "2026-03-23T00:00:00.000Z",
};

function makeCandidate(overrides: Partial<FlightCandidate> = {}): FlightCandidate {
  return {
    request: {
      watchId: watch.id,
      originAirportId: "mia",
      destinationAirportId: "sjo",
      departureDate: "2026-04-01",
      returnDate: "2026-04-05",
      maxFareUsd: 250,
    },
    destinationCity: "San Jose",
    destinationAirportId: "sjo",
    provider: "skyscanner",
    itineraryId: "itin_1",
    deepLink: "https://example.com/book",
    totalFareUsd: 240,
    currency: "USD",
    transferType: "TRANSFER_TYPE_MANAGED",
    stops: 0,
    expiresAt: "2026-03-24T00:00:00.000Z",
    ...overrides,
  };
}

describe("deal watch engine", () => {
  it("expands dates and trip lengths into search requests", () => {
    const requests = buildSearchRequests(watch);
    expect(requests).toHaveLength(20);
    expect(requests[0]).toMatchObject({
      originAirportId: "mia",
      departureDate: "2026-04-01",
      returnDate: "2026-04-05",
    });
  });

  it("ranks cheapest fares first and then favors fewer stops", () => {
    const ranked = rankCandidates([
      makeCandidate({ itineraryId: "a", totalFareUsd: 260, stops: 0 }),
      makeCandidate({ itineraryId: "b", totalFareUsd: 220, stops: 1 }),
      makeCandidate({ itineraryId: "c", totalFareUsd: 220, stops: 0 }),
    ]);

    expect(ranked.map((item) => item.itineraryId)).toEqual(["c", "b", "a"]);
  });

  it("suppresses duplicate route/date matches created within 24 hours", () => {
    const duplicate = shouldSuppressDuplicate(
      [
        {
          id: "match_1",
          watchId: watch.id,
          userId: "user_1",
          provider: "skyscanner",
          destinationAirportId: "sjo",
          destinationCity: "San Jose",
          originAirportId: "mia",
          departureDate: "2026-04-01",
          returnDate: "2026-04-05",
          totalFareUsd: 230,
          currency: "USD",
          transferType: "TRANSFER_TYPE_MANAGED",
          stops: 0,
          deepLink: "https://example.com",
          bookingPrefillSupported: true,
          itinerarySnapshot: { cabin: "economy", adults: 1 },
          status: "emailed",
          expiresAt: "2026-03-24T00:00:00.000Z",
          createdAt: new Date().toISOString(),
        },
      ],
      makeCandidate(),
    );

    expect(duplicate).toBe(true);
  });

  it("creates a deal match only when a live-refreshed fare still meets threshold", async () => {
    resetMemoryState();
    const repository = new MemoryRepository();
    await repository.upsertTravelerProfile({
      userId: "user_1",
      fullName: "Test Traveler",
      email: "traveler@example.com",
      homeAirportIds: ["mia"],
      citizenship: "United States",
      passportCountry: "United States",
      interests: ["food"],
      budgetStyle: "balanced",
      notes: "",
    });

    const provider = {
      async searchIndicative(requestValue: FlightCandidate["request"]) {
        if (
          requestValue.destinationAirportId !== "sjo" ||
          requestValue.departureDate !== "2026-04-01" ||
          requestValue.returnDate !== "2026-04-05"
        ) {
          return [];
        }

        return [makeCandidate()];
      },
      async refreshLive(candidate: FlightCandidate) {
        return { ...candidate, totalFareUsd: 235 };
      },
      async getBookingHandoff() {
        return { deepLink: "https://example.com/live", bookingPrefillSupported: true };
      },
    };

    const matches = await processDealWatch({
      repository,
      provider,
      watch,
      userId: "user_1",
    });

    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({
      destinationCity: "San Jose",
      totalFareUsd: 235,
      deepLink: "https://example.com/live",
    });
  });
});
