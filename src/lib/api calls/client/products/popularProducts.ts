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
      const response = await fetch(
        "http://localhost:3000/api/products/popularProducts",
      );
      if (!response.ok) {
        const error =
          response.status === 404
            ? await response.text()
            : await response.json();

        throw new Error(
          response.status === 404
            ? "route not found"
            : error.message
              ? error.message
              : "Failed to get the featured products ",
        );
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
