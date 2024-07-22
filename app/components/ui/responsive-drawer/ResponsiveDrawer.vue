<script setup lang="ts">
import { type DialogRootProps } from "radix-vue";
import type { DrawerRootProps } from "vaul-vue";

import { DialogRoot } from "@/components/ui/dialog";
import { DrawerRoot } from "@/components/ui/drawer";
import { useIsDesktop } from "./lib";

type ResponsiveDrawerEmits = {
  (event: "update:open", value: boolean): void;
  (event: "update:activeSnapPoint", val: string | number): void;
};

type ResponsiveDrawerProps = {
  open?: boolean;
  dismissible?: boolean;
  // eslint-disable-next-line vue/require-default-prop
  drawerProps?: DrawerRootProps;
  // eslint-disable-next-line vue/require-default-prop
  dialogProps?: DialogRootProps;
};

const emits = defineEmits<ResponsiveDrawerEmits>();
const props = withDefaults(defineProps<ResponsiveDrawerProps>(), {
  dismissible: true
});

const mounted = ref(false);
onMounted(() => (mounted.value = true));

const isDesktop = useIsDesktop();
const isOpen = defineModel<boolean>("open", { default: false });
</script>

<template>
  <DialogRoot
    v-if="isDesktop"
    v-model:open="isOpen"
    v-bind="props.dialogProps"
    :dismissible="props.dismissible"
    @update:open="(v: boolean) => emits('update:open', v)">
    <slot v-if="mounted" />
  </DialogRoot>

  <DrawerRoot
    v-else
    v-model:open="isOpen"
    v-bind="props.drawerProps"
    :dismissible="props.dismissible"
    @update:open="(v: boolean) => emits('update:open', v)"
    @update:active-snap-point="(v) => emits('update:activeSnapPoint', v)">
    <slot v-if="mounted" />
  </DrawerRoot>
</template>
