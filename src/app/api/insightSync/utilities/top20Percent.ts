import { ScoredProduct } from "./normalityCalculation";

export function getTop20PercentThreshold(scored: ScoredProduct[]): number {
  if (scored.length === 0) return 1; // nothing qualifies
  const sorted = [...scored].sort((a, b) => b.score - a.score);
  const cutoffIndex = Math.floor(sorted.length * 0.2); 
  const cutoffProduct = sorted[Math.max(0, cutoffIndex - 1)];
  return cutoffProduct?.score ?? 1;
}