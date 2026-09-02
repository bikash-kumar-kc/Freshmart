"use client";
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
  category: string;
  stock: number;
  varientId: string;
  hasVarients: boolean | null;
}

interface IOfferedProductApiResponse {
  offeredProducts: IOfferedProduct[];
  totalOfferedProducts: number;
}
type IOfferedProductResponse = IAPIResponseTypes<IOfferedProductApiResponse>;

export const getOfferedProducts =
  async (): Promise<IOfferedProductApiResponse> => {
    try {
      const response = await fetch(`/api/products/offerProducts`);
      if (!response.ok) {
        throw new Error("failed to get offered products");
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
