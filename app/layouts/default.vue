<script lang="ts" setup>
import { BottomNav } from "@/components/shared/bottom-nav";
import { Navbar } from "@/components/shared/navbar";
import { useNetwork } from "@vueuse/core";

const { isOnline } = useNetwork();
</script>

<template>
  <div class="flex flex-col min-h-screen justify-between">
    <Navbar />

    <div v-if="!isOnline" class="text-xs font-medium text-center p-1 bg-destructive">
      You're currently offline...
    </div>

    <div class="flex-1">
      <slot />
    </div>
    <BottomNav />
  </div>
</template>
