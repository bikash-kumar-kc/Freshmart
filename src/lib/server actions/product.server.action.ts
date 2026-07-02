"use server";

import { db } from "@/src/db/config";
import { products, productVariants } from "@/src/db/schema";
import { eq, and, ne } from "drizzle-orm";

export interface IPRODUCTRESPONSE {
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
}

export interface IPRODUCTVARIENTS {
  id: string;
  weightValue: number;
  weightUnit: string;
  price: number;
  stock: number;
}

export interface GetProductResult {
  product: IPRODUCTRESPONSE | null;
  relatedProducts: IRequiredFieldTypes[];
  filteredVariantRow: IPRODUCTVARIENTS;
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
};

export async function getProductByCategorySlug(
  category: string,
  slug: string,
): Promise<GetProductResult> {
  try {
    if (!category?.trim() || !slug?.trim()) {
      return {
        product: null,
        relatedProducts: [],
        filteredVariantRow: {
          id: "",
          weightValue: 0,
          weightUnit: "",
          price: 0,
          stock: 0,
        },
      };
    }

    const product = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .get();

    if (!product || product.status === "inactive") {
      return {
        product: null,
        relatedProducts: [],
        filteredVariantRow: {
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

    const filteredVariantRow = variantRows[0];

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

    return { product, relatedProducts, filteredVariantRow };
  } catch (err) {
    console.error("[getProductByCategorySlug] failed", err);
    return {
      product: null,
      relatedProducts: [],
      filteredVariantRow: {
        id: "",
        weightValue: 0,
        weightUnit: "",
        price: 0,
        stock: 0,
      },
    };
  }
}
