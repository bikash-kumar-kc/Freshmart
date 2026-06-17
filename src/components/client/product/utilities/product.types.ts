import type { Product, ProductVariant } from "@/src/db/schema";

export interface ProductDetailPageProps {
  product: Product;
  variants: ProductVariant[];
  relatedProducts: (Product & { variants: ProductVariant[] })[];
}
