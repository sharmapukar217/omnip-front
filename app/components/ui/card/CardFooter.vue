<script setup lang="ts">
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div :class="cn('flex items-center px-6 py-3 border-t bg-muted/50', props.class)">
    <slot />
  </div>
</template>
