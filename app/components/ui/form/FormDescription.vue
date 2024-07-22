<script lang="ts" setup>
import type { HTMLAttributes } from "vue";

import { cn } from "@/lib/utils";
import { useFormField } from "./useFormField";

const { formDescriptionId } = useFormField();
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <p :id="formDescriptionId" :class="cn('text-sm text-muted-foreground', props.class)">
    <slot />
  </p>
</template>
