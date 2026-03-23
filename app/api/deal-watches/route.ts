import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { dealWatchSchema } from "@/lib/deal-watches/validation";
import { getRepository } from "@/lib/repositories";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const payload = dealWatchSchema.parse(await request.json());
  const repository = getRepository();
  const watch = await repository.createDealWatch(user.userId, payload);
  return NextResponse.json(watch);
}
