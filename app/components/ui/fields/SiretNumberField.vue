<script setup lang="ts">
import { FormInput } from "@/components/ui/form";
import { userSiretResponse } from "@/lib/cache";
import { cn } from "@/lib/utils";
import { debouncedWatch, useVModel } from "@vueuse/core";
import { useIsFieldValid, useSetFieldError } from "vee-validate";
import type { HTMLAttributes } from "vue";

type Status = "loading" | "valid" | "invalid";

type Data = {
  siret: string;
  entreprise: string;
  type_entreprise: string;

  adresse: string;
  adresse2: string | undefined;

  ville: string;
  code_postal: string;
};

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
  onResponse?: (info?: Data) => void;
};

const { t } = useI18n();
const isValid = useIsFieldValid();
const setError = useSetFieldError();
const props = defineProps<InputProps>();
const emits = defineEmits<{ (e: "update:modelValue", payload: string | number): void }>();

const status = ref<Status | undefined>(undefined);
const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue
});

const stop = debouncedWatch(
  modelValue,
  async (value) => {
    status.value = undefined;
    if (!value || !isValid.value) return;

    try {
      setError(" ");
      status.value = "loading";

      if (userSiretResponse.has(value)) {
        const data = userSiretResponse.get(value) as Data;
        status.value = !data ? "invalid" : "valid";
        return props.onResponse?.(data);
      }

      const url = "https://api.insee.fr/entreprises/sirene/V3.11/siret/" + value;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${import.meta.env.NUXT_PUBLIC_SIRET_API_KEY}`
        }
      });

      if (!response.ok) {
        setError(undefined);
        status.value = "invalid";
        userSiretResponse.set(value, null as any);
      } else {
        status.value = "valid";
        const json = await response.json();

        /** type of enterprise */
        const type_entreprise =
          json.etablissement.adresseEtablissement.typeVoieEtablissement;

        /** enterprise name */
        const entreprise = json.etablissement.uniteLegale.denominationUniteLegale;

        /** first address */
        const adresse = [
          json.etablissement.adresseEtablissement.numeroVoieEtablissement,
          type_entreprise,
          json.etablissement.adresseEtablissement.indiceRepetitionEtablissement,
          json.etablissement.adresseEtablissement.libelleVoieEtablissement
        ]
          .filter(Boolean)
          .join(" ");

        /** 2nd address */
        const adresse2 =
          json.etablissement.adresseEtablissement.complementAdresseEtablissement;

        /** city */
        const ville = json.etablissement.adresseEtablissement.libelleCommuneEtablissement;

        /** postal code */
        const code_postal =
          json.etablissement.adresseEtablissement.codePostalEtablissement;

        userSiretResponse.set(value, {
          siret: value,
          entreprise,
          adresse,
          adresse2,
          ville,
          code_postal,
          type_entreprise
        });

        props.onResponse?.(userSiretResponse.get(value) as Data);
      }
    } catch (error) {
      status.value = "invalid";
      setError([t("message.oops")]);
      props.onResponse?.(userSiretResponse.get(value) as Data);
      console.error("<SiretNumberField /> debouncedWatch():", error);
    }
  },
  { immediate: props.validateImmediately, debounce: 300 }
);

onUnmounted(() => stop());
</script>

<template>
  <div class="relative">
    <FormInput
      v-bind="props"
      v-model="modelValue"
      type="text"
      inputmode="numeric"
      :minlength="14"
      :maxlength="14"
      auto-correct="off"
      auto-complete="off"
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
