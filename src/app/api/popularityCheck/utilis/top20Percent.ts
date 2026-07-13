import { ProductSignal } from "./calculatePopularityScore";

export function getTop20PercentThreshold(scored: ProductSignal[]): number {
  // no products available
  if (scored.length === 0) {
    return 0;
  }
  // sort products by score (highest first)
  const sorted = [...scored].sort((a, b) => b.score - a.score);

  // number of products that belong to the top 20%
  const topCount = Math.max(1, Math.ceil(sorted.length * 0.2));

  // score of the last product in the top 20%
  return sorted[topCount - 1].score;
}
