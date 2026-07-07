"use client";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { db } from "@/src/db/config";
import { orders } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";
import { getStripeClient } from "@/src/stripe";
import Stripe from "stripe";

interface IPaymentInitiatorType {
  userId: string;
  ordereId: string;
}

interface IPaymentInitiatorType {
  userId: string;
  ordereId: string;
}

interface IOutOfStockItem {
  productId: string;
  productName: string;
  requested: number;
  available: number;
}

type PaymentInitiatorResult =
  | { success: true; url: string }
  | { success: false; reason: "out_of_stock"; items: IOutOfStockItem[] }
  | { success: false; reason: "error"; message: string };

export const paymentInitiator = async ({
  userId,
  ordereId,
}: IPaymentInitiatorType): Promise<PaymentInitiatorResult> => {
  try {
    // basic validation ──────────────────
    if (!userId || !ordereId) {
      return {
        success: false,
        reason: "error",
        message: "UserId or OrderedId is missing.",
      };
    }

    // auth check ────────────────────────
    const session = await getServerSession(authOptions);
    if (!session || session.user.id !== userId) {
      return {
        success: false,
        reason: "error",
        message: "User is unauthenticated.",
      };
    }

    const isOrderedExist = await db
      .select({
        orderedId: orders.id,
        orderStatus: orders.orderStatus,
        isPayment: orders.isPayment,
        isPaymentProcess: orders.isPaymentProcess,
      })
      .from(orders)
      .where(and(eq(orders.id, ordereId), eq(orders.userId, userId)))
      .get();

    if (!isOrderedExist?.orderedId) {
      return {
        success: false,
        reason: "error",
        message: "Order does not exist.",
      };
    }

    // already paid — prevent duplicate checkout
    if (isOrderedExist.isPayment) {
      return {
        success: false,
        reason: "error",
        message: "This order has already been paid.",
      };
    }

    // payment already in progress
    if (isOrderedExist.isPaymentProcess) {
      return {
        success: false,
        reason: "error",
        message: "A payment is already in progress for this order.",
      };
    }

    //fetch full order with items + product + variants ──
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, ordereId),
      with: {
        items: {
          with: {
            product: {
              with: {
                variants: true,
              },
            },
          },
        },
      },
    });

    if (!order || !order.items || order.items.length === 0) {
      return {
        success: false,
        reason: "error",
        message: "Order has no items.",
      };
    }

    // stock check for each item ─────────
    const outOfStockItems: IOutOfStockItem[] = [];

    for (const item of order.items) {
      // find the matching variant by weightValue + weightUnit
      const matchedVariant = item.product.variants.find(
        (v) =>
          v.weightValue === item.weightValue &&
          v.weightUnit === item.weightUnit,
      );

      if (!matchedVariant) {
        outOfStockItems.push({
          productId: item.productId,
          productName: item.product.name,
          requested: item.quantity,
          available: 0,
        });
        continue;
      }

      if (matchedVariant.stock < item.quantity) {
        outOfStockItems.push({
          productId: item.productId,
          productName: item.product.name,
          requested: item.quantity,
          available: matchedVariant.stock,
        });
      }
    }

    // return out of stock items to frontend — don't proceed
    if (outOfStockItems.length > 0) {
      return {
        success: false,
        reason: "out_of_stock",
        items: outOfStockItems,
      };
    }

    const stripeClient = getStripeClient();

    if (!stripeClient) {
      return {
        success: false,
        reason: "error",
        message: "Stripe client not found !",
      };
    }

    // build Stripe line items ────────────
    // format: "Organic Potato, Qty: 2, Rs 130.00"
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      order.items.map((item) => {
        const matchedVariant = item.product.variants.find(
          (v) =>
            v.weightValue === item.weightValue &&
            v.weightUnit === item.weightUnit,
        )!;

        // price per unit in paisa (Stripe uses smallest currency unit)
        // NPR → paisa (1 NPR = 100 paisa)
        const unitAmountInPaisa = Math.round(matchedVariant.price * 100);

        return {
          price_data: {
            currency: "npr",
            product_data: {
              name: item.product.name,
              description: `Qty: ${item.quantity} · Rs ${matchedVariant.price.toFixed(2)} per unit`,
              metadata: {
                productId: item.productId,
                weightValue: String(item.weightValue),
                weightUnit: item.weightUnit,
              },
            },
            unit_amount: unitAmountInPaisa,
          },
          quantity: item.quantity,
        };
      });

    //build metadata for webhook ────────
    // pass totals + orderId so webhook can update the order after payment
    const metadata: Record<string, string> = {
      orderId: ordereId,
      userId,
      totalPrice: String(order.totalPrice ?? 0),
      totalPriceAfterDiscount: String(order.totalPriceAfterDiscount ?? 0),
      totalSave: String(order.totalSave ?? 0),
    };

    //create Stripe checkout session ────
    const checkoutSession = await stripeClient.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      metadata,

      // success : order status page
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success/${ordereId}?session_id={CHECKOUT_SESSION_ID}`,

      // cancel : back to cart with retry option
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel?payment=cancelled&orderId=${ordereId}`,

      // show order summary on Stripe page
      payment_intent_data: {
        metadata,
        description: `FreshMart order #${ordereId}`,
      },
    });

    if (!checkoutSession.url) {
      return {
        success: false,
        reason: "error",
        message: "Failed to create Stripe checkout session.",
      };
    }

    // mark order as payment in progress...
    await db
      .update(orders)
      .set({ isPaymentProcess: true })
      .where(eq(orders.id, ordereId));

    return {
      success: true,
      url: checkoutSession.url,
    };
  } catch (error) {
    console.error("[paymentInitiator]", error);
    return {
      success: false,
      reason: "error",
      message: "Something went wrong. Please try again.",
    };
  }
};
