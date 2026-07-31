// src/utils/normalizeProduct.ts
import { cheapestVariant } from "@/src/utils/calculateCheapest";
import { ICategoryProducts } from "@/src/types/product.types/categoryProduct.types";
import { IUnifiedProduct } from "@/src/types/product.types/productCard.types";

export function fromCategoryProduct(
  product: ICategoryProducts,
): IUnifiedProduct {
  const variant = cheapestVariant(product.variants);
  return {
    id: product.id,
    slug: product.slug,
    category: product.category,
    name: product.name,
    thumbnail: product.thumbnail,
    price: variant?.price ?? null,
    weightValue: variant?.weightValue ?? null,
    weightUnit: variant?.weightUnit ?? null,
    discount: product.discount,
    isOffered: product.isOffered,
    isMostPopular: product.isMostPopular,
    status: product.status,
    stock: variant?.stock ?? 0,
    vendorId:product.vendorId
  };
}

// Covers both IFavoriteProductData and IProductTypes — same flat shape
export function fromFlatProduct(product: {
  id: string;
  slug: string;
  category: string;
  name: string;
  thumbnail: string;
  price: number | null;
  weightValue: number | null;
  weightUnit: string | null;
  discount?: number | null;
  isOffered?: boolean;
  status?: string;
  stock: number;
  vendorId?: string | null;
  type?: "inventory" | "display" | null;
}): IUnifiedProduct {
  return { ...product, isMostPopular: false };
}
