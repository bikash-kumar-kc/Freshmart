import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { nanoid } from "nanoid";
import { runRestockNotifierAgent } from "./agent";
import { db } from "@/src/db/config";
import { jobRuns } from "@/src/db/schema";


export const maxDuration = 300;

export const POST = verifySignatureAppRouter(async () => {
  const startedAt = new Date().toISOString();
  const runId = nanoid();

  try {
    const result = await runRestockNotifierAgent();

    await db.insert(jobRuns).values({
      id: runId,
      jobName: "restock-notifier",
      status: "success",
      summary: result.summary,
      steps: result.steps,
      startedAt,
      completedAt: new Date().toISOString(),
    });

    return Response.json({ ok: true }, { status: 200 });

  } catch (err) {
    await db.insert(jobRuns).values({
      id: runId,
      jobName: "restock-notifier",
      status: "failed",
      startedAt,
      completedAt: new Date().toISOString(),
      error: String(err),
    });

    return Response.json({ ok: false }, { status: 500 });
  }
});