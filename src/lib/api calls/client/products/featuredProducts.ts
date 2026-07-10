import { IAPIResponseTypes } from "../../server/getPopularProducts";
import { IFeaturedProductsData } from "@/src/app/api/products/featuredProducts/route";


type IFeaturedProductResponse = IAPIResponseTypes<IFeaturedProductsData>;

export const getFeaturedProducts = async (): Promise<IFeaturedProductsData> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/products/featuredProducts`);
    if (!response.ok) {
     throw new Error("Failed to get featured products")
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


