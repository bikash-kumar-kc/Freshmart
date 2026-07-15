import { IFavoriteProductData } from "@/src/app/favorites/types/favorite.type";
import { manageError } from "@/src/utils/response";
import { IAPIResponseTypes } from "../../server/getPopularProducts";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type IReturnedProductResponse = {
  product: IFavoriteProductData;
  totalProducts: number;
};

type IProductResponse = IAPIResponseTypes<IReturnedProductResponse>;

export const getProductBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<IReturnedProductResponse> => {
  if (!slug?.trim()) {
    throw new Error("Product slug is required !");
  }

  try {
    if (!BASE_URL) {
      throw new Error("Base url is required to make a call !");
    }
    const res = await fetch(`/api/products/product/${slug}`);
    if (!res.ok) {
      const errRes = manageError(await res.json());
      throw new Error(errRes);
    }
    const product: IProductResponse = await res.json();
    const p = product.data?.product;
    if (!p) {
      throw new Error("Product not found !");
    }

    console.log("From api call : ");
    console.log(p)

    return {
      product: {
        id: p.id,
        slug: p.slug,
        category: p.category,
        name: p.name,
        thumbnail: p.thumbnail,
        price: p.price ?? null,
        weightValue: p.weightValue ?? null,
        weightUnit: p.weightUnit ?? null,
        discount: p.discount ?? null,
        isOffered: p.isOffered ?? false,
        status: p.status,
        stock:p.stock
      },
      totalProducts: 1,
    };
  } catch (error: unknown) {
    const errRes = manageError(error);
    throw new Error(errRes ? errRes : `Failed to get product by slug: ${slug}`);
  }
};
