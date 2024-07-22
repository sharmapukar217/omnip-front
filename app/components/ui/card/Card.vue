<script setup lang="ts">
import { cn } from "@/lib/utils";
import { Primitive, type PrimitiveProps } from "radix-vue";

interface Props extends PrimitiveProps {
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  as: "div",
  class: undefined
});
</script>

<template>
  <Primitive
    :as="as"
    :class="cn('rounded-xl border bg-background text-foreground shadow', props.class)">
    <slot />
  </Primitive>
</template>
