import { db } from "@/src/db/config";
import { products, productVariants } from "@/src/db/schema";
import { eq, inArray } from "drizzle-orm";

export const REVALIDATE_TIME = 86400;

export const productInformationRequired = {
  id: products.id,
  slug: products.slug,
  thumbnail: products.thumbnail,
  name: products.name,
  description: products.description,
  isOffered: products.isOffered,
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
}

export async function GET() {
  try {
    const popularProducts = await db
      .select({ ...productInformationRequired, category: products.category })
      .from(products)
      .where(eq(products.isMostPopular, true));

    if (popularProducts.length === 0) {
      return Response.json(
        {
          success: true,
          data: {
            popularProducts: [],
            totalPopularProducts: 0,
          },
        },
        { status: 200 },
      );
    }

    const productIds = popularProducts.map((p) => p.id);

    const variantRows = await db
      .select({
        productId: productVariants.productId,
        weightValue: productVariants.weightValue,
        weightUnit: productVariants.weightUnit,
        price: productVariants.price,
        stock: productVariants.stock,
      })
      .from(productVariants)
      .where(inArray(productVariants.productId, productIds));

    const cheapestByProductId = new Map<string, (typeof variantRows)[0]>();
    for (const v of variantRows) {
      const existing = cheapestByProductId.get(v.productId);
      if (!existing || v.weightValue < existing.weightValue) {
        const isOutOfStock = v.stock === 0;
        if (!isOutOfStock) {
          cheapestByProductId.set(v.productId, v);
        }
      }
    }

    const result: IPopularProduct[] = popularProducts.map((p) => {
      const variant = cheapestByProductId.get(p.id);
      return {
        ...p,
        weightValue: variant?.weightValue ?? null,
        weightUnit: variant?.weightUnit ?? null,
        price: variant?.price ?? null,
        isOutOfStock: variant?.stock === 0 ? true : false,
      };
    });

    return Response.json(
      {
        success: true,
        data: {
          popularProducts: result,
          totalPopularProducts: result.length,
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
