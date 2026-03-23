import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getGeneratedItineraryForUser } from "@/lib/deal-watches/service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  const { id } = await context.params;
  const itinerary = await getGeneratedItineraryForUser(user.userId, id);

  if (!itinerary) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(itinerary);
}
