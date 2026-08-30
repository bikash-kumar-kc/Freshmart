import { db } from "@/src/db/config";
import { products, productVariants } from "@/src/db/schema";
import { manageError } from "@/src/utils/response";
import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { NextRequest } from "next/server";

const getCachedProduct = async (slug: string) => {
  "use cache";
  cacheLife("minutes");
  cacheTag(`product-${slug}`);
  const [response] = await db
    .select({
      id: products.id,
      slug: products.slug,
      category: products.category,
      name: products.name,
      thumbnail: products.thumbnail,
      isOffered: products.isOffered,
      status: products.status,
      discount: products.discount,
      vendorId: products.vendorId,
      type: products.type,
      hasVarients: products.hasVarient,
    })
    .from(products)
    .where(eq(products.slug, slug));

  const productId = response.id;

  if (!productId) {
    throw new Error("Failed to get product id!");
  }

  const productVarient = await db
    .select({
      varientId: productVariants.id,
      price: productVariants.price,
      weightValue: productVariants.weightValue,
      weightUnit: productVariants.weightUnit,
      stock: productVariants.stock,
    })
    .from(productVariants)
    .where(eq(productVariants.productId, productId));

  if (!productVarient || productVarient.length === 0) {
    throw new Error("Failed to get product varients !");
  }

  const cheapestVariant = productVarient.reduce((cheapest, current) =>
    current.price < cheapest.price ? current : cheapest,
  );

  return {
    response,
    cheapestVariant,
  };
};

export async function GET(
  res: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug || !slug?.trim()) {
      return Response.json(
        {
          success: false,
          message: "slug is required to get product information",
        },
        {
          status: 400,
        },
      );
    }

    const { response, cheapestVariant } = await getCachedProduct(slug);

    const requiredObj = {
      ...response,
      ...cheapestVariant,
    };

    return Response.json(
      {
        success: true,
        data: {
          product: requiredObj,
          totalLength: 1,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const errRes = manageError(error);
    return Response.json(
      {
        success: false,
        message: errRes ? errRes : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
