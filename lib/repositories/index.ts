import { getDb } from "@/lib/db/client";
import { MemoryRepository } from "@/lib/repositories/memory";
import type { AppRepository } from "@/lib/repositories/types";

let memoryRepository: MemoryRepository | undefined;

export function getRepository(): AppRepository {
  const db = getDb();

  if (db) {
    // Postgres persistence can be swapped in here without changing the rest of the app.
    // For the MVP codebase, demo mode defaults to the in-memory implementation unless
    // a production repository is added.
  }

  if (!memoryRepository) {
    memoryRepository = new MemoryRepository();
  }

  return memoryRepository;
}
