import { products } from "@/src/db/schema";
import { ScoredProduct } from "./normalityCalculation";
import { db } from "@/src/db/config";
import { eq, sql } from "drizzle-orm";

export async function writePopularityScores(
  allScored: ScoredProduct[],
  top5Ids: Set<string>
): Promise<void> {
  // update all scored products with their score
  await Promise.all(
    allScored.map((s) =>
      db
        .update(products)
        .set({
          popularityScore: s.score,
          isMostPopular: top5Ids.has(s.productId),
        })
        .where(eq(products.id, s.productId))
    )
  );
 
  // reset isMostPopular on products that had no orders this week
  // (they won't appear in allScored at all)
  const scoredIds = allScored.map((s) => s.productId);
  if (scoredIds.length > 0) {
    await db
      .update(products)
      .set({ isMostPopular: false, popularityScore: 0 })
      .where(
        sql`${products.id} NOT IN (${sql.join(
          scoredIds.map((id) => sql`${id}`),
          sql`, `
        )})`
      );
  }
}