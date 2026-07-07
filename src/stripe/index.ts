import Stripe from "stripe";

export const getStripeClient = () => {
  try {
    const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-05-27.dahlia",
    });
    return stripeClient;
  } catch (error: unknown) {
    console.error("Failed to connect to Stripe!!!");
    console.log(error);
  }
};
