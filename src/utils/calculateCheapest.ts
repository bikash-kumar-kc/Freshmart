export function cheapestVariant(
  variants: {
    price: number;
    weightValue: number;
    weightUnit: string;
    stock: number;
  }[],
) {
  if (!variants.length) return null;
  return variants.reduce(
    (min, v) => (v.weightValue < min.weightValue ? v : min),
    variants[0],
  );
}
