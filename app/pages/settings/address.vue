<script lang="ts" setup>
import InstituteDetailsForm from "@/components/pages/settings/InstituteDetailsForm.vue";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { queryKeys } from "@/lib/constants";
import { instituteInfoSchema } from "@/lib/formSchema";
import { useMutation } from "@tanstack/vue-query";
import { toTypedSchema } from "@vee-validate/valibot";
import * as v from "valibot";
import { useForm } from "vee-validate";

function getValues(values: Partial<CurrentUser> | null = {}) {
  return {
    institute: {
      siret: values?.siret || undefined,
      entreprise: values?.entreprise || undefined,
      adresse: values?.adresse || undefined,
      ville: values?.ville || undefined,
      code_postal: values?.code_postal || undefined,
      type_entreprise: values?.type_entreprise || undefined,
      adresse2: values?.adresse2 || undefined
    }
  } as const;
}

const { currentUser } = useCurrentUser();
const { setValues, values, setFieldError, handleSubmit, isSubmitting, meta } = useForm({
  initialValues: getValues(currentUser.value),
  validationSchema: toTypedSchema(v.object({ institute: instituteInfoSchema }))
});

watch(currentUser, (user) => setValues(getValues(user)));

const { mutateAsync } = useMutation<unknown, Error, unknown>({
  mutationKey: queryKeys.currentUserProfile()
});

const onSubmit = handleSubmit((values) => mutateAsync(values.institute));
</script>

<template>
  <NuxtLayout name="settings">
    <Card.Root as="form" novalidate @submit="onSubmit">
      <Card.Header>
        <Card.Title>{{ $t("page.settings.institute") }}</Card.Title>
        <Card.Description>
          {{ $t("settings.institute.description") }}
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="grid gap-4 w-full">
          <InstituteDetailsForm
            :on-response="
              function (instituteDetails: unknown) {
                if (!!instituteDetails) setValues({ institute: instituteDetails });
                else {
                  setValues({
                    institute: {
                      siret: values.institute?.siret,
                      entreprise: undefined,
                      adresse: undefined,
                      ville: undefined,
                      code_postal: undefined,
                      type_entreprise: undefined,
                      adresse2: undefined
                    }
                  });
                  setFieldError('institute.siret', $t('form.validation.siret'));
                }
              }
            " />
        </div>
      </Card.Content>
      <Card.Footer>
        <Button size="sm" class="ms-auto" :loading="isSubmitting" :disabled="!meta.valid">
          {{ $t("message.update") }}
        </Button>
      </Card.Footer>
    </Card.Root>
  </NuxtLayout>
</template>
