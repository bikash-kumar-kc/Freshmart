import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { runInsightSyncAgent } from "../insightSync/agent";


export const maxDuration = 300;

export const POST = verifySignatureAppRouter(async (req: Request) => {
  try {
    const result = await runInsightSyncAgent();

    console.log("[insight-sync] done", {
      steps: result.steps,
      summary: result.summary,
    });
    return Response.json({ ok: true, ...result }, { status: 200 });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
});
