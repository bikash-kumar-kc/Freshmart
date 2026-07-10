import { db } from "@/src/db/config";
import { products } from "@/src/db/schema";
import { manageApiResponse, manageError } from "@/src/utils/response";


export interface ICategoriesTypes {
  category: string;
}

export interface ICategoriesResponseTypes {
  categories: ICategoriesTypes[];
  total: number;
}

export async function GET() {
  try {
    const response = await db
      .selectDistinct({
        category: products.category,
      })
      .from(products);

    const resObj: ICategoriesResponseTypes | undefined = manageApiResponse(
      "categories",
      response,
    );

    if (!resObj) {
      throw new Error("Failed to generate response obj at [categories]");
    }

    return Response.json(
      {
        success: true,
        data: {
          ...resObj,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error: unknown) {
    const errRes = manageError(error);
    return Response.json(
      {
        success: false,
        message: errRes ? errRes : "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
