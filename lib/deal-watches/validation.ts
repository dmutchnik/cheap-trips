import { z } from "zod";

export const travelerProfileSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  homeAirportIds: z.array(z.string()).min(1),
  citizenship: z.string().min(2),
  passportCountry: z.string().min(2),
  interests: z.array(z.string()).min(1),
  budgetStyle: z.enum(["shoestring", "balanced", "premium-lite"]),
  notes: z.string().max(500).optional(),
});

export const dealWatchInputSchema = z.object({
  originAirportIds: z.array(z.string()).min(1),
  regionIds: z.array(z.string()).min(1),
  departureStart: z.string().date(),
  departureEnd: z.string().date(),
  tripLengthMinDays: z.number().int().min(2).max(21),
  tripLengthMaxDays: z.number().int().min(2).max(30),
  maxFareUsd: z.number().int().min(120).max(1500),
});

export const dealWatchSchema = dealWatchInputSchema
  .refine((value) => value.departureEnd >= value.departureStart, {
    message: "Departure end must be on or after departure start.",
    path: ["departureEnd"],
  })
  .refine((value) => value.tripLengthMaxDays >= value.tripLengthMinDays, {
    message: "Trip length max must be greater than or equal to the minimum.",
    path: ["tripLengthMaxDays"],
  });

export const partialDealWatchSchema = dealWatchInputSchema.partial();
