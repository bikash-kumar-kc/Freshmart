import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { nanoid } from "nanoid";
import { runInsightSyncAgent } from "./agent";
import { db } from "@/src/db/config";
import { jobRuns } from "@/src/db/schema";

// app/api/agent/insight-sync/route.ts
export const POST = verifySignatureAppRouter(async (req: Request) => {
  const startedAt = new Date().toISOString();
  const runId = nanoid();

  try {
    const result = await runInsightSyncAgent();

    // store summary before returning
    await db.insert(jobRuns).values({
      id: runId,
      jobName: "insight-sync",
      status: "success",
      summary: result.summary,
      steps: result.steps,
      startedAt,
      completedAt: new Date().toISOString(),
    });

    return Response.json({ ok: true }, { status: 200 });

  } catch (err) {
    // store failure too — useful for debugging
    await db.insert(jobRuns).values({
      id: runId,
      jobName: "insight-sync",
      status: "failed",
      startedAt,
      completedAt: new Date().toISOString(),
      error: String(err),
    });

    return Response.json({ ok: false }, { status: 500 });
  }
});