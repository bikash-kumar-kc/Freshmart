"use server";
 
import { db } from "@/src/db/config";
import { products, productVariants } from "@/src/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
 
interface PopularProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  thumbnail: string;
  popularityScore: number;
  isOffered: boolean;
  discount: number;
  variants: {
    id: string;
    weightValue: number;
    weightUnit: string;
    price: number;
    stock: number;
  }[];
}
 
export async function getPopularProducts(): Promise<PopularProduct[]> {
  try {
    // fetch exactly the 5 products marked isMostPopular
    // ordered by score so homepage shows best first
    const popularRows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        category: products.category,
        thumbnail: products.thumbnail,
        popularityScore: products.popularityScore,
        isOffered: products.isOffered,
        discount: products.discount,
      })
      .from(products)
      .where(eq(products.isMostPopular, true))
      .orderBy(sql`${products.popularityScore} DESC`)
      .limit(5);
 
    if (popularRows.length === 0) return [];
 
    // fetch variants for all 5 in one query
    const productIds = popularRows.map((p) => p.id);
    const variantRows = await db
      .select({
        id: productVariants.id,
        productId: productVariants.productId,
        weightValue: productVariants.weightValue,
        weightUnit: productVariants.weightUnit,
        price: productVariants.price,
        stock: productVariants.stock,
      })
      .from(productVariants)
      .where(inArray(productVariants.productId, productIds));
 
    // group variants by productId
    const variantsByProduct = new Map<string, typeof variantRows>();
    for (const v of variantRows) {
      const list = variantsByProduct.get(v.productId) ?? [];
      list.push(v);
      variantsByProduct.set(v.productId, list);
    }
 
    return popularRows.map((p) => ({
      ...p,
      variants: (variantsByProduct.get(p.id) ?? []).map((v) => ({
        id: v.id,
        weightValue: v.weightValue,
        weightUnit: v.weightUnit,
        price: v.price,
        stock: v.stock,
      })),
    }));
  } catch (err) {
    console.error("[getPopularProducts] failed", err);
    return [];
  }
}