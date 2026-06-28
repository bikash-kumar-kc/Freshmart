

import { Product } from "@/src/db/schema";


export const getFeaturedProducts = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/featuredProducts");
    const products: Product[] = (await response.json()).featuredProducts;
    return products;
  } catch (error:unknown) {

    if(error instanceof Error){
      console.log(error.message)
    };

    throw new Error("Failed to fetch featuredProducts")
    
  }
};
