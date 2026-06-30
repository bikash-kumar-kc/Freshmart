import { db } from "@/src/db/config";
import { products } from "@/src/db/schema";
import { manageApiResponse, manageError } from "@/src/utils/response";
import { inArray } from "drizzle-orm";

interface ICategoriesProductReponse {
  productId: string;
  slug: string;
  productName: string;
  thumbnail: string;
  categoryName: string;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ cats: string }> },
) {
  const { cats } = await params;

  try {
    console.log("cats: ", cats);
    if (!cats?.trim()) {
      throw new Error("Categories are required !");
    }

    const catArray = cats.split(",");
    const categoriesArray = catArray.map((c) =>
      c.includes("&") ? c.split("&").join(" & ") : c,
    );
    console.log("categoriesArray", categoriesArray);
    const response: ICategoriesProductReponse[] = await db
      .select({
        productId: products.id,
        slug: products.slug,
        productName: products.name,
        thumbnail: products.thumbnail,
        categoryName: products.category,
      })
      .from(products)
      .where(inArray(products.category, categoriesArray));
    // .limit(5);

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

    console.log("response", response);

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

    const resObj = manageApiResponse(
      "categoriesBasedProducts",
      filteredGroupProducts,
    );

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
