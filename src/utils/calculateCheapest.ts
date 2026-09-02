export function cheapestVariant(
  variants: {
    id: string;
    price: number;
    weightValue: number;
    weightUnit: string;
    stock: number;
  }[],
) {
  if (!variants.length) return null;
  const response = variants.reduce(
    (min, v) => (v.weightValue < min.weightValue ? v : min),
    variants[0],
  );

  return {
    ...response,
    varientId: response.id,
  };
}
