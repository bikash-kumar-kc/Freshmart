import { NextRequest } from "next/server";
import { db } from "@/src/db/config";
import { products } from "@/src/db/schema";
import { inArray } from "drizzle-orm";
import { getStripeClient } from "@/src/stripe";
import { isUserLoggedIn } from "@/src/services/checkUserLoggedIn";
import Stripe from "stripe";
import { Session } from "next-auth";

interface CartItem {
  productId: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  const stripeClient = getStripeClient();
  if (!stripeClient) {
    return Response.json({
      success: false,
      msg: "Failed to get stripe client",
    });
  }

  try {
    const { loggedIn, userId, session } = await isUserLoggedIn();

    if (!loggedIn && !userId && !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── 2. parse body ──────────────────────────────────────
    const body = await req.json();
    const { items, cartId } = body as {
      items: CartItem[];
      cartId?: string;
    };

    if (!items || items.length === 0) {
      return Response.json({ error: "Cart is empty" }, { status: 400 });
    }

    const productIds = items.map((p) => p.productId);

    const dbProducts = await db
      .select({
        id: products.id,
        stockQty: products.stockQty,
      })
      .from(products)
      .where(inArray(products.id, productIds));

    const productsMap = new Map(dbProducts.map((p) => [p.id, p]));

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      const product = productsMap.get(item.productId);

      if (!product) {
        return Response.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 },
        );
      }

      if (product.stockQty < item.quantity) {
        return Response.json(
          {
            error: `Insufficient stock for ${product.name}. Available: ${product.stockQty}`,
          },
          { status: 400 },
        );
      }

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            metadata: { productId: product.id },
          },
          // Stripe expects amount in cents
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      });
    }

    // ── 5. create Stripe Checkout Session ──────────────────
    const checkoutSession = await stripeClient.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,

      metadata: {
        userId: userId!,
        cartId: cartId ?? "",

        items: JSON.stringify(
          items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            priceAtTime: productsMap.get(i.productId)!.price,
          })),
        ),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,

      customer_email: (session as Session)?.user?.email ?? undefined,
    });

    return Response.json({ url: checkoutSession.url }, { status: 200 });
  } catch (err) {
    console.error("[create-session]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }

  return Response.json(
    {
      success: true,
      data: {
        message: "Payment successful ",
      },
    },
    { status: 200 },
  );
}
