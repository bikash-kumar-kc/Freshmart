import { db } from "@/src/db/config";
import { products } from "@/src/db/schema";
import { productInformationRequired } from "../popularProducts/route";
import { eq } from "drizzle-orm";
import { manageApiResponse, manageError } from "@/src/utils/response";


interface IFilterProductType {
  id: string;
  slug: string;
  thumbnail: string;
  name: string;
  description: string;
  isOffered: boolean;
}

export async function GET() {
  try {
    const response = await db
      .select(productInformationRequired)
      .from(products)
      .where(eq(products.isOffered, true))
      .limit(5);

    const responseObj = manageApiResponse(
      "filterProducts",
      response,
    );
    if (!responseObj) {
      throw new Error("Failed to create response obj ");
    }

    return Response.json(
      {
        success: true,
        data: {
          ...responseObj,
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
        message: errRes ? errRes : "Failed to get popular products",
      },
      {
        status: 500,
      },
    );
  }
}

