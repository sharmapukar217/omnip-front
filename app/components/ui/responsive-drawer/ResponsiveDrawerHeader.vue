<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { DialogHeader } from "@/components/ui/dialog";
import { DrawerHeader } from "@/components/ui/drawer";
import { useIsDesktop } from "./lib";

const isDesktop = useIsDesktop();
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <DialogHeader v-if="isDesktop" v-bind="props">
    <slot />
  </DialogHeader>

  <DrawerHeader v-else v-bind="props">
    <slot />
  </DrawerHeader>
</template>
