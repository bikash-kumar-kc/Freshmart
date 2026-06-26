import { ProductSignal } from "./popularProducts";

interface ScoredProduct extends ProductSignal {
  score: number; // 0–1
}
 
export function computePopularityScores(
  signals: ProductSignal[]
): ScoredProduct[] {
  if (signals.length === 0) return [];
 
  const maxOrders = Math.max(...signals.map((s) => s.recentOrders));
  const maxBuyers = Math.max(...signals.map((s) => s.uniqueBuyers));
 
 
  if (maxOrders === 0 || maxBuyers === 0) {
    return signals.map((s) => ({ ...s, score: 0 }));
  }
 
  return signals.map((s) => ({
    ...s,
    score:
      Math.round(
        ((s.recentOrders / maxOrders) * 0.6 +
          (s.uniqueBuyers / maxBuyers) * 0.4) *
          1000
      ) / 1000, 
  }));
}