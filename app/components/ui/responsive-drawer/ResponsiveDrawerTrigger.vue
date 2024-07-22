<script setup lang="ts">
import { type DialogTriggerProps } from "radix-vue";

import { DialogTrigger } from "@/components/ui/dialog";
import { DrawerTrigger } from "@/components/ui/drawer";
import { useIsDesktop } from "./lib";

type ResponsiveDrawerTriggerProps = DialogTriggerProps;

const isDesktop = useIsDesktop();
const props = defineProps<ResponsiveDrawerTriggerProps>();
</script>

<template>
  <DialogTrigger v-if="isDesktop" v-bind="props">
    <slot />
  </DialogTrigger>

  <DrawerTrigger v-else v-bind="props">
    <slot />
  </DrawerTrigger>
</template>
