import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { nanoid } from "nanoid";
import { runInsightSyncAgent } from "./agent";
import { db } from "@/src/db/config";
import { jobRuns } from "@/src/db/schema";

// production...
export const POST = verifySignatureAppRouter(async () => {
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

// development...
// export const POST = async () => {
//   const startedAt = new Date().toISOString();
//   const runId = nanoid();

//   try {
//     const result = await runInsightSyncAgent();

//     // store summary before returning
//     await db.insert(jobRuns).values({
//       id: runId,
//       jobName: "insight-sync",
//       status: "success",
//       summary: result.summary,
//       steps: result.steps,
//       startedAt,
//       completedAt: new Date().toISOString(),
//     });

//     return Response.json({ ok: true }, { status: 200 });
//   } catch (err) {
//     console.log(err);
//     await db.insert(jobRuns).values({
//       id: runId,
//       jobName: "insight-sync",
//       status: "failed",
//       startedAt,
//       completedAt: new Date().toISOString(),
//       error: String(err),
//     });
//     return Response.json({ ok: false }, { status: 500 });
//   }
// };
