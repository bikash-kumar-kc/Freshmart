import { IProductSignal } from "./productSignal";

export interface ProductSignal extends IProductSignal {
  score: number;
}

export function computePopularityScores(
  signals: IProductSignal[],
): ProductSignal[] {
  if (signals.length === 0) return [];

  const maxOrders = Math.max(...signals.map((s) => s.quantityOrdered));
  const maxBuyers = Math.max(...signals.map((s) => s.uniqueBuyers));

  if (maxOrders === 0 || maxBuyers === 0) {
    return signals.map((s) => ({ ...s, score: 0 }));
  }

  return signals.map((s) => ({
    ...s,
    score:
      Math.round(
        ((s.quantityOrdered / maxOrders) * 0.6 +
          (s.uniqueBuyers / maxBuyers) * 0.4) *
          1000,
      ) / 1000,
  }));
}
