import { loadStripe } from "@stripe/stripe-js";

export default defineNuxtPlugin(async () => {
  return {
    provide: {
      stripe: await loadStripe(import.meta.env.NUXT_PUBLIC_STRIPE_KEY)
    }
  };
});
