<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import type { HTMLAttributes } from "vue";

import { cn } from "@/lib/utils";
import { useFormField } from "./useFormField";

type InputProps = {
  modelValue?: string | number;
  defaultValue?: string | number;
  class?: HTMLAttributes["class"];
};

const { error } = useFormField();
const props = defineProps<InputProps>();
const emits = defineEmits<{ (e: "update:modelValue", payload: string | number): void }>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue
});
</script>

<template>
  <input
    v-bind="props"
    v-model="modelValue"
    :class="
      cn(
        'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm font-medium shadow-sm transition-colors',
        'file:border-0 file:text-muted-foreground file:font-medium file:bg-transparent file:text-sm placeholder:text-muted-foreground',
        'focus:ring-2 focus:ring-primary/60 focus:border-primary focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error &&
          'border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/60',
        props.class
      )
    " />
</template>
