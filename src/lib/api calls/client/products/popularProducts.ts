import { IAPIResponseTypes } from "../../server/getPopularProducts";
interface IPopularProduct {
  id: string;
  slug: string;
  thumbnail: string;
  name: string;
  description: string;
  isOffered: boolean;
  weightValue: number | null;
  weightUnit: string | null;
  price: number | null;
}

interface IPopularProductApiResponse {
  popularProducts: IPopularProduct[];
  totalPopularProducts: number;
}
type IPopularProductResponse = IAPIResponseTypes<IPopularProductApiResponse>;

export const getPopularProducts =
  async (): Promise<IPopularProductApiResponse> => {
    try {
      const response = await fetch(`/api/products/popularProducts`);
      if (!response.ok) {
        throw new Error("Failed to get the featured products ");
      }
      const data: IPopularProductResponse = await response.json();
      return {
        popularProducts: data.data.popularProducts,
        totalPopularProducts: data.data.totalPopularProducts,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        throw error;
      }

      throw new Error("Failed to fetch featuredProducts");
    }
  };
