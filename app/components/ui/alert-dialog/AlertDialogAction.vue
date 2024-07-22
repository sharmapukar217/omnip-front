<script setup lang="ts">
import { buttonVariants, type ButtonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertDialogAction, type AlertDialogActionProps } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";

const props = defineProps<
  AlertDialogActionProps & {
    class?: HTMLAttributes["class"];

    size?: ButtonVariants["size"];
    variant?: ButtonVariants["variant"];
  }
>();

const delegatedProps = computed(() => {
  const { class: _, variant: _variant, size: _size, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <AlertDialogAction
    v-bind="delegatedProps"
    :class="
      cn(buttonVariants({ size: props.size, variant: props.variant }), props.class)
    ">
    <slot />
  </AlertDialogAction>
</template>
