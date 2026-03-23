import { describe, expect, it } from "vitest";
import { parseIndicativeResponse, parseLiveResponse } from "@/lib/providers/flights/skyscanner";
import { markDealMatchBookedAndGenerate } from "@/lib/deal-watches/service";
import { MemoryRepository, resetMemoryState } from "@/lib/repositories/memory";
import { getRepository } from "@/lib/repositories";
import type { DealSearchRequest } from "@/lib/types";

const request: DealSearchRequest = {
  watchId: "watch_1",
  originAirportId: "mia",
  destinationAirportId: "sjo",
  departureDate: "2026-04-01",
  returnDate: "2026-04-05",
  maxFareUsd: 250,
};

describe("Skyscanner parsing", () => {
  it("maps indicative API payloads into candidates", () => {
    const candidates = parseIndicativeResponse(request, {
      results: [
        {
          itineraryId: "itin_1",
          totalFareUsd: 199,
          currency: "USD",
          deepLink: "https://example.com/1",
          transferType: "TRANSFER_TYPE_MANAGED",
          stops: 0,
        },
      ],
    });

    expect(candidates[0]).toMatchObject({
      destinationCity: "San Jose",
      totalFareUsd: 199,
      transferType: "TRANSFER_TYPE_MANAGED",
    });
  });

  it("maps live refresh payloads into candidates", () => {
    const candidate = parseLiveResponse(request, {
      itineraryId: "itin_1",
      totalFareUsd: 212,
      currency: "USD",
      deepLink: "https://example.com/live",
      transferType: "TRANSFER_TYPE_SELF_TRANSFER",
      stops: 1,
    });

    expect(candidate).toMatchObject({
      destinationAirportId: "sjo",
      totalFareUsd: 212,
      transferType: "TRANSFER_TYPE_SELF_TRANSFER",
    });
  });
});

describe("booked flow", () => {
  it("marks the match booked and generates an itinerary", async () => {
    resetMemoryState();
    const repository = new MemoryRepository();
    await repository.upsertTravelerProfile({
      userId: "user_1",
      fullName: "Test Traveler",
      email: "traveler@example.com",
      homeAirportIds: ["mia"],
      citizenship: "United States",
      passportCountry: "United States",
      interests: ["food", "nature"],
      budgetStyle: "balanced",
      notes: "Prefer walkable areas.",
    });

    const watch = await repository.createDealWatch("user_1", {
      originAirportIds: ["mia"],
      regionIds: ["central-america"],
      departureStart: "2026-04-01",
      departureEnd: "2026-04-10",
      tripLengthMinDays: 4,
      tripLengthMaxDays: 6,
      maxFareUsd: 250,
    });

    const match = await repository.saveDealMatch("user_1", {
      watchId: watch.id,
      userId: "user_1",
      provider: "skyscanner",
      destinationAirportId: "sjo",
      destinationCity: "San Jose",
      originAirportId: "mia",
      departureDate: "2026-04-01",
      returnDate: "2026-04-05",
      totalFareUsd: 225,
      currency: "USD",
      transferType: "TRANSFER_TYPE_MANAGED",
      stops: 0,
      deepLink: "https://example.com/book",
      bookingPrefillSupported: true,
      itinerarySnapshot: { cabin: "economy", adults: 1 },
      expiresAt: "2026-04-01T10:00:00.000Z",
      emailedAt: undefined,
      bookedAt: undefined,
      confirmationCode: undefined,
    });

    expect(getRepository()).toBeInstanceOf(MemoryRepository);

    const result = await markDealMatchBookedAndGenerate("user_1", match.id, {
      confirmationCode: "ABC123",
    });

    expect(result.match.status).toBe("booked");
    expect(result.itinerary.destinationCity).toBe("San Jose");
    expect(result.itinerary.dailyPlans.length).toBeGreaterThan(1);
    expect(result.itinerary.markdown).toContain("# San Jose itinerary");
  });
});
