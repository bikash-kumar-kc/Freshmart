// app/api/webhooks/stripe/route.ts
import Stripe from "stripe";
import { db } from "@/src/db/config";
import { orders, orderItems, productVariants, products } from "@/src/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getStripeClient } from "@/src/stripe";
import { createNotification } from "@/src/lib/server actions/notifications.server";
// import { createNotification } from "@/src/lib/notifications";

export async function POST(req: Request) {


  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const stripeClient = getStripeClient();

  if (!stripeClient) {
    return new Response("Stripe client not found ", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripeClient.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handlePaymentSuccess(
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      case "checkout.session.expired":
        await handlePaymentExpired(
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        break;
    }
    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("[webhook] handler error", err);
    return new Response("Handler failed", { status: 500 });
  }
}

//checkout.session.completed ...
async function handlePaymentSuccess(session: Stripe.Checkout.Session) {
  const { orderId, userId } = session.metadata ?? {};
  if (!orderId || !userId)
    throw new Error("missing orderId or userId in metadata");

  // idempotency check
  const existing = await db
    .select({ isPayment: orders.isPayment })
    .from(orders)
    .where(eq(orders.id, orderId))
    .get();
  if (existing?.isPayment) return;

  const items = await db
    .select({
      productId: orderItems.productId,
      weightValue: orderItems.weightValue,
      weightUnit: orderItems.weightUnit,
      quantity: orderItems.quantity,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  if (items.length === 0)
    throw new Error(`no items found for order ${orderId}`);

  await db.transaction(async (tx) => {
    // mark as payment successed...
    await tx
      .update(orders)
      .set({
        isPayment: true,
        isPaymentProcess: false,
        isOrdered: true,
        orderStatus: "packaging",
      })
      .where(eq(orders.id, orderId));

    //deduct stock + release reservation...
    for (const item of items) {
      await tx
        .update(productVariants)
        .set({
          stock: sql`${productVariants.stock} - ${item.quantity}`,
          reservedStock: sql`${productVariants.reservedStock} - ${item.quantity}`,
        })
        .where(
          and(
            eq(productVariants.productId, item.productId),
            eq(productVariants.weightValue, item.weightValue),
            eq(productVariants.weightUnit, item.weightUnit),
          ),
        );
    }

    //mark product out_of_stock if all variants exhausted...
    for (const item of items) {
      const variant = await tx
        .select({ stock: productVariants.stock })
        .from(productVariants)
        .where(
          and(
            eq(productVariants.productId, item.productId),
            eq(productVariants.weightValue, item.weightValue),
            eq(productVariants.weightUnit, item.weightUnit),
          ),
        )
        .get();

      if (variant && variant.stock <= 0) {
        await tx
          .update(products)
          .set({ status: "out_of_stock" })
          .where(eq(products.id, item.productId));
      }
    }
  });

  // notifications outside transaction, non-critical...
  await createNotification({
    userId,
    type: "payment_success",
    title: "Payment success",
    content: `Payment Successed.`,
  });
  await createNotification({
    userId,
    type: "payment_failed",
    title: "Payment Failed",
    content: `Failed to Payment . OrderedId:${orderId}`,
  });

  console.log("[webhook] payment success", { orderId, userId });
}

//checkout.session.expired..
async function handlePaymentExpired(session: Stripe.Checkout.Session) {
  const { orderId, userId } = session.metadata ?? {};
  if (!orderId) return;

  const existing = await db
    .select({ isPaymentProcess: orders.isPaymentProcess })
    .from(orders)
    .where(eq(orders.id, orderId))
    .get();
  if (!existing?.isPaymentProcess) return; 

  const items = await db
    .select({
      productId: orderItems.productId,
      weightValue: orderItems.weightValue,
      weightUnit: orderItems.weightUnit,
      quantity: orderItems.quantity,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  await db.transaction(async (tx) => {
    await tx
      .update(orders)
      .set({ isPayment: false, isPaymentProcess: false, orderStatus: "failed" })
      .where(eq(orders.id, orderId));

    for (const item of items) {
      await tx
        .update(productVariants)
        .set({
          reservedStock: sql`${productVariants.reservedStock} - ${item.quantity}`,
        })
        .where(
          and(
            eq(productVariants.productId, item.productId),
            eq(productVariants.weightValue, item.weightValue),
            eq(productVariants.weightUnit, item.weightUnit),
          ),
        );
    }
  });

  if (userId) {
    await createNotification({
      userId,
      type: "payment_failed",
      title: "Payment Failed",
      content: `Failed to Payment . OrderedId:${orderId}`,
    });
  }

  console.log("[webhook] session expired, reservation released", { orderId });
}

// payment_intent.payment_failed ...
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {

  const { orderId, userId } = paymentIntent.metadata ?? {};

  if (!orderId) return;

  const existing = await db
    .select({ isPaymentProcess: orders.isPaymentProcess })
    .from(orders)
    .where(eq(orders.id, orderId))
    .get();
  if (!existing?.isPaymentProcess) return;


  const items = await db
    .select({
      productId: orderItems.productId,
      weightValue: orderItems.weightValue,
      weightUnit: orderItems.weightUnit,
      quantity: orderItems.quantity,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  await db.transaction(async (tx) => {
    await tx
      .update(orders)
      .set({ isPayment: false, isPaymentProcess: false, orderStatus: "failed" })
      .where(eq(orders.id, orderId));

    for (const item of items) {
      await tx
        .update(productVariants)
        .set({
          reservedStock: sql`${productVariants.reservedStock} - ${item.quantity}`,
        })
        .where(
          and(
            eq(productVariants.productId, item.productId),
            eq(productVariants.weightValue, item.weightValue),
            eq(productVariants.weightUnit, item.weightUnit),
          ),
        );
    }
  });

  if (userId) {
    await createNotification({
      userId,
      type: "payment_failed",
      title: "Payment Failed",
      content: `Failed to Payment . OrderedId:${orderId}`,
    });
  }

  console.log("[webhook] payment failed, reservation released", { orderId });
}
