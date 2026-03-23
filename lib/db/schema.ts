import {
  boolean,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const travelerProfiles = pgTable("traveler_profiles", {
  userId: varchar("user_id", { length: 128 }).primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  homeAirportIds: jsonb("home_airport_ids").$type<string[]>().notNull(),
  citizenship: text("citizenship").notNull(),
  passportCountry: text("passport_country").notNull(),
  interests: jsonb("interests").$type<string[]>().notNull(),
  budgetStyle: varchar("budget_style", { length: 32 }).notNull(),
  notes: text("notes"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const regions = pgTable("regions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  summary: text("summary").notNull(),
});

export const regionAirports = pgTable("region_airports", {
  id: varchar("id", { length: 128 }).primaryKey(),
  regionId: varchar("region_id", { length: 64 }).notNull(),
  airportId: varchar("airport_id", { length: 16 }).notNull(),
});

export const dealWatches = pgTable("deal_watches", {
  id: varchar("id", { length: 128 }).primaryKey(),
  userId: varchar("user_id", { length: 128 }).notNull(),
  originAirportIds: jsonb("origin_airport_ids").$type<string[]>().notNull(),
  regionIds: jsonb("region_ids").$type<string[]>().notNull(),
  departureStart: text("departure_start").notNull(),
  departureEnd: text("departure_end").notNull(),
  tripLengthMinDays: integer("trip_length_min_days").notNull(),
  tripLengthMaxDays: integer("trip_length_max_days").notNull(),
  maxFareUsd: integer("max_fare_usd").notNull(),
  cabin: varchar("cabin", { length: 16 }).notNull(),
  adults: integer("adults").notNull(),
  status: varchar("status", { length: 16 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const dealMatches = pgTable("deal_matches", {
  id: varchar("id", { length: 128 }).primaryKey(),
  watchId: varchar("watch_id", { length: 128 }).notNull(),
  userId: varchar("user_id", { length: 128 }).notNull(),
  provider: varchar("provider", { length: 32 }).notNull(),
  destinationAirportId: varchar("destination_airport_id", { length: 16 }).notNull(),
  destinationCity: text("destination_city").notNull(),
  originAirportId: varchar("origin_airport_id", { length: 16 }).notNull(),
  departureDate: text("departure_date").notNull(),
  returnDate: text("return_date").notNull(),
  totalFareUsd: real("total_fare_usd").notNull(),
  currency: varchar("currency", { length: 8 }).notNull(),
  transferType: varchar("transfer_type", { length: 64 }).notNull(),
  stops: integer("stops").notNull(),
  deepLink: text("deep_link").notNull(),
  bookingPrefillSupported: boolean("booking_prefill_supported").notNull(),
  itinerarySnapshot: jsonb("itinerary_snapshot")
    .$type<{ cabin: "economy"; adults: 1 }>()
    .notNull(),
  status: varchar("status", { length: 16 }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  emailedAt: timestamp("emailed_at", { withTimezone: true }),
  bookedAt: timestamp("booked_at", { withTimezone: true }),
  confirmationCode: text("confirmation_code"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const itineraries = pgTable("itineraries", {
  id: varchar("id", { length: 128 }).primaryKey(),
  dealMatchId: varchar("deal_match_id", { length: 128 }).notNull(),
  userId: varchar("user_id", { length: 128 }).notNull(),
  destinationCity: text("destination_city").notNull(),
  departureDate: text("departure_date").notNull(),
  returnDate: text("return_date").notNull(),
  dailyPlans: jsonb("daily_plans")
    .$type<
      Array<{
        day: number;
        title: string;
        morning: string;
        afternoon: string;
        evening: string;
      }>
    >()
    .notNull(),
  budgetNotes: jsonb("budget_notes").$type<string[]>().notNull(),
  packingNotes: jsonb("packing_notes").$type<string[]>().notNull(),
  localTips: jsonb("local_tips").$type<string[]>().notNull(),
  markdown: text("markdown").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});
