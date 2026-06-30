

import { IAPIResponseTypes } from "../../server/getPopularProducts";
import { manageError } from "@/src/utils/response";

interface ICategoriesResponseTypes {
  categories: { category: string }[];
  total: number;
}

interface IErrorTypes {
  success: boolean;
  message: string;
}

type CategoriesResult = {
  categories: string[];
  total: number;
};

type ICategoriesResponse = IAPIResponseTypes<ICategoriesResponseTypes>;

export const getCategories = async (): Promise<CategoriesResult> => {
  try {
    console.log("here in getcategories !");
    const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;
    console.log("Base_api_url: ", BASE_API_URL);

    if (!BASE_API_URL) throw new Error("Failed to get base url !");
    const response = await fetch(`${BASE_API_URL}api/products/categories`);

    if (!response.ok) {
      const error: IErrorTypes = await response.json();
      throw new Error(
        error.message ? error.message : "Failed to fetch categories",
      );
    }

    const data: ICategoriesResponse = await response.json();

    const categories = data.data.categories;

    if (categories.length === 0) {
      return {
        categories: [],
        total: 0,
      };
    }

    const filteredCategories = categories.map((c) => c.category);
    console.log(filteredCategories);
    return {
      categories: filteredCategories,
      total: data.data.total,
    };
  } catch (error: unknown) {
    const errRes = manageError(error);
    console.log(errRes ? errRes : "Failed to fetch categories");
    throw new Error(errRes?? "Failed to fetch categories");
  }
};
