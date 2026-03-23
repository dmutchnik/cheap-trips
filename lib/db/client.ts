import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env, hasDatabase } from "@/lib/env";

let dbInstance: ReturnType<typeof drizzle> | undefined;

export function getDb() {
  if (!hasDatabase()) {
    return undefined;
  }

  if (!dbInstance) {
    const client = postgres(env.databaseUrl!, {
      prepare: false,
    });
    dbInstance = drizzle(client);
  }

  return dbInstance;
}
