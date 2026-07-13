import { db } from "@/src/db/config";
import { products } from "@/src/db/schema";
import { eq, inArray, not } from "drizzle-orm";
import { ProductSignal } from "./calculatePopularityScore";

export async function writePopularityScores(
  allScored: ProductSignal[],
  top5Ids: Set<string>,
): Promise<void> {
    
  // no products received, reset popularity for every product
  if (allScored.length === 0) {
    await db.update(products).set({
      popularityScore: 0,
      isMostPopular: false,
    });

    return;
  }

  // updating popularity score and most popular flag for scored products
  await Promise.all(
    allScored.map((product) =>
      db
        .update(products)
        .set({
          popularityScore: product.score,
          isMostPopular: top5Ids.has(product.productId),
        })
        .where(eq(products.id, product.productId)),
    ),
  );

  // collecting ids of products that were scored
  const scoredProductIds = allScored.map((product) => product.productId);

  // resetting products that had no successful orders in the last 7 days
  await db
    .update(products)
    .set({
      popularityScore: 0,
      isMostPopular: false,
    })
    .where(not(inArray(products.id, scoredProductIds)));
}
