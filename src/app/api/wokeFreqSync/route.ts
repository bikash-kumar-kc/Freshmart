import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { runRestockNotifierAgent } from "../freqProdSync/agent";

export const maxDuration = 300;

export const POST = verifySignatureAppRouter(async (req: Request) => {
  try {
    const result = await runRestockNotifierAgent();
    console.log("[restock-notifier] done", {
      steps: result.steps,
      summary: result.summary,
    });
    return Response.json({ ok: true, ...result }, { status: 200 });
  } catch (err) {
    console.error("[restock-notifier] failed", err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
});
