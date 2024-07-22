<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import type { HTMLAttributes } from "vue";

import { cn } from "@/lib/utils";
import { useFormField } from "./useFormField";

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes["class"];
}>();

const { error } = useFormField();
const emits = defineEmits<{ (e: "update:modelValue", payload: string | number): void }>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue
});
</script>

<template>
  <textare
    v-model="modelValue"
    :class="
      cn(
        'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm font-medium shadow-sm transition-colors',
        'file:border-0 file:text-muted-foreground file:font-medium file:bg-transparent file:text-sm placeholder:text-muted-foreground',
        'focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-2 border-destructive/85 focus:border-destructive focus:ring-0',
        props.class
      )
    " />
</template>
