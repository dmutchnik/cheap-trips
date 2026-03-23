import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { travelerProfileSchema } from "@/lib/deal-watches/validation";
import { getRepository } from "@/lib/repositories";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const payload = travelerProfileSchema.parse(await request.json());
  const repository = getRepository();
  const profile = await repository.upsertTravelerProfile({
    userId: user.userId,
    ...payload,
  });

  return NextResponse.json(profile);
}
