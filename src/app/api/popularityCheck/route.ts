import { success } from "zod";
import collectProductSignals from "./utilis/productSignal";
import { computePopularityScores } from "./utilis/calculatePopularityScore";
import { pickTop5Popular } from "./utilis/pickTop5Popular";
import { getTop20PercentThreshold } from "./utilis/top20Percent";

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
  const threshold = getTop20PercentThreshold(scored);

  //get top five product that are popular...
  const topFiveProductsOfUniqueCategory = pickTop5Popular(scored, threshold);

  // product ids...
  const top5Ids = new Set(
    topFiveProductsOfUniqueCategory.map((p) => p.productId),
  );

  // updating the db...
}

export default POST;
