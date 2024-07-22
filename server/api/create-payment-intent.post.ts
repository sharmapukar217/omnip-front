import Stripe from "stripe";

const stripe = new Stripe(import.meta.env.NUXT_PRIVATE_STRIPE_KEY);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const response = await stripe.paymentIntents.create({
    amount: body.amount,
    currency: body.currency,
    capture_method: "automatic",
    // payment_method: "accept_a_payment",
    payment_method_types: ["card"],
    // metadata: { integration_check: "accept_a_payment" }
  });

  return { clientSecret: response.client_secret };
});
