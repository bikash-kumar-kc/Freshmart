import { ScoredProduct } from "./normalityCalculation";

export function pickTop5Popular(
  scored: ScoredProduct[],
  threshold: number
): ScoredProduct[] {
  // filter to popular candidates
  const candidates = scored.filter((s) => s.score >= threshold);
 
  if (candidates.length === 0) return [];
 
  // keep only the best product per category
  const bestPerCategory = new Map<string, ScoredProduct>();
  for (const product of candidates) {
    const existing = bestPerCategory.get(product.category);
    if (!existing || product.score > existing.score) {
      bestPerCategory.set(product.category, product);
    }
  }
 
  // sort by score descending, take top 5
  return Array.from(bestPerCategory.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}