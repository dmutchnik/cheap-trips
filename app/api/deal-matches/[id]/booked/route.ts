import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { markDealMatchBookedAndGenerate } from "@/lib/deal-watches/service";

const schema = z.object({
  confirmationCode: z.string().max(32).optional(),
  notes: z.string().max(500).optional(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  const { id } = await context.params;
  const payload = schema.parse(await request.json());

  try {
    const result = await markDealMatchBookedAndGenerate(user.userId, id, payload);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to confirm booking and create itinerary.",
      },
      { status: 400 },
    );
  }
}
