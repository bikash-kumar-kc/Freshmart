"use client"
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
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  if(!API_URL){
    throw new Error("Failed to get Base api url")
  }
  const res = await fetch(`${API_URL}api/products/popularProducts`);

  if (!res.ok) {
    throw new Error("Faile to fetch popular products");
  }

  const data: IPopularProductResponse = await res.json();
  return {
    popularProducts: data.data.popularProducts,
    totalPopularProducts: data.data.totalPopularProducts,
  };
};
