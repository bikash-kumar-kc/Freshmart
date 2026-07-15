import collectProductSignals from "./utilis/productSignal";
import { computePopularityScores } from "./utilis/calculatePopularityScore";
import { pickTop5Popular } from "./utilis/pickTop5Popular";
import { getTop20PercentThreshold } from "./utilis/top20Percent";
import { writePopularityScores } from "./utilis/writePopularityScore";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";

export const POST = verifySignatureAppRouter(async () => {
  try {
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
    if (scored.length === 0) {
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
    // calculate the threshold score...
    const threshold = getTop20PercentThreshold(scored);

    //get top five product that are popular...
    const topFiveProductsOfUniqueCategory = pickTop5Popular(scored, threshold);

    if (topFiveProductsOfUniqueCategory.length === 0) {
      return Response.json(
        {
          success: true,
          message: "Failed to calculate the top five popular products",
        },
        {
          status: 200,
        },
      );
    }

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
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json(
        {
          success: false,
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        {
          status: 500,
        },
      );
    }

    return Response.json({
      success: false,
      message: "Internal server error",
    });
  }
});

