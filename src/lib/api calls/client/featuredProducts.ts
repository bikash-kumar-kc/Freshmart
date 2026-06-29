
import { IAPIResponseTypes } from "../server/getPopularProducts";
import { IFeaturedProductsData } from "@/src/app/api/featuredProducts/route";


type IFeaturedProductResponse = IAPIResponseTypes<IFeaturedProductsData>;

export const getFeaturedProducts = async (): Promise<IFeaturedProductsData> => {
  try {
    const response = await fetch("http://localhost:3000/api/featuredProducts");
    if (!response.ok) {
      const error =
        response.status === 404 ? await response.text() : await response.json();

      throw new Error(
        response.status === 404
          ? "route not found"
          : error.message
            ? error.message
            : "Failed to get the featured products ",
      );
    }
    const data: IFeaturedProductResponse = await response.json();
    return {
      featuredProducts: data.data.featuredProducts,
      totalFeaturedProducts: data.data.totalFeaturedProducts,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      throw error;
    }

    throw new Error("Failed to fetch featuredProducts");
  }
};
