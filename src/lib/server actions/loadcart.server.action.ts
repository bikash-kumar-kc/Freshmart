"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { db } from "@/src/db/config";
import { orderItems, orders, products, productVariants } from "@/src/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export const userUnfinishedCart = async () => {
  const data = await getServerSession(authOptions);

  if (!data) {
    return {
      success: false,
      reason: "user_not_logged_in",
    };
  }

  const userId = data.user.id;

  if (!userId) {
    return {
      success: false,
      reason: "userId not found!",
    };
  }

  const unfinishedCart = await db
    .select({
      orderId: orders.id,
    })
    .from(orders)
    .where(
      and(
        eq(orders.userId, userId),
        eq(orders.isPayment, false),
        eq(orders.isOrdered, false),
        eq(orders.isPaymentProcess, false),
        isNull(orders.orderStatus),
      ),
    )
    .get();

  if (!unfinishedCart?.orderId) {
    return {
      success: false,
      reason: "Unfinished cart is not available.",
    };
  }

  const allOrderItems = await db
    .select({
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      weightValue: orderItems.weightValue,
      weightUnit: orderItems.weightUnit,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, unfinishedCart.orderId));

  const requiredCartDetails = await Promise.all(
    allOrderItems.map(async (item) => {
      const productInfo = await db
        .select({
          productId: products.id,
          quantity: orderItems.quantity,
          varient: {
            weightUnit: productVariants.weightUnit,
            weightValue: productVariants.weightValue,
            price: productVariants.price,
            stock: productVariants.stock,
          },
          isOffered: products.isOffered,
          discountAmount: products.discount,
          thumbnail: products.thumbnail,
          category: products.category,
          productName: products.name,
          slug: products.slug,
        })
        .from(products)
        .innerJoin(
          productVariants,
          and(
            eq(productVariants.productId, products.id),
            eq(productVariants.weightUnit, item.weightUnit),
            eq(productVariants.weightValue, item.weightValue),
          ),
        )
        .innerJoin(orderItems, eq(orderItems.productId, products.id))
        .where(
          and(
            eq(products.id, item.productId),
            eq(orderItems.orderId, unfinishedCart.orderId),
          ),
        )
        .get();

      console.log("productInfo : ");
      console.log(productInfo);

      return {
        ...productInfo,
        quantity: item.quantity,
      };
    }),
  );

  return {
    success: true,
    orderId: unfinishedCart.orderId,
    cartItems: requiredCartDetails,
  };
};
