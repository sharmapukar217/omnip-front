<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { DialogTitle } from "@/components/ui/dialog";
import { DrawerTitle } from "@/components/ui/drawer";
import { useIsDesktop } from "./lib";

const isDesktop = useIsDesktop();
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <DialogTitle v-if="isDesktop" v-bind="props">
    <slot />
  </DialogTitle>

  <DrawerTitle v-else v-bind="props">
    <slot />
  </DrawerTitle>
</template>
