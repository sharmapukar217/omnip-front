<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserEmailField } from "@/components/ui/fields";
import { Form } from "@/components/ui/form";
import { queryKeys } from "@/lib/constants";
import { updateProfileSchema } from "@/lib/formSchema";
import { useMutation } from "@tanstack/vue-query";
import { toTypedSchema } from "@vee-validate/valibot";
import { useForm } from "vee-validate";

const { currentUser } = useCurrentUser();
function getValues(values: Record<string, any> | null = {}) {
  return {
    first_name: values?.first_name,
    last_name: values?.last_name,
    email: values?.email,
    telephone: values?.telephone
  };
}

const { mutate, isPending } = useMutation<any, Error, any>({
  mutationKey: queryKeys.currentUserProfile()
});

/** functions and handlers */
const { handleSubmit, meta, setValues, setErrors } = useForm({
  initialValues: getValues(currentUser.value),
  validationSchema: toTypedSchema(updateProfileSchema)
});

watch(currentUser, (currentUser) => {
  if (!currentUser || currentUser === null) return;
  setValues(getValues(currentUser));
});

const handleprofileFormSubmit = handleSubmit((values) => mutate(values));
</script>

<template>
  <Card.Root as="form" @submit="handleprofileFormSubmit">
    <Card.Header>
      <Card.Title>{{ $t("title.profile") }}</Card.Title>
      <Card.Description class="text-foreground">
        {{ $t("description.profil") }}
      </Card.Description>
    </Card.Header>

    <Card.Content class="space-y-4">
      <div class="grid gap-4 lg:grid-cols-2">
        <Form.Field v-slot="{ componentField }" name="first_name">
          <Form.Item>
            <Form.Label>{{ $t("label.name") }}</Form.Label>
            <Form.Control>
              <Form.Input
                required
                auto-correct="off"
                v-bind="componentField"
                :placeholder="$t('placeholder.example', { ex: 'John' })" />
              <Form.Message />
            </Form.Control>
          </Form.Item>
        </Form.Field>

        <Form.Field v-slot="{ componentField }" name="last_name">
          <Form.Item>
            <Form.Label>{{ $t("label.lastname") }}</Form.Label>
            <Form.Control>
              <Form.Input
                required
                auto-correct="off"
                v-bind="componentField"
                :placeholder="$t('placeholder.example', { ex: 'Doe' })" />
              <Form.Message />
            </Form.Control>
          </Form.Item>
        </Form.Field>
      </div>

      <Form.Field v-slot="{ componentField }" name="email">
        <Form.Item>
          <Form.Label>{{ $t("label.mail") }}</Form.Label>
          <Form.Control>
            <UserEmailField
              v-bind="componentField"
              :check-for-unique-email="true"
              :on-response="
                (count) => {
                  if (count) setErrors({ email: $t('form.validation.duplicated.email') });
                }
              " />
            <Form.Message />
          </Form.Control>
        </Form.Item>
      </Form.Field>

      <Form.Field v-slot="{ componentField }" name="telephone">
        <Form.Item>
          <Form.Label>
            {{ $t("label.phone") }}
            <small>{{ $t("label.optional") }}</small>
          </Form.Label>
          <Form.Control>
            <Form.Input
              auto-correct="off"
              v-bind="componentField"
              :placeholder="$t('placeholder.example', { ex: '0612121212' })" />
            <Form.Message />
          </Form.Control>
        </Form.Item>
      </Form.Field>
    </Card.Content>

    <Card.Footer>
      <small class="text-xs md:text-sm w-9/12">
        {{ $t("form.validation.indication.email") }}
      </small>
      <Button
        size="sm"
        class="ms-auto lg:me-2 py-1.5"
        :loading="isPending"
        :disabled="!meta.valid">
        {{ $t("message.update") }}
      </Button>
    </Card.Footer>
  </Card.Root>
</template>
