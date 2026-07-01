// app/api/offeredProducts/route.ts
import { db } from "@/src/db/config";
import { products, productVariants } from "@/src/db/schema";
import { productInformationRequired } from "../popularProducts/route";
import { manageApiResponse, manageError } from "@/src/utils/response";
import { and, eq, inArray } from "drizzle-orm";

export interface IOfferedProduct {
  id: string;
  slug: string;
  thumbnail: string;
  name: string;
  description: string;
  isOffered: boolean;
  discount: number | null;
  weightValue: number | null;
  weightUnit: string | null;
  price: number | null;
}

export async function GET() {
  try {
    // ── 1. fetch offered products ──
    const offeredProducts = await db
      .select({
        ...productInformationRequired,
        discount: products.discount,
      })
      .from(products)
      .where(and(eq(products.isOffered, true), eq(products.status, "active")))
      .limit(5);

    if (offeredProducts.length === 0) {
      const responseObj = manageApiResponse("offeredProducts", []);
      return Response.json(
        { success: true, data: { ...responseObj, totalOfferedProducts: 0 } },
        { status: 200 },
      );
    }

    // ── 2. fetch cheapest variant per product ──
    const productIds = offeredProducts.map((p) => p.id);

    const variantRows = await db
      .select({
        productId: productVariants.productId,
        weightValue: productVariants.weightValue,
        weightUnit: productVariants.weightUnit,
        price: productVariants.price,
      })
      .from(productVariants)
      .where(inArray(productVariants.productId, productIds));

    // ── 3. pick cheapest variant per product ──
    const cheapestByProductId = new Map<string, (typeof variantRows)[0]>();
    for (const v of variantRows) {
      const existing = cheapestByProductId.get(v.productId);
      if (!existing || v.weightValue < existing.weightValue) {
        cheapestByProductId.set(v.productId, v);
      }
    }

    // ── 4. merge variant into product ──
    const result: IOfferedProduct[] = offeredProducts.map((p) => {
      const variant = cheapestByProductId.get(p.id);
      return {
        ...p,
        weightValue: variant?.weightValue ?? null,
        weightUnit: variant?.weightUnit ?? null,
        price: variant?.price ?? null,
      };
    });

    const responseObj = manageApiResponse("offeredProducts", result);
    if (!responseObj) throw new Error("Failed to create response obj");

    return Response.json(
      {
        success: true,
        data: {
          ...responseObj,
          totalOfferedProducts: result.length,
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errRes = manageError(error);
    return Response.json(
      {
        success: false,
        message: errRes ?? "Failed to get offered products",
      },
      { status: 500 },
    );
  }
}
