<script setup lang="ts">
import { type DialogTriggerProps } from "radix-vue";

import { DialogClose } from "@/components/ui/dialog";
import { DrawerClose } from "@/components/ui/drawer";
import { useIsDesktop } from "./lib";

type ResponsiveDrawerTriggerProps = DialogTriggerProps;

const isDesktop = useIsDesktop();
const props = defineProps<ResponsiveDrawerTriggerProps>();
</script>

<template>
  <DialogClose v-if="isDesktop" v-bind="props">
    <slot />
  </DialogClose>

  <DrawerClose v-else v-bind="props">
    <slot />
  </DrawerClose>
</template>
