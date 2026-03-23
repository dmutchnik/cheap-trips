import { Inngest } from "inngest";
import { runAllActiveWatches } from "@/lib/deal-watches/service";

export const inngest = new Inngest({ id: "cheap-trips-mvp" });

export const functions = [
  inngest.createFunction(
    { id: "scan-active-deal-watches" },
    { cron: "0 * * * *" },
    async () => {
      const matches = await runAllActiveWatches();
      return { createdMatches: matches.length };
    },
  ),
];
