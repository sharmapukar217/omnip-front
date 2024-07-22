<script setup lang="ts">
import { cn } from "@/lib/utils";
import { Primitive, type PrimitiveProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { type ButtonVariants, buttonVariants } from ".";

interface Props extends PrimitiveProps {
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  class?: HTMLAttributes["class"];
  noRing?: ButtonVariants["noRing"];
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
  noRing: false,
  size: "default",
  variant: "default",
  class: undefined
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :disabled="loading || disabled"
    :class="cn(buttonVariants({ variant, size, noRing }), props.class)">
    <div v-if="loading" class="i-line-md-loading-twotone-loop !size-7" />
    <slot v-else />
  </Primitive>
</template>
