import { addHours, differenceInCalendarDays } from "date-fns";
import { getAirportById } from "@/lib/data/regions";
import { env, hasSkyscanner } from "@/lib/env";
import type { FlightProvider } from "@/lib/deal-watches/engine";
import type { DealSearchRequest, FlightCandidate, TransferType } from "@/lib/types";

type IndicativeResult = {
  itineraryId: string;
  totalFareUsd: number;
  currency: string;
  deepLink: string;
  transferType: TransferType;
  stops: number;
};

function pseudoRandomNumber(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function parseIndicativeResponse(
  request: DealSearchRequest,
  payload: { results?: IndicativeResult[] },
): FlightCandidate[] {
  const destinationAirport = getAirportById(request.destinationAirportId);
  return (payload.results ?? []).map((result) => ({
    request,
    destinationCity: destinationAirport?.city ?? request.destinationAirportId,
    destinationAirportId: request.destinationAirportId,
    provider: "skyscanner",
    itineraryId: result.itineraryId,
    deepLink: result.deepLink,
    totalFareUsd: result.totalFareUsd,
    currency: result.currency,
    transferType: result.transferType,
    stops: result.stops,
    expiresAt: addHours(new Date(), 6).toISOString(),
  }));
}

export function parseLiveResponse(
  request: DealSearchRequest,
  payload: {
    itineraryId: string;
    totalFareUsd: number;
    currency: string;
    deepLink: string;
    transferType: TransferType;
    stops: number;
    expiresAt?: string;
  },
): FlightCandidate {
  const destinationAirport = getAirportById(request.destinationAirportId);
  return {
    request,
    destinationCity: destinationAirport?.city ?? request.destinationAirportId,
    destinationAirportId: request.destinationAirportId,
    provider: "skyscanner",
    itineraryId: payload.itineraryId,
    deepLink: payload.deepLink,
    totalFareUsd: payload.totalFareUsd,
    currency: payload.currency,
    transferType: payload.transferType,
    stops: payload.stops,
    expiresAt: payload.expiresAt ?? addHours(new Date(), 2).toISOString(),
  };
}

async function fetchJson<T>(url: string, init: RequestInit) {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Skyscanner request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export class SkyscannerFlightProvider implements FlightProvider {
  async searchIndicative(request: DealSearchRequest): Promise<FlightCandidate[]> {
    if (!hasSkyscanner()) {
      return this.getMockIndicativeResults(request);
    }

    const payload = await fetchJson<{ results: IndicativeResult[] }>(
      env.skyscannerIndicativeUrl!,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": env.skyscannerApiKey!,
        },
        body: JSON.stringify({
          query: {
            originAirportId: request.originAirportId,
            destinationAirportId: request.destinationAirportId,
            departureDate: request.departureDate,
            returnDate: request.returnDate,
            adults: 1,
            cabinClass: "economy",
          },
        }),
      },
    );

    return parseIndicativeResponse(request, payload);
  }

  async refreshLive(candidate: FlightCandidate): Promise<FlightCandidate | null> {
    if (!hasSkyscanner()) {
      const priceDelta = candidate.totalFareUsd <= candidate.request.maxFareUsd ? 0 : 18;
      return {
        ...candidate,
        totalFareUsd: Math.max(candidate.totalFareUsd - priceDelta, 129),
        expiresAt: addHours(new Date(), 2).toISOString(),
      };
    }

    const payload = await fetchJson<{
      itineraryId: string;
      totalFareUsd: number;
      currency: string;
      deepLink: string;
      transferType: TransferType;
      stops: number;
      expiresAt?: string;
    }>(env.skyscannerLivePollUrl!, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.skyscannerApiKey!,
      },
      body: JSON.stringify({
        itineraryId: candidate.itineraryId,
        originAirportId: candidate.request.originAirportId,
        destinationAirportId: candidate.request.destinationAirportId,
        departureDate: candidate.request.departureDate,
        returnDate: candidate.request.returnDate,
      }),
    });

    return parseLiveResponse(candidate.request, payload);
  }

  async getBookingHandoff(candidate: FlightCandidate) {
    return {
      deepLink: candidate.deepLink,
      bookingPrefillSupported: candidate.stops === 0,
    };
  }

  private getMockIndicativeResults(request: DealSearchRequest): FlightCandidate[] {
    const destinationAirport = getAirportById(request.destinationAirportId);
    const seed = `${request.originAirportId}:${request.destinationAirportId}:${request.departureDate}:${request.returnDate}`;
    const tripDays = differenceInCalendarDays(
      new Date(request.returnDate),
      new Date(request.departureDate),
    );
    const random = pseudoRandomNumber(seed);
    const totalFareUsd = 140 + (random % 220) + tripDays * 8;
    const transferType: TransferType =
      random % 5 === 0
        ? "TRANSFER_TYPE_PROTECTED_SELF_TRANSFER"
        : random % 3 === 0
          ? "TRANSFER_TYPE_SELF_TRANSFER"
          : "TRANSFER_TYPE_MANAGED";
    const stops = transferType === "TRANSFER_TYPE_MANAGED" ? random % 2 : 1;

    return [
      {
        request,
        destinationCity: destinationAirport?.city ?? request.destinationAirportId,
        destinationAirportId: request.destinationAirportId,
        provider: "skyscanner",
        itineraryId: `itin_${seed.replace(/[^a-z0-9]/gi, "")}`,
        deepLink: `${env.appUrl}/deal-matches/mock-${seed.replace(/[^a-z0-9]/gi, "")}`,
        totalFareUsd,
        currency: "USD",
        transferType,
        stops,
        expiresAt: addHours(new Date(), 4).toISOString(),
      },
    ];
  }
}
