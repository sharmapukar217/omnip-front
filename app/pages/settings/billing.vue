<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { StripeElements } from "@stripe/stripe-js";

let elements: StripeElements | undefined;

const { $stripe } = useNuxtApp();

const handleSubmit = async (ev) => {
  ev.preventDefault();
  const response = await elements?.submit();
  console.log(response);
};

const th = async () => {
  if (!$stripe) return;
  const response = await $fetch("/api/create-payment-intent", {
    method: "POST",
    body: JSON.stringify({ currency: "eur", amount: 7000 })
  });

  elements = $stripe.elements({ clientSecret: response.clientSecret });
  const paymentElement = elements?.create("payment", {
    layout: "tabs",
  });
  paymentElement.mount("#payment-element");
  const linkAuthenticationElement = elements?.create("linkAuthentication");
  linkAuthenticationElement.mount("#link-authentication-element");

  // const paymentElement = elements?.create("payment", {
  //   amount: 500,
  //   currency: "USD",

  //   classes: {},
  //   layout: {
  //     type: "tabs"
  //   }
  // });

  // paymentElement?.mount("#payment-element");

  // const sheet = await Stripe.createPaymentSheet({
  //   paymentIntentClientSecret: response.client_secret,
  //   merchantDisplayName: "Inclusive Innovation Incubator"
  // });

  // const paymentResult = await Stripe.presentPaymentSheet();

  // console.log(paymentResult);
};

onMounted(async () => {});
</script>

<template>
  <NuxtLayout name="settings">
    <Card.Root>
      <Card.Header>
        <Card.Title>Your current subscription </Card.Title>
      </Card.Header>

      <Card.Content>
        <div class="flex items-center gap-2">
          <h4 class="text-lg font-bold text-primary">
            <span>Basic</span><small class="font-normal"> ($9.00/month) </small>
          </h4>

          <div
            class="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase leading-tight bg-emerald-500/10 text-emerald-500">
            Active
          </div>
        </div>

        <Card.Description class="text-base">
          The next payment will be on 8/21/2024
        </Card.Description>
      </Card.Content>
      <Card.Footer class="flex justify-between">
        <Button @click="() => th()">Manage billing details</Button>
        <Button variant="destructive">Cancel subscription</Button>
      </Card.Footer>
    </Card.Root>

    <form @click="handleSubmit">
      <div id="link-authentication-element" />
      <div id="payment-element" />
      <button id="submit">Pay now</button>
    </form>
  </NuxtLayout>
</template>
