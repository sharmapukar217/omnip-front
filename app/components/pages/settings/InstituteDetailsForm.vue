<script lang="ts" setup>
import { Form } from "@/components/ui/form";
import { userSiretResponse } from "@/lib/cache";
import { cn } from "@/lib/utils";
import { watchDebounced } from "@vueuse/core";
import { useField } from "vee-validate";

const { t } = useI18n();
let controller: AbortController | undefined;
const field = useField<string>("institute.siret");
const siretStatus = ref<undefined | "loading" | "valid" | "invalid">(undefined);

const props = withDefaults(
  defineProps<{
    immediate?: boolean;
    shouldCheckSiret?: boolean;
    onResponse?: (instituteDetails: any | undefined) => void;
  }>(),
  { shouldCheckSiret: true, onResponse: undefined, immediate: false }
);

/**
 * handle siret number change
 */
// const handleSiretInput = debounce(async (ev: InputEvent) => {
//   if (!props.shouldCheckSiret) return;

//   const siret = (ev.target as HTMLInputElement).value;
//   if (siret.length !== 14) return;

//   /** Please don't translate this, this is a constant */
//   siretStatus.value = "checking";
//   if (controller) controller.abort();

//   try {
//     controller = new AbortController();
//     const url = "https://api.insee.fr/entreprises/sirene/V3.11/siret/" + siret;
//     const response = await fetch(url, {
//       signal: controller.signal,
//       headers: { Authorization: `Bearer ${import.meta.env.NUXT_PUBLIC_SIRET_API_KEY}` }
//     });

//     if (!response.ok) {
//       siretStatus.value = "invalid";
//       return props.onResponse?.(undefined);
//     }

//     const json = await response.json();

//     siretStatus.value = "valid";
//     /** type of enterprise */
//     const type_entreprise = json.etablissement.adresseEtablissement.typeVoieEtablissement;

//     /** enterprise name */
//     const entreprise = json.etablissement.uniteLegale.denominationUniteLegale;

//     /** first address */
//     const adresse = [
//       json.etablissement.adresseEtablissement.numeroVoieEtablissement,
//       type_entreprise,
//       json.etablissement.adresseEtablissement.indiceRepetitionEtablissement,
//       json.etablissement.adresseEtablissement.libelleVoieEtablissement
//     ]
//       .filter(Boolean)
//       .join(" ");

//     /** 2nd address */
//     const adresse2 =
//       json.etablissement.adresseEtablissement.complementAdresseEtablissement;

//     /** city */
//     const ville = json.etablissement.adresseEtablissement.libelleCommuneEtablissement;

//     /** postal code */
//     const code_postal = json.etablissement.adresseEtablissement.codePostalEtablissement;

//     // prettier-ignore
//     props.onResponse?.({ siret, entreprise, adresse, adresse2, ville, code_postal, type_entreprise });
//   } catch {
//     props.onResponse?.(undefined);
//   } finally {
//     controller = undefined;
//   }
// });

const handleSiretChange = async (siret: string) => {
  siretStatus.value = undefined;
  if (!siret || !field.meta.valid) return;

  try {
    field.setErrors([" "]);
    siretStatus.value = "loading";
    if (controller) return controller.abort();

    controller = new AbortController();
    const url = `https://api.insee.fr/entreprises/sirene/V3.11/siret/${siret}`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Authorization: `Bearer ${import.meta.env.NUXT_PUBLIC_SIRET_API_KEY}` }
    });

    if (!response.ok) {
      siretStatus.value = "invalid";
      userSiretResponse.set(siret, null as any);
      return props.onResponse?.(undefined);
    }

    const json = await response.json();

    /** type of enterprise */
    const type_entreprise = json.etablissement.adresseEtablissement.typeVoieEtablissement;

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
    const code_postal = json.etablissement.adresseEtablissement.codePostalEtablissement;

    const data = {
      siret,
      entreprise,
      adresse,
      adresse2,
      ville,
      code_postal,
      type_entreprise
    };

    field.setErrors([]);
    siretStatus.value = "valid";
    return props.onResponse?.(data);
  } catch (error) {
    if (error.name === "AbortError") {
      siretStatus.value = undefined;
    } else {
      siretStatus.value = "invalid";
      field.setErrors([t("message.oops")]);
    }
  } finally {
    controller = undefined;
  }
};

watchDebounced(field.value, (v) => handleSiretChange(v), {
  debounce: 400,
  immediate: props.immediate
});
</script>

