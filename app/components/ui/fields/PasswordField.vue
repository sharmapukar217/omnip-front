<script setup lang="ts">
import FormInput from "@/components/ui/form/FormInput.vue";
import { cn } from "@/lib/utils";
import { useVModel } from "@vueuse/core";
import type { HTMLAttributes } from "vue";
import { ref } from "vue";

const props = defineProps<{
  placeholder?: string;
  id?: string | undefined;
  modelValue?: string | number;
  required?: boolean | undefined;
  defaultValue?: string | number;
  autocorrect?: string | undefined;
  autocomplete?: string | undefined;
  class?: HTMLAttributes["class"];
}>();

const isPasswordShown = ref(false);
const emits = defineEmits<{ (e: "update:modelValue", payload: string | number): void }>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue
});
</script>

<template>
  <div class="relative w-full">
    <FormInput
      v-bind="props"
      v-model="modelValue"
      placeholder="●●●●●●●●"
      :type="isPasswordShown ? 'text' : 'password'" />

    <button
      type="button"
      class="absolute top-0 right-0.5 h-full px-2 flex items-center justify-center"
      @click="() => (isPasswordShown = !isPasswordShown)">
      <div
        :class="cn('text-lg', isPasswordShown ? 'i-lucide-eye-off' : 'i-lucide-eye')" />
    </button>
  </div>
</template>
