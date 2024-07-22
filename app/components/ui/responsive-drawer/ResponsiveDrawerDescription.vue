<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { DialogDescription } from "@/components/ui/dialog";
import { DrawerDescription } from "@/components/ui/drawer";
import { useIsDesktop } from "./lib";

const isDesktop = useIsDesktop();
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <DialogDescription v-if="isDesktop" v-bind="props">
    <slot />
  </DialogDescription>

  <DrawerDescription v-else v-bind="props">
    <slot />
  </DrawerDescription>
</template>