<template>
  <div class="space-y-4 mt-4">
    <div class="grid gap-4 md:gap-0 md:grid-cols-2">
      <Form.Field v-slot="{ componentField }" name="institute.siret">
        <Form.Item class="relative w-11/12">
          <Form.Label>
            <small>{{ $t("label.siret") }}</small>
            <sup class="text-destructive ms-1">*</sup>
          </Form.Label>
          <Form.Control>
            <div class="relative">
              <Form.Input
                required
                :class="
                  cn(
                    'pe-10',
                    siretStatus === 'loading' &&
                      'bg-muted focus:ring-primary/60 focus:border-primary'
                  )
                "
                :minlength="14"
                :maxlength="14"
                inputmode="numeric"
                auto-correct="off"
                auto-complete="off"
                v-bind="componentField"
                :placeholder="$t('placeholder.example', { ex: '732 829 320 00074' })" />

              <div
                v-if="siretStatus"
                class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <div
                  v-if="siretStatus === 'loading'"
                  class="i-line-md-loading-alt-loop !size-6" />

                <div
                  v-else-if="siretStatus === 'invalid'"
                  class="i-line-md-alert-circle-loop text-destructive !size-6" />

                <div
                  v-else-if="siretStatus === 'valid'"
                  class="i-line-md-circle-to-confirm-circle-transition text-green-500 !size-6" />
              </div>
            </div>
            <Form.Message />
          </Form.Control>
        </Form.Item>
      </Form.Field>

      <Form.Field v-slot="{ componentField }" name="institute.entreprise">
        <Form.Item class="relative">
          <Form.Label>
            <small>{{ $t("label.entreprise") }}</small>
            <sup class="text-destructive ms-1">*</sup>
          </Form.Label>
          <Form.Control>
            <Form.Input
              required
              class="pe-10"
              auto-correct="off"
              auto-complete="off"
              v-bind="componentField"
              :placeholder="$t('placeholder.example', { ex: 'Omnip' })" />
            <Form.Message />
          </Form.Control>
        </Form.Item>
      </Form.Field>
    </div>

    <Form.Field v-slot="{ componentField }" name="institute.type_entreprise">
      <Form.Item class="relative">
        <Form.Label>
          <small>{{ $t("label.type.entreprise") }}</small>
          <sup class="text-destructive ms-1">*</sup>
        </Form.Label>
        <Form.Control>
          <Form.Input
            required
            class="pe-10"
            auto-correct="off"
            auto-complete="off"
            v-bind="componentField"
            :placeholder="$t('placeholder.example', { ex: 'EURL' })" />
          <Form.Message />
        </Form.Control>
      </Form.Item>
    </Form.Field>

    <Form.Field v-slot="{ componentField }" name="institute.adresse">
      <Form.Item class="relative">
        <Form.Label>
          <small>{{ $t("label.address") }} </small>
          <sup class="text-destructive ms-1">*</sup>
        </Form.Label>
        <Form.Control>
          <Form.Input
            required
            class="pe-10"
            auto-correct="off"
            auto-complete="off"
            v-bind="componentField"
            :placeholder="$t('placeholder.example', { ex: '1 rue du lavoir' })" />
          <Form.Message />
        </Form.Control>
      </Form.Item>
    </Form.Field>

    <Form.Field v-slot="{ componentField }" name="institute.adresse2">
      <Form.Item class="relative">
        <Form.Label>
          <small>{{ $t("label.address2") }}</small>
        </Form.Label>
        <Form.Control>
          <Form.Input
            required
            class="pe-10"
            auto-correct="off"
            auto-complete="off"
            v-bind="componentField" />
          <Form.Message />
        </Form.Control>
      </Form.Item>
    </Form.Field>

    <div class="grid gap-4 lg:grid-cols-2">
      <Form.Field v-slot="{ componentField }" name="institute.code_postal">
        <Form.Item>
          <Form.Label>
            <small>{{ $t("label.zip") }}</small>
          </Form.Label>
          <Form.Control>
            <Form.Input
              required
              type="tel"
              auto-correct="off"
              v-bind="componentField"
              :placeholder="$t('placeholder.example', { ex: '75000' })" />
            <Form.Message />
          </Form.Control>
        </Form.Item>
      </Form.Field>

      <Form.Field v-slot="{ componentField }" name="institute.ville">
        <Form.Item>
          <Form.Label>
            <small>{{ $t("label.city") }}</small>
          </Form.Label>
          <Form.Control>
            <Form.Input
              required
              type="text"
              auto-correct="off"
              v-bind="componentField"
              :placeholder="$t('placeholder.example', { ex: 'Paris' })" />
            <Form.Message />
          </Form.Control>
        </Form.Item>
      </Form.Field>
    </div>
  </div>
</template>
