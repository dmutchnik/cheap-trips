import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { partialDealWatchSchema } from "@/lib/deal-watches/validation";
import { getRepository } from "@/lib/repositories";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  const { id } = await context.params;
  const payload = partialDealWatchSchema.parse(await request.json());
  const repository = getRepository();
  const watch = await repository.updateDealWatch(user.userId, id, payload);

  if (!watch) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(watch);
}
