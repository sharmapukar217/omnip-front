<script setup lang="ts">
import { type DialogContentProps } from "radix-vue";

import { DialogContent } from "@/components/ui/dialog";
import { DrawerContent } from "@/components/ui/drawer";
import { useIsDesktop } from "./lib";

type ResponsiveDrawerContentProps = {
  dialogProps?: DialogContentProps;
};

const isDesktop = useIsDesktop();
const props = defineProps<ResponsiveDrawerContentProps>();
const { dialogProps, ...restProps } = props;
</script>

<template>
  <DialogContent v-if="isDesktop" v-bind="dialogProps">
    <slot />
  </DialogContent>

  <DrawerContent v-else v-bind="restProps">
    <slot />
  </DrawerContent>
</template>
