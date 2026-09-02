import { db } from "@/src/db/config";
import { products, productVariants } from "@/src/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export interface IProduct {
  vendorId?: string;
  type?: "inventory" | "display";
  weightValue: number | null;
  weightUnit: string | null;
  price: number | null;
  id: string;
  name: string;
  slug: string;
  descriptions: string;
  thumbnail: string;
  discount: number | null;
  isFeatured: boolean;
  category: string;
  stock: number;
  hasVarients: boolean | null;
  varientId: string;
}
export interface IFeaturedProductsData {
  featuredProducts: IProduct[];
  totalFeaturedProducts: number;
}

const getFeaturedProducts = async () => {
  "use cache";
  cacheLife("days");
  cacheTag("featured-products");
  const featuredProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      descriptions: products.description,
      thumbnail: products.thumbnail,
      discount: products.discount,
      isFeatured: products.isFeatured,
      category: products.category,
      vendorId: products.vendorId,
      type: products.type,
      hasVareints: products.hasVarient,
    })
    .from(products)
    .where(and(eq(products.isFeatured, true), eq(products.status, "active")));

  if (featuredProducts.length === 0) {
    return [];
  }

  const arrayOfFeaturedProductIds = featuredProducts.map((p) => p.id);

  const featuredProductVarients = await db
    .select({
      id: productVariants.productId,
      weightValue: productVariants.weightValue,
      weightUnit: productVariants.weightUnit,
      price: productVariants.price,
      stock: productVariants.stock,
      varientId: productVariants.id,
    })
    .from(productVariants)
    .where(inArray(productVariants.productId, arrayOfFeaturedProductIds));

  const cheapestByProductId = new Map<
    string,
    (typeof featuredProductVarients)[0]
  >();
  for (const v of featuredProductVarients) {
    const existing = cheapestByProductId.get(v.id);
    if (!existing || v.weightValue < existing.weightValue) {
      const isOutOfStock = v.stock === 0;
      if (!isOutOfStock) cheapestByProductId.set(v.id, v);
    }
  }

  const result = featuredProducts.map((p) => {
    const variant = cheapestByProductId.get(p.id);
    return {
      ...p,
      weightValue: variant?.weightValue ?? null,
      weightUnit: variant?.weightUnit ?? null,
      price: variant?.price ?? null,
      stock: variant?.stock ?? null,
      varientId: variant?.varientId,
    };
  });

  return result;
};
export async function GET() {
  try {
    const response = await getFeaturedProducts();
    return Response.json(
      {
        success: true,
        data: {
          featuredProducts: response,
          totalFeaturedProducts: response.length,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Failed to get featured Products !",
      },
      {
        status: 500,
      },
    );
  }
}
