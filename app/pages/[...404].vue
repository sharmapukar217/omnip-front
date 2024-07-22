<script lang="ts" setup>
import SVG404 from "@/assets/404.svg";
import { Button } from "@/components/ui/button";

const previousRoute = usePreviousRoute();
</script>

<template>
  <div
    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 container grid place-items-center">
    <img :src="SVG404" class="w-60 h-full object-cover md:size-72" />

    <h1 class="text-4xl font-bold tracking-tight forground sm:text-4xl">Uh-oh!</h1>

    <p class="my-4 text-muted-foreground font-medium">We can't find that page.</p>
    <Button variant="ghost" class="px-10">
      <NuxtLink :to="previousRoute">Go Back</NuxtLink>
    </Button>
  </div>
</template>
