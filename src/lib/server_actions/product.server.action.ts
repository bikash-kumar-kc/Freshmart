"use server";

import { db } from "@/src/db/config";
import {
  IOrderItem,
  orderItems,
  orders,
  products,
  productVariants,
} from "@/src/db/schema";
import { eq, and, ne, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { randomUUID } from "node:crypto";
import { success } from "zod";
import { cacheLife, cacheTag } from "next/cache";

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
  "use cache";
  cacheLife("hours");
  cacheTag(`product:${category}:${slug}`);
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

    const row1 = variantRows[0];
    const row2 = variantRows[1];
    const filteredVariantRow =
      row1.weightValue < row2.weightValue ? row1 : row2; // todo improve it. . .

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

    return {
      product,
      relatedProducts: requiredFieldsArray,
      filteredVariantRow,
    };
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

export type ItemTypes = Omit<IOrderItem, "id" | "orderId">;

export interface ICreateOrderTypes {
  userId: string;
  items: ItemTypes[];
  type: "checkout" | "save";
  isFromDb?: boolean;
  orderIdFromDb?: string;
  totalPrice: number;
  totalDiscount: number;
  isDiscountCharge: boolean;
  totalPriceAfterDiscount: number;
}

// create order ...

export async function createOrder({
  userId,
  items,
  type,
  isFromDb,
  orderIdFromDb,
  totalPrice,
  totalDiscount,
  isDiscountCharge,
  totalPriceAfterDiscount,
}: ICreateOrderTypes) {
  try {
    if (!userId) {
      throw new Error("User Id is missing!");
    }

    const data = await getServerSession(authOptions);
    if (!data || data?.user.id !== userId) {
      throw new Error("User is unauthenticated!");
    }

    if (!isFromDb) {
      if (items.length === 0) throw new Error("No product items!");
    }

    let itemsAddedIds: { itemId: number }[] = [];
    let orderId = "";

    await db.transaction(async (tx) => {
      // validate the stock first and if available then reserved the stock...
      if (type === "checkout") {
        for (const item of items) {
          const variant = await tx
            .select({
              stock: productVariants.stock,
              reservedStock: productVariants.reservedStock,
            })
            .from(productVariants)
            .where(
              and(
                eq(productVariants.productId, item.productId),
                eq(productVariants.weightValue, item.weightValue),
                eq(productVariants.weightUnit, item.weightUnit),
              ),
            )
            .get();

          if (!variant) {
            throw new Error(`Variant not found for product ${item.productId}`);
          }

          const availableStock = variant.stock - variant.reservedStock;

          if (availableStock < item.quantity) {
            throw new Error(
              `Insufficient stock for product ${item.productId}. ` +
                `Requested: ${item.quantity}, Available: ${availableStock}`,
            );
          }

          // reserve stock
          await tx
            .update(productVariants)
            .set({
              reservedStock: sql`${productVariants.reservedStock} + ${item.quantity}`,
            })
            .where(
              and(
                eq(productVariants.productId, item.productId),
                eq(productVariants.weightValue, item.weightValue),
                eq(productVariants.weightUnit, item.weightUnit),
              ),
            );
        }
      }

      if (isFromDb) {
        return {
          success: true,
          orderId: orderIdFromDb,
          type,

          message: "Reserved stock !",
        };
      }

      //create order ...
      const [order] = await tx
        .insert(orders)
        .values({
          id: randomUUID(),
          userId,
          isPaymentProcess: type === "checkout",
          totalPrice: totalPrice!,
          totalSave: totalDiscount!,
          isDeliveredChargeApplied: !!isDiscountCharge!,
          totalPriceAfterDiscount: totalPriceAfterDiscount!,
        })
        .returning({ orderedId: orders.id });

      orderId = order.orderedId;

      //insert order items ...
      itemsAddedIds = await tx
        .insert(orderItems)
        .values(
          items.map((item) => ({
            ...item,
            orderId: order.orderedId,
          })),
        )
        .returning({ itemId: orderItems.id });
    });

    return {
      success: true,
      orderId,
      type,
      totalItemsInserted: itemsAddedIds.length,
    };
  } catch (error) {
    throw error;
  }
}

// update quantity...
export async function updateQuantity({
  orderId,
  itemId,
  userId,
  value,
}: {
  orderId: string;
  itemId: number;
  userId: string;
  value: number;
}) {
  if (!orderId || !itemId) {
    throw new Error("OrderId or itemId is missing !");
  }

  const session = await getServerSession(authOptions);

  if (session?.user.id !== userId) {
    throw new Error("User is unauthenticated !");
  }

  const orderInfo = await db
    .select({ orderId: orders.id, userId: orders.userId })
    .from(orders)
    .where(eq(orders.id, orderId))
    .get();

  if (!orderInfo) {
    throw new Error("Such ordered not exist !");
  }

  if (orderInfo.userId !== userId) {
    throw new Error("User is unauthorized");
  }

  const orderItemInfo = await db
    .select({ itemId: orderItems.id, productId: orderItems.productId })
    .from(orderItems)
    .where(and(eq(orderItems.orderId, orderId), eq(orderItems.id, itemId)))
    .get();

  if (!orderItemInfo) {
    throw new Error("Order item does not exist !");
  }

  const isValueValid = await isOutOfStock(orderItemInfo.productId, value);
  if (!isValueValid) {
    throw new Error("Out of stock !");
  }

  await db
    .update(orderItems)
    .set({ quantity: value })
    .where(and(eq(orderItems.orderId, orderId), eq(orderItems.id, itemId)));

  return {
    success: true,
    message: " Quantity added successfully !",
  };
}

// check whether the product is out of stock...
export async function isOutOfStock(
  productId: string,
  value: number,
): Promise<boolean> {
  if (!productId || !value) {
    return false;
  }

  const varients = await db
    .select({
      stock: productVariants.stock,
      weightValue: productVariants.weightValue,
    })
    .from(productVariants)
    .where(eq(productVariants.productId, productId));

  if (varients.length === 0) {
    return false;
  }

  const smallestVariant = varients.reduce((smallest, current) => {
    return current.weightValue < smallest.weightValue ? current : smallest;
  });

  if (smallestVariant.stock > value) {
    return false;
  } else {
    return true;
  }
}

// remove item
export async function removeItem({
  orderId,
  itemId,
  userId,
}: {
  orderId: string;
  itemId: number;
  userId: string;
}) {
  if (!orderId || !itemId) {
    throw new Error("OrderId or itemId is missing !");
  }

  const session = await getServerSession(authOptions);

  if (session?.user.id !== userId) {
    throw new Error("User is unauthenticated !");
  }

  const orderInfo = await db
    .select({ orderId: orders.id, userId: orders.userId })
    .from(orders)
    .where(eq(orders.id, orderId))
    .get();

  if (!orderInfo) {
    throw new Error("Such ordered not exist !");
  }

  if (orderInfo.userId !== userId) {
    throw new Error("User is unauthorized");
  }

  await db
    .delete(orderItems)
    .where(and(eq(orderItems.orderId, orderId), eq(orderItems.id, itemId)));

  return {
    success: true,
    message: "Deleted Successfully !",
  };
}

// remove order
export async function removeOrder({
  userId,
  orderId,
}: {
  userId: string;
  orderId: string;
}) {
  if (!orderId) {
    throw new Error("OrderId or itemId is missing !");
  }

  const session = await getServerSession(authOptions);

  if (session?.user.id !== userId) {
    throw new Error("User is unauthenticated !");
  }

  const orderInfo = await db
    .select({ orderId: orders.id, userId: orders.userId })
    .from(orders)
    .where(eq(orders.id, orderId))
    .get();

  if (!orderInfo) {
    throw new Error("Such ordered not exist !");
  }

  if (orderInfo.userId !== userId) {
    throw new Error("User is unauthorized");
  }

  await db
    .delete(orders)
    .where(and(eq(orders.userId, userId), eq(orders.id, orderId)));

  return {
    success: true,
    message: "Order deleted successfully!",
  };
}

export const clearSavedOrder = async ({
  userId,
  orderId,
}: {
  userId: string;
  orderId: string;
}) => {
  if (!userId?.trim() || !orderId?.trim()) {
    throw new Error("UserId | OrderId is required!");
  }

  const session = await getServerSession(authOptions);

  if (session?.user.id !== userId) {
    throw new Error("User is unauthenticated !");
  }

  const isExist = await db
    .select({ orderId: orders.id })
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
    .get();

  if (!isExist?.orderId) {
    throw new Error("Order does not exist !");
  }

  await db
    .delete(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)));

  return {
    success: true,
  };
};
