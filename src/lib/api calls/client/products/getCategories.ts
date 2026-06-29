import { manageError } from "@/src/app/api/products/offerProducts/route";
import { IErrorTypes } from "@/src/app/api/products/popularProducts/route";
import { IAPIResponseTypes } from "../../server/getPopularProducts";
import { ICategoriesResponseTypes } from "@/src/app/api/products/categories/route";

type ICategoriesResponse = IAPIResponseTypes<ICategoriesResponseTypes>;

export const getCategories = async (): Promise<
  { categories: string[] | []; total: number } | undefined
> => {
  try {
    const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BASE_API_URL) throw new Error("Failed to get base url !");
    const response = await fetch(`${BASE_API_URL}/products/categories`);

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
    return {
      categories: filteredCategories,
      total: data.data.total,
    };
  } catch (error: unknown) {
    const errRes = manageError(error);
    console.log(errRes ? errRes : "Failed to fetch categories");
  }
};
