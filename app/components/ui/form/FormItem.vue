<template>
  <div :class="cn('space-y-2', props.class)">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { cn } from "@/lib/utils";
import { useId } from "radix-vue";
import type { HTMLAttributes, InjectionKey } from "vue";
import { defineProps, provide } from "vue";

const id = useId();
provide(FORM_ITEM_INJECTION_KEY, id);

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<script lang="ts">
export const FORM_ITEM_INJECTION_KEY = Symbol() as InjectionKey<string>;
</script>
