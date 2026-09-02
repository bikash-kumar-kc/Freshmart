import { db } from "@/src/db/config";
import { products, productVariants } from "@/src/db/schema";
import { ICategoriesProductReponse } from "@/src/types/product.types/productsbycategories.types";
import { manageApiResponse, manageError } from "@/src/utils/response";
import { and, eq, gt, inArray } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

const getCachedCategoryProducts = async (
  cats: string,
  categoriesArray: string[],
) => {
  "use cache";
  cacheLife("days");
  cacheTag(`categories-${cats}`);

  const response: ICategoriesProductReponse[] = await db
    .select({
      productId: products.id,
      slug: products.slug,
      productName: products.name,
      thumbnail: products.thumbnail,
      categoryName: products.category,
      stock: productVariants.stock,
      hasVarients: products.hasVarient,
    })
    .from(products)
    .innerJoin(productVariants, eq(productVariants.productId, products.id))
    .where(
      and(
        inArray(products.category, categoriesArray),
        gt(productVariants.stock, 0),
      ),
    );
  // .limit(5);

  if (response.length === 0) {
    return [];
  }

  const groupedProducts = Object.entries(
    Object.groupBy(response, (product) => product.categoryName),
  ).map(([category, products]) => ({
    category,
    products,
  }));

  const filteredGroupProducts = groupedProducts.map((gc) => ({
    ...gc,
    products: gc.products ? gc.products.splice(0, 5) : gc.products,
  }));

  return filteredGroupProducts;
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ cats: string }> },
) {
  const { cats } = await params;

  try {
    if (!cats?.trim()) {
      throw new Error("Categories are required !");
    }

    const catArray = cats.split(",");
    const categoriesArray = catArray.map((c) =>
      c.includes("&") ? c.split("&").join("&") : c,
    );

    const response = await getCachedCategoryProducts(cats, categoriesArray);

    if (response.length === 0) {
      return Response.json(
        {
          success: true,
          data: {
            products: [],
            total: 0,
          },
        },
        {
          status: 200,
        },
      );
    }

    const resObj = manageApiResponse("categoriesBasedProducts", response);

    return Response.json(
      {
        success: true,
        data: {
          ...resObj,
        },
      },
      { status: 200 },
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
