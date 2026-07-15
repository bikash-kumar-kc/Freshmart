import { ICategoriesProductReponse } from "@/src/types/product.types/productsbycategories.types";
import { IAPIResponseTypes } from "../../server/getPopularProducts";
import { manageError } from "@/src/utils/response";

interface IGetProductsByCategories {
  categoriesBasedProducts: {
    category: string;
    products: ICategoriesProductReponse[];
  }[];
  total: number;
}
type IProductByCategoriesResponse = IAPIResponseTypes<IGetProductsByCategories>;

type IProductByCategoriesResult = {
  catBundle: {
    category: string;
    products: ICategoriesProductReponse[];
  }[];
  totalCategory: number;
};

export const getProductsByCategories = async (
  cats: string,
): Promise<IProductByCategoriesResult> => {
  try {
    if (!cats) {
      throw new Error("Cats is required !");
    }

    // const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

    // if (!BASE_API_URL) {
    //   throw new Error("Failed to get base url !");
    // }

    const response = await fetch(
      `/api/products/categories/${cats}`,
    );

    if (!response.ok) {
      const errRes: { success: boolean; message: string } =
        await response.json();
      throw new Error(
        errRes.message
          ? errRes.message
          : "Failed to get products based on categories !",
      );
    }

    const data: IProductByCategoriesResponse = await response.json();
    return {
      catBundle: data.data.categoriesBasedProducts,
      totalCategory: data.data.total,
    };
  } catch (error: unknown) {
    const errRes = manageError(error);
    if (errRes) {
      throw new Error(errRes);
    } else {
      throw error;
    }
  }
};
