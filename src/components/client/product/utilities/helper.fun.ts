export const discountedPrice=(price: number, discount: number): number=> {
  return Math.round(price * (1 - discount / 100) * 100) / 100;
}

export const formatWeight=(value: number, unit: string): string=> {
  return `${value}${unit}`;
}