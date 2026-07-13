import { success } from "zod";
import collectProductSignals from "./utilis/productSignal";
import { computePopularityScores } from "./utilis/calculatePopularityScore";

async function POST() {
  // calculate signals...
  const signals = await collectProductSignals();
  if (signals.length === 0) {
    return Response.json(
      {
        success: true,
        message: "No product signal",
      },
      {
        status: 200,
      },
    );
  }

  // calcuate score for each product...
  const scored = computePopularityScores(signals);

  // calculate the threshold score...
  const threshold = computePopularityScores(scored);
}

export default POST;
