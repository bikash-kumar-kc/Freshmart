import { db } from "@/src/db/config";
import { Product, products } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";

export interface IFeaturedProductsData {
  featuredProducts: Product[];
  totalFeaturedProducts: number;
}

export async function GET() {
  try {
    const featuredProducts = await db
      .select()
      .from(products)
      .where(and(eq(products.isFeatured, true), eq(products.status, "active")));

    return Response.json(
      {
        success: true,
        data: {
          featuredProducts,
          totalFeaturedProducts: featuredProducts.length,
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
