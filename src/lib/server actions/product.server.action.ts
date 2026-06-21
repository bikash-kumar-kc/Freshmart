"use server";

import { db } from "@/src/db/config";
import { products, productVariants } from "@/src/db/schema";
import { eq, and, ne } from "drizzle-orm";

export interface IPRODUCTRESPONSE {
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
}

export interface IPRODUCTVARIENTS {
  id: string;
  weightValue: number;
  weightUnit: string;
  price: number;
  stock: number;
}

export interface GetProductResult {
  product: IPRODUCTRESPONSE | null;
  relatedProducts: IPRODUCTRESPONSE[];
  variantRows: IPRODUCTVARIENTS[];
}

export async function getProductByCategorySlug(
  category: string,
  slug: string,
): Promise<GetProductResult> {
  try {

    console.log("category",category)
     console.log(slug)
    if (!category?.trim() || !slug?.trim()) {
      return { product: null, relatedProducts: [], variantRows: [] };
    }


    const product = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .get();

      console.log("product")
      console.log(product)

    if (!product || product.status === "inactive") {
      return { product: null, relatedProducts: [], variantRows: [] };
    }

    // varients...
    const variantRows = await db
      .select({
        id: productVariants.id,
        weightValue: productVariants.weightValue,
        weightUnit: productVariants.weightUnit,
        price: productVariants.price,
        stock: productVariants.stock,
      })
      .from(productVariants)
      .where(eq(productVariants.productId, product.id));

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

    return { product, relatedProducts, variantRows };
  } catch (err) {
    console.error("[getProductByCategorySlug] failed", err);
    return { product: null, relatedProducts: [], variantRows: [] };
  }
}
