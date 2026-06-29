import { db } from "@/src/db/config";
import { products } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export const REVALIDATE_TIME = 86400;

export const productInformationRequired = {
  id: products.id,
  slug: products.slug,
  thumbnail: products.thumbnail,
  name: products.name,
  description: products.description,
  isOffered: products.isOffered,
};

export async function GET() {
  try {
    const popularProducts = await db
      .select(productInformationRequired)
      .from(products)
      .where(eq(products.isMostPopular, true));

    return Response.json(
      {
        success: true,
        data: {
          popularProducts,
          totalPopularProducts: popularProducts.length,
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
