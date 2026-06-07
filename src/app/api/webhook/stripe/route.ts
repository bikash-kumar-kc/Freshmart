import { NextRequest } from "next/server";
import Stripe from "stripe";

import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getStripeClient } from "@/src/stripe";
import { freqProducts, orderHistory, suggestedCarts } from "@/src/db/schema";
import { db } from "@/src/db/config";

export async function POST(req: NextRequest) {
  // stripe client...
  const stripeClient = getStripeClient();
  if (!stripeClient) {
    return Response.json({
      success: false,
      msg: "Failed to get stripe client",
    });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
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

  if (event.type !== "checkout.session.completed") {
    return new Response("ok", { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // idempotency check .............

  const paymentIntentId = session.payment_intent as string;

  const existing = await db
    .select({ id: orderHistory.id })
    .from(orderHistory)
    .where(eq(orderHistory.stripePaymentId, paymentIntentId))
    .get();

  if (existing) {
    console.log(
      "[webhook] duplicate event — already processed",
      paymentIntentId,
    );
    return new Response("ok", { status: 200 });
  }

  // extract metadata ...
  const { userId, cartId, items: itemsJson } = session.metadata!;

  if (!userId || !itemsJson) {
    console.error("[webhook] missing metadata", session.metadata);
    return new Response("Missing metadata", { status: 400 });
  }

  const items: Array<{
    productId: string;
    quantity: number;
    priceAtTime: number;
  }> = JSON.parse(itemsJson);

  const orderId = nanoid();
  const total = session.amount_total ? session.amount_total / 100 : 0;

  await db.insert(orderHistory).values({
    id: orderId,
    userId,
    items,
    total,
    status: "paid",
    stripePaymentId: paymentIntentId,
  });

  console.log("[webhook] order saved", { orderId, userId, total });

  if (cartId) {
    await db
      .update(suggestedCarts)
      .set({ status: "accepted" })
      .where(
        and(eq(suggestedCarts.id, cartId), eq(suggestedCarts.userId, userId)),
      );

    await Promise.all(
      items.map((item) =>
        db
          .update(freqProducts)
          .set({
            notificationSentAt: null,
            status: "active",
          })
          .where(
            and(
              eq(freqProducts.userId, userId),
              eq(freqProducts.productId, item.productId),
            ),
          ),
      ),
    );
  }

  return new Response("ok", { status: 200 });
}
