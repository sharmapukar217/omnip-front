<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { DialogFooter } from "@/components/ui/dialog";
import { DrawerFooter } from "@/components/ui/drawer";
import { useIsDesktop } from "./lib";

const isDesktop = useIsDesktop();
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <DialogFooter v-if="isDesktop" v-bind="props">
    <slot />
  </DialogFooter>

  <DrawerFooter v-else v-bind="props">
    <slot />
  </DrawerFooter>
</template>
