import Stripe from "stripe";

export const getStripeClient = () => {
  try {
    const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);
    return stripeClient;
  } catch (error: unknown) {
    console.error("Failed to connect to Stripe!!!");
    console.log(error);
  }
};
