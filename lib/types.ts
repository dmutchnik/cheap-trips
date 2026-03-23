export type CabinClass = "economy";
export type DealWatchStatus = "active" | "paused";
export type DealMatchStatus = "pending" | "emailed" | "booked";
export type TransferType =
  | "TRANSFER_TYPE_MANAGED"
  | "TRANSFER_TYPE_SELF_TRANSFER"
  | "TRANSFER_TYPE_PROTECTED_SELF_TRANSFER"
  | "TRANSFER_TYPE_UNSPECIFIED";

export type Region = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  group: "Latin America" | "Caribbean" | "Europe" | "Asia-Pacific";
  spotlightCities: string[];
};

export type Airport = {
  id: string;
  iataCode: string;
  city: string;
  name: string;
  country: string;
};

export type RegionAirport = {
  regionId: string;
  airportId: string;
};

export type TravelerProfile = {
  userId: string;
  fullName: string;
  email: string;
  homeAirportIds: string[];
  citizenship: string;
  passportCountry: string;
  interests: string[];
  budgetStyle: "shoestring" | "balanced" | "premium-lite";
  notes?: string;
  updatedAt: string;
};

export type DealWatchInput = {
  originAirportIds: string[];
  regionIds: string[];
  departureStart: string;
  departureEnd: string;
  tripLengthMinDays: number;
  tripLengthMaxDays: number;
  maxFareUsd: number;
};

export type DealWatch = DealWatchInput & {
  id: string;
  userId: string;
  cabin: CabinClass;
  adults: 1;
  status: DealWatchStatus;
  createdAt: string;
  updatedAt: string;
};

export type DealSearchRequest = {
  watchId: string;
  originAirportId: string;
  destinationAirportId: string;
  departureDate: string;
  returnDate: string;
  maxFareUsd: number;
};

export type FlightCandidate = {
  request: DealSearchRequest;
  destinationCity: string;
  destinationAirportId: string;
  provider: "skyscanner";
  itineraryId: string;
  deepLink: string;
  totalFareUsd: number;
  currency: string;
  transferType: TransferType;
  stops: number;
  expiresAt: string;
};

export type DealMatch = {
  id: string;
  watchId: string;
  userId: string;
  provider: "skyscanner";
  destinationAirportId: string;
  destinationCity: string;
  originAirportId: string;
  departureDate: string;
  returnDate: string;
  totalFareUsd: number;
  currency: string;
  transferType: TransferType;
  stops: number;
  deepLink: string;
  bookingPrefillSupported: boolean;
  itinerarySnapshot: {
    cabin: CabinClass;
    adults: 1;
  };
  status: DealMatchStatus;
  expiresAt: string;
  emailedAt?: string;
  bookedAt?: string;
  confirmationCode?: string;
  createdAt: string;
};

export type BookedMatchInput = {
  confirmationCode?: string;
  notes?: string;
};

export type GeneratedItinerary = {
  id: string;
  dealMatchId: string;
  userId: string;
  destinationCity: string;
  travelDates: {
    departureDate: string;
    returnDate: string;
  };
  dailyPlans: Array<{
    day: number;
    title: string;
    morning: string;
    afternoon: string;
    evening: string;
  }>;
  budgetNotes: string[];
  packingNotes: string[];
  localTips: string[];
  markdown: string;
  createdAt: string;
};

export type DashboardData = {
  profile?: TravelerProfile;
  watches: DealWatch[];
  matches: DealMatch[];
  itineraries: GeneratedItinerary[];
};
