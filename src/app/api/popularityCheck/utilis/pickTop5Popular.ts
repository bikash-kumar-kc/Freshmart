import { ProductSignal } from "./calculatePopularityScore";
import { ScoredProduct } from "../../insightSync/utilities/normalityCalculation";

export function pickTop5Popular(
  scored: ProductSignal[],
  threshold: number
): ScoredProduct[] {

  
  // getting all products whose score is within the top 20%
  const candidates = scored.filter((product) => product.score >= threshold);

  // no products qualified
  if (candidates.length === 0) {
    return [];
  }

  // storing the highest-scoring product for each category
  const bestProductsByCategory = new Map<string, ScoredProduct>();

  for (const product of candidates) {
    const currentBest = bestProductsByCategory.get(product.category);

    if (!currentBest || product.score > currentBest.score) {
      bestProductsByCategory.set(product.category, product);
    }
  }

  // sorting the remaining products by score and selecting the top 5
  return [...bestProductsByCategory.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}