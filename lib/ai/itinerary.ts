import { differenceInCalendarDays } from "date-fns";
import OpenAI from "openai";
import { z } from "zod";
import { hasOpenAI, env } from "@/lib/env";
import type { DealMatch, GeneratedItinerary, TravelerProfile } from "@/lib/types";
import { isoNow } from "@/lib/utils";

const itinerarySchema = z.object({
  destinationCity: z.string(),
  dailyPlans: z.array(
    z.object({
      day: z.number().int().min(1),
      title: z.string(),
      morning: z.string(),
      afternoon: z.string(),
      evening: z.string(),
    }),
  ),
  budgetNotes: z.array(z.string()),
  packingNotes: z.array(z.string()),
  localTips: z.array(z.string()),
});

function renderMarkdown(result: z.infer<typeof itinerarySchema>, match: DealMatch) {
  const dayBlocks = result.dailyPlans
    .map(
      (plan) =>
        `## Day ${plan.day}: ${plan.title}\n\nMorning: ${plan.morning}\n\nAfternoon: ${plan.afternoon}\n\nEvening: ${plan.evening}`,
    )
    .join("\n\n");

  return `# ${result.destinationCity} itinerary\n\nTravel dates: ${match.departureDate} to ${match.returnDate}\n\n${dayBlocks}\n\n## Budget notes\n${result.budgetNotes.map((item) => `- ${item}`).join("\n")}\n\n## Packing notes\n${result.packingNotes.map((item) => `- ${item}`).join("\n")}\n\n## Local tips\n${result.localTips.map((item) => `- ${item}`).join("\n")}`;
}

function buildFallback(match: DealMatch, profile: TravelerProfile) {
  const dayCount = Math.max(
    differenceInCalendarDays(new Date(match.returnDate), new Date(match.departureDate)),
    2,
  );

  const dailyPlans = Array.from({ length: dayCount }, (_, index) => ({
    day: index + 1,
    title: index === 0 ? "Arrival and neighborhood bearings" : `Flexible ${profile.budgetStyle} day`,
    morning:
      index === 0
        ? `Arrive in ${match.destinationCity}, check in, and find a coffee spot near your base.`
        : `Start with a walk through a central neighborhood tied to ${profile.interests[0] ?? "local culture"}.`,
    afternoon:
      index === dayCount - 1
        ? "Keep the afternoon loose for packing, a final meal, and airport buffer time."
        : "Use the afternoon for one anchor activity plus an unplanned hour to wander.",
    evening:
      index === dayCount - 1
        ? "Head to the airport early and keep dinner simple."
        : "Pick a casual dinner district and finish with an easy scenic stop.",
  }));

  const result = {
    destinationCity: match.destinationCity,
    dailyPlans,
    budgetNotes: [
      `You targeted a ${Math.round(match.totalFareUsd)} USD flight, so keep daily spend focused on one paid activity and local meals.`,
      `Use neighborhoods with strong transit or walkability to avoid car costs.`,
    ],
    packingNotes: [
      `Carry-on friendly layers for ${match.destinationCity}.`,
      "Leave room for a day bag, power adapter, and rain backup.",
    ],
    localTips: [
      "Schedule one must-do activity early and keep the rest flexible around weather and energy.",
      "Save the booking handoff confirmation and airport transfer info offline.",
    ],
  };

  return result;
}

export async function generateItinerary(
  match: DealMatch,
  profile: TravelerProfile,
): Promise<Omit<GeneratedItinerary, "id" | "createdAt">> {
  let result = buildFallback(match, profile);

  if (hasOpenAI()) {
    const client = new OpenAI({ apiKey: env.openAiApiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a travel planner. Return strict JSON with destinationCity, dailyPlans, budgetNotes, packingNotes, and localTips.",
        },
        {
          role: "user",
          content: JSON.stringify({
            destinationCity: match.destinationCity,
            departureDate: match.departureDate,
            returnDate: match.returnDate,
            travelerInterests: profile.interests,
            budgetStyle: profile.budgetStyle,
            travelerNotes: profile.notes,
          }),
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (content) {
      result = itinerarySchema.parse(JSON.parse(content));
    }
  }

  return {
    dealMatchId: match.id,
    userId: match.userId,
    destinationCity: result.destinationCity,
    travelDates: {
      departureDate: match.departureDate,
      returnDate: match.returnDate,
    },
    dailyPlans: result.dailyPlans,
    budgetNotes: result.budgetNotes,
    packingNotes: result.packingNotes,
    localTips: result.localTips,
    markdown: renderMarkdown(result, match),
  };
}

export function materializeGeneratedItinerary(
  itinerary: Omit<GeneratedItinerary, "id" | "createdAt">,
): GeneratedItinerary {
  return {
    ...itinerary,
    id: `itinerary_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: isoNow(),
  };
}
