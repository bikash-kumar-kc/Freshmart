import collectProductSignals from "./utilis/productSignal";
import { computePopularityScores } from "./utilis/calculatePopularityScore";
import { pickTop5Popular } from "./utilis/pickTop5Popular";
import { getTop20PercentThreshold } from "./utilis/top20Percent";
import { writePopularityScores } from "./utilis/writePopularityScore";

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

  const IdsArray = Array.from(top5Ids);

  // updating the db...
  await writePopularityScores(scored, top5Ids);

  // returning response back to job...
  return Response.json({
    success: true,
    message: "Successfully update the popularity score for products",
    data: new Date(),
    threshold: threshold,
    top5Ids: IdsArray.join(""),
  });
}

export default POST;
