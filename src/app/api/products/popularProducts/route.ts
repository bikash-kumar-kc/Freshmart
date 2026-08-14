import { db } from "@/src/db/config";
import { products, productVariants } from "@/src/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { cacheLife } from "next/cache";

export const productInformationRequired = {
  id: products.id,
  slug: products.slug,
  thumbnail: products.thumbnail,
  name: products.name,
  description: products.description,
  isOffered: products.isOffered,
  vendorId: products.vendorId,
  type: products.type,
  // variantId: productVariants.id,
};

export interface IErrorTypes {
  success: boolean;
  message: string;
}

export interface IPopularProduct {
  id: string;
  slug: string;
  thumbnail: string;
  name: string;
  description: string;
  isOffered: boolean;
  weightValue: number | null;
  weightUnit: string | null;
  price: number | null;
  category: string;
  stock: number;
  vendorId?: string | null;
  type?: "inventory" | "display" | null;
}

export async function getPopularProducts() {
  "use cache";
  cacheLife("days");

  const popularProducts = await db
    .select({
      id: products.id,
      slug: products.slug,
      thumbnail: products.thumbnail,
      name: products.name,
      description: products.description,
      category: products.category,
      isOffered: products.isOffered,
      vendorId: products.vendorId,
      type: products.type,
    })
    .from(products)
    .where(
      and(eq(products.isMostPopular, true), eq(products.isOffered, false)),
    );

  if (popularProducts.length === 0) {
    return [];
  }

  const productIds = popularProducts.map((p) => p.id);

  const variants = await db
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

  const cheapest = new Map<string, (typeof variants)[number]>();

  for (const v of variants) {
    const existing = cheapest.get(v.productId);

    if ((!existing || v.weightValue < existing.weightValue) && v.stock > 0) {
      cheapest.set(v.productId, v);
    }
  }

  return popularProducts.map((p) => {
    const variant = cheapest.get(p.id);

    return {
      ...p,
      weightValue: variant?.weightValue ?? null,
      weightUnit: variant?.weightUnit ?? null,
      price: variant?.price ?? null,
      stock: variant?.stock ?? 0,
      varientId: variant?.id,
    };
  });
}

export async function GET() {
  try {
    const response = await getPopularProducts();

    if (response.length === 0) {
      return Response.json(
        {
          success: true,
          data: {
            popularProducts: [],
            totalPopularProducts: 0,
          },
        },
        {
          status: 200,
        },
      );
    }
    return Response.json(
      {
        success: true,
        data: {
          popularProducts: response,
          totalPopularProducts: response.length,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to fetch popular products:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch popular products.",
      },
      { status: 500 },
    );
  }
}
