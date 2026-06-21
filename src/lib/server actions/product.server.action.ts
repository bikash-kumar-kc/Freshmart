"use server";

import { db } from "@/src/db/config";
import { products } from "@/src/db/schema";
import { eq, and, ne } from "drizzle-orm";

interface IPRODUCTRESPONSE {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  thumbnail: string;
  images: string[];
  icon: string | null;
  isMostPopular: boolean;
  isFeatured: boolean;
  isOffered: boolean;
  discount: number;
  originCountry: string;
  farmName: string;
  freshnessTags: string[];
  featuredBanner: string[];
  status: string;
  expireAt: string;
  variants?: {
    id: string;
    weightValue: number;
    weightUnit: string;
    price: number;
    stock: number;
  }[];
}

interface GetProductResult {
  product: IPRODUCTRESPONSE | null;
  relatedProducts: IPRODUCTRESPONSE[];
}

export async function getProductByCategorySlug(
  categorySlug: string,
): Promise<GetProductResult> {
  if (!categorySlug?.trim()) {
    return { product: null, relatedProducts: [] };
  }

  const [category, slug] = categorySlug.split(":");

  const product = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .get();

  if (!product || product.status === "inactive") {
    return { product: null, relatedProducts: [] };
  }

  const relatedProducts = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.category, category),
        ne(products.id, product.id),
        eq(products.status, "active"),
      ),
    )
    .limit(8);

  return { product, relatedProducts };
}
