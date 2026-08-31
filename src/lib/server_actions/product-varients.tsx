"use server";

import { db } from "@/src/db/config";
import { products, productVariants } from "@/src/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export interface IProductResponse {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  thumbnail: string;
  images: string[];
  icon: string | null;
  isMostPopular: boolean;
  isFeatured: boolean;
  isOffered: boolean;
  discount: number | null;
  originCountry: string;
  farmName: string;
  freshnessTags: string[];
  featuredBanner: string[];
  status: string;
  expireAt: string;
  type: "display" | "inventory";
}

const productInfo = {
  id: products.id,
  name: products.localName,
  slug: products.slug,
  category: products.category,
  description: products.description,
  thumbnail: products.thumbnail,
  images: products.images,
  isMostPopular: products.isMostPopular,
  isFeatured: products.isFeatured,
  isOffered: products.isOffered,
  discount: products.discount,
  originCountry: products.originCountry,
  farmName: products.farmName,
  freshnessTags: products.freshnessTags,
  featuredBanner: products.featuredBanner,
  status: products.status,
  expireAt: products.expireAt,
  type: products.type,
};

export interface IProductVarients {
  id: string;
  weightValue: number;
  weightUnit: string;
  price: number;
  stock: number;
}

export interface GetAvailableVarients {
  product: IProductResponse | null;
  vendorProducts: IRequiredFieldTypes[];
  productVarients: IProductVarients;
}

export interface IRequiredFields {
  id: string;
  slug: string;
}
export type IRequiredFieldTypes = {
  id: string;
  slug: string;
  name: string;
  thumbnail: string;
  category: string;
  discount: number | null;
  weightValue: number;
  weightUnit: string;
  stock: number;
  isOffered: boolean;
  isMostPopular: boolean;
  price: number;
  hasVarients: boolean | null;
};

export async function getProductByCategorySlug(
  vendorId: string,
  slug: string,
): Promise<GetAvailableVarients> {
  "use cache";
  cacheLife("hours");
  cacheTag(`product:${vendorId}:${slug}`);
  try {
    if (!vendorId?.trim() || !slug?.trim()) {
      return {
        product: null,
        vendorProducts: [],
        productVarients: {
          id: "",
          weightValue: 0,
          weightUnit: "",
          price: 0,
          stock: 0,
        },
      };
    }

    const product = await db
      .select({ ...productInfo })
      .from(products)
      .where(eq(products.slug, slug))
      .get();

    if (!product || product.status === "inactive") {
      return {
        product: null,
        vendorProducts: [],
        productVarients: {
          id: "",
          weightValue: 0,
          weightUnit: "",
          price: 0,
          stock: 0,
        },
      };
    }

    // varients...
    const variantRows = await db
      .select({
        id: productVariants.id,
        weightValue: productVariants.weightValue,
        weightUnit: productVariants.weightUnit,
        price: productVariants.price,
        stock: productVariants.stock,
      })
      .from(productVariants)
      .where(eq(productVariants.productId, product.id));

    // const row1 = variantRows[0];
    // const row2 = variantRows[1];
    // const filteredVariantRow =
    //   row1.weightValue < row2.weightValue ? row1 : row2; // todo improve it. . .

    const requiredFields = {
      id: products.id,
      slug: products.slug,
      name: products.name,
      thumbnail: products.thumbnail,
      category: products.category,
      discount: products.discount,
      weightValue: productVariants.weightValue,
      weightUnit: productVariants.weightUnit,
      stock: productVariants.stock,
      isOffered: products.isOffered,
      isMostPopular: products.isMostPopular,
      price: productVariants.price,
    };

    const relatedProducts = await db
      .select(requiredFields)
      .from(products)
      .innerJoin(productVariants, eq(productVariants.productId, products.id))
      .where(
        and(
          eq(products.category, category),
          ne(products.id, product.id),
          eq(products.status, "active"),
        ),
      );
    // .limit(8);

    const cheapestByProductId = new Map<string, IRequiredFieldTypes>();
    for (const v of relatedProducts) {
      const existing = cheapestByProductId.get(v.id);
      if (!existing || v.weightValue < existing.weightValue) {
        const isOutOfStock = v.stock === 0;
        if (!isOutOfStock) cheapestByProductId.set(v.id, v);
      }
    }

    const requiredFieldsArray: IRequiredFieldTypes[] = Array.from(
      cheapestByProductId.values(),
    );

    console.log(product);

    return {
      product: {
        ...product,
        type: product.type ?? "inventory",
      },
      vendorProducts: requiredFieldsArray,
      filteredVariantRow,
    };
  } catch (err) {
    console.error("[getProductByCategorySlug] failed", err);
    return {
      product: null,
      vendorProducts: [],
      productVarients: {
        id: "",
        weightValue: 0,
        weightUnit: "",
        price: 0,
        stock: 0,
      },
    };
  }
}
