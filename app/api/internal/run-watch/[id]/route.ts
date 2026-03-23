import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { runDealWatchForUser } from "@/lib/deal-watches/service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  const { id } = await context.params;

  try {
    const matches = await runDealWatchForUser(user.userId, id);
    return NextResponse.json({ createdMatches: matches.length, matches });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to run deal watch." },
      { status: 400 },
    );
  }
}
