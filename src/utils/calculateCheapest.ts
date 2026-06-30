export function cheapestVariant(variants: { price: number }[]) {
  if (!variants.length) return null;
  return variants.reduce(
    (min, v) => (v.price < min.price ? v : min),
    variants[0],
  );
}
