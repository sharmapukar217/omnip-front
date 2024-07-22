<script setup lang="ts">
import { FormInput } from "@/components/ui/form";
import { userEmailResponse } from "@/lib/cache";
import { cn } from "@/lib/utils";
import { debouncedWatch, useVModel } from "@vueuse/core";
import { EMAIL_REGEX } from "valibot";
import { useSetFieldError } from "vee-validate";
import type { HTMLAttributes } from "vue";

type Status = "loading" | "valid" | "invalid";

type InputProps = {
  id?: string;
  required?: boolean;
  modelValue?: string;
  autocorrect?: string;
  placeholder?: string;
  defaultValue?: string;
  autocomplete?: string;
  validateImmediately?: boolean;
  class?: HTMLAttributes["class"];
  onResponse?: (hasUser: boolean, _: { setStatus: typeof setStatusFn }) => void;
};

const { t } = useI18n();
const setError = useSetFieldError();
const props = defineProps<InputProps>();
const emits = defineEmits<{ (e: "update:modelValue", payload: string | number): void }>();

/** set the status of the input field */
const setStatusFn = (newStatus: "invalid" | "valid") => {
  if (newStatus === "valid") status.value = "valid";
  else if (newStatus === "invalid") status.value = "invalid";
};

const controller = new AbortController();

const { readUsers } = useDirectusUsers({
  staticToken: true,
  options: {
    fetchOptions: {
      signal: controller.signal
    }
  }
});

const status = ref<Status | undefined>(undefined);
const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue
});

const stop = debouncedWatch(
  modelValue,
  async (value) => {
    status.value = undefined;

    const email = value?.trim();
    if (!email || !EMAIL_REGEX.test(email)) return;

    try {
      setError(" ");
      controller.abort();
      status.value = "loading";

      if (!userEmailResponse.has(email)) {
        const users = await readUsers({
          filter: { email: { _eq: value } },
          fields: []
        });
        userEmailResponse.set(email, users?.length);
      }

      setError(undefined);
      status.value = undefined;
      props.onResponse?.(userEmailResponse.get(email) !== 0, {
        setStatus: setStatusFn
      });
    } catch (error) {
      status.value = "invalid";
      setError([t("message.oops")]);

      console.error("<UserEmailField /> debouncedWatch():", error);
    }
  },
  { immediate: props.validateImmediately, debounce: 500 }
);

onUnmounted(() => stop());
</script>

<template>
  <div class="relative">
    <FormInput
      v-bind="props"
      v-model="modelValue"
      type="email"
      :class="
        cn(
          status === 'loading' && 'border-input focus:border-primary focus:ring-primary',
          status === 'invalid' &&
            'border-destructive focus:border-destructive focus:ring-destructive',

          props.class
        )
      " />

    <div
      v-if="modelValue && status"
      class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center">
      <div v-if="status === 'loading'" class="i-line-md-loading-alt-loop !size-6" />

      <div
        v-else-if="status === 'invalid'"
        class="i-line-md-alert-circle-loop text-destructive !size-6" />

      <div
        v-else-if="status === 'valid'"
        class="i-line-md-circle-to-confirm-circle-transition text-green-500 !size-6" />
    </div>
  </div>
</template>
