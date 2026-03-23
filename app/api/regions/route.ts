import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repositories";

export async function GET() {
  const repository = getRepository();
  return NextResponse.json(await repository.getRegions());
}
