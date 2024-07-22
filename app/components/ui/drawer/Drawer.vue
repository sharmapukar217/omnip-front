<script lang="ts" setup>
import { useForwardPropsEmits } from "radix-vue";
import type { DrawerRootEmits, DrawerRootProps } from "vaul-vue";
import { DrawerRoot } from "vaul-vue";

const props = withDefaults(defineProps<DrawerRootProps>(), {
  shouldScaleBackground: true,
  direction: "bottom",
  dismissible: true
});

provide("dismissible", props.dismissible);
const emits = defineEmits<DrawerRootEmits>();
const forwarded = useForwardPropsEmits(props, emits);

// prettier-ignore
provide("direction", computed(() => props.direction));
</script>

<template>
  <DrawerRoot v-bind="forwarded">
    <slot />
  </DrawerRoot>
</template>
