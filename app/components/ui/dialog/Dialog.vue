<script setup lang="ts">
import {
  DialogRoot,
  type DialogRootEmits,
  type DialogRootProps,
  useForwardPropsEmits
} from "radix-vue";

type DialogProps = DialogRootProps & {
  dismissible?: boolean;
};

const emits = defineEmits<DialogRootEmits>();
const { dismissible, ...props } = withDefaults(defineProps<DialogProps>(), {
  dismissible: true
});

provide("dismissible", dismissible);
const forwarded = useForwardPropsEmits(props, emits);

const isOpen = defineModel<boolean>("open", { default: false });
</script>

<template>
  <DialogRoot v-bind="forwarded" v-model:open="isOpen">
    <slot />
  </DialogRoot>
</template>
