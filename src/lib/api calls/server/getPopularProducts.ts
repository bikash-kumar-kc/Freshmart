import { REVALIDATE_TIME } from "@/src/app/api/products/popularProducts/route";

export interface IAPIResponseTypes<T> {
  success: boolean;
  data: T;
}

interface IPopularProducts {
  id: string;
  slug: string;
  thumbnail: string;
  name: string;
  description: string;
  isOffered: boolean;
  weightValue: number;
  weightUnit: string;
  price: number | null;
  category:string;
  stock:number;
}

interface IPopularProductsData {
  popularProducts: IPopularProducts[];
  totalPopularProducts: number;
}

type IPopularProductResponse = IAPIResponseTypes<IPopularProductsData>;

export const getPopularProducts = async (): Promise<IPopularProductsData> => {
  const res = await fetch("http://localhost:3000/api/products/popularProducts", {
    next: {
      revalidate: REVALIDATE_TIME,
    },
  });

  if (!res.ok) {
    throw new Error("Faile to fetch popular products");
  }

  const data: IPopularProductResponse = await res.json();
  return {
    popularProducts: data.data.popularProducts,
    totalPopularProducts: data.data.totalPopularProducts,
  };
};
