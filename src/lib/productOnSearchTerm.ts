"use server";

export const getProductOnSearchTerm = async (searchTerm: string) => {
  if (!searchTerm) return;
  const array = [{ productId: 1, productName: "" }];
  return array;
};
