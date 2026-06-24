"use server";

import { db } from "@/src/db/config";
import { products } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";

export async function getFeaturedProducts() {
  try {
    const featuredProducts = await db
      .select()
      .from(products)
      .where(and(eq(products.isFeatured, true), eq(products.status, "active")));

    return featuredProducts;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to fetch featured products");
  }
}
