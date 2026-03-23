import { auth } from "@clerk/nextjs/server";
import { hasClerk } from "@/lib/env";

export async function getCurrentUser() {
  if (!hasClerk()) {
    return {
      userId: "demo-user",
      email: "demo@cheaptrips.local",
      demoMode: true,
    };
  }

  const result = await auth();

  return {
    userId: result.userId ?? "anonymous",
    email: result.sessionClaims?.email as string | undefined,
    demoMode: false,
  };
}
