import { IAPIResponseTypes } from "../../server/getPopularProducts";
interface IOfferedProduct {
  id: string;
  slug: string;
  thumbnail: string;
  name: string;
  description: string;
  isOffered: boolean;
  discount: number | null;
  weightValue: number | null;
  weightUnit: string | null;
  price: number | null;
  category:string;
  stock:number;
}

interface IOfferedProductApiResponse {
  offeredProducts: IOfferedProduct[];
  totalOfferedProducts: number;
}
type IOfferedProductResponse = IAPIResponseTypes<IOfferedProductApiResponse>;

export const getOfferedProducts =
  async (): Promise<IOfferedProductApiResponse> => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/products/offerProducts",
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
      const data: IOfferedProductResponse = await response.json();
      return {
        offeredProducts: data.data.offeredProducts,
        totalOfferedProducts: data.data.totalOfferedProducts,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        throw error;
      }

      throw new Error("Failed to fetch featuredProducts");
    }
  };
