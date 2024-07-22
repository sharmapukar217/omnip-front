<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/valibot";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

import PasswordResetForm from "@/components/shared/PasswordResetModal.vue";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PasswordField } from "@/components/ui/fields";
import { Form } from "@/components/ui/form";
import { passwordUpdateSchema } from "@/lib/formSchema";

const { t } = useI18n();

const { login } = useDirectusAuth();
const { updateMe } = useDirectusUsers();
const { currentUser } = useCurrentUser();

const isPasswordValidating = ref(false);
const passwordResetDialogOpened = ref(false);

const { handleSubmit, isSubmitting, meta, resetForm, setErrors } = useForm({
  validationSchema: toTypedSchema(passwordUpdateSchema)
});

const onSubmit = handleSubmit(async function (data) {
  if (!currentUser.value?.id) return;

  try {
    isPasswordValidating.value = true;
    toast.info(t("message.check.loading"), {
      id: "update-password"
    });

    // try to login with entered password [ As there is no direct way to validate password ]
    await login(currentUser.value.email!, data.currentPassword, {
      options: { mode: "json" }
    });

    toast.info(t("message.loading.changepassword"), {
      id: "update-password"
    });

    // if password matches, update user's password only
    await updateMe({ password: data.newPassword }, {});

    resetForm();
    toast.success(t("message.success.changepassword"), { id: "update-password" });
  } catch (err) {
    if (err.response?.status === 400 || err.response?.status === 401) {
      setErrors({ currentPassword: t("form.validation.invalid.password") });
    } else {
      toast.error(t("message.error.changepassword"), {
        id: "update-password"
      });
    }
  } finally {
    isPasswordValidating.value = false;
  }
});
</script>

<template>
  <PasswordResetForm v-model:open="passwordResetDialogOpened" />

  <Card.Root>
    <Card.Header>
      <Card.Title>{{ $t("title.passwordreset") }}</Card.Title>
      <div class="pt-4">
        <Card.Description class="text-foreground">
          {{ $t("title.avatar") }}
        </Card.Description>
        <Card.Description>
          {{ $t("description.avatar") }}
        </Card.Description>
      </div>
    </Card.Header>
    <Card.Content>
      <form class="grid gap-4" @submit="onSubmit">
        <input type="hidden" name="username" :value="currentUser?.email" />
        <Form.Field v-slot="{ componentField }" name="currentPassword">
          <Form.Item class="relative">
            <Form.Label>{{ $t("label.actual.password") }}</Form.Label>
            <Form.Control>
              <PasswordField v-bind="componentField" autocomplete="off" />
              <div
                v-if="isPasswordValidating"
                class="absolute bg-background size-6 right-2 top-8">
                <div class="i-line-md-loading-alt-loop !size-6" />
              </div>
              <Form.Message />
            </Form.Control>
          </Form.Item>
        </Form.Field>

        <Form.Field v-slot="{ componentField }" name="newPassword">
          <Form.Item>
            <Form.Label>{{ $t("label.new.password") }}</Form.Label>
            <Form.Control>
              <PasswordField v-bind="componentField" autocomplete="off" />
              <Form.Message />
            </Form.Control>
          </Form.Item>
        </Form.Field>

        <small class="text-muted-foreground">
          {{ $t("form.indication.min") }}
        </small>

        <div class="inline-flex gap-4">
          <Button :loading="isSubmitting" :disabled="!meta.valid">
            {{ $t("message.update") }}
          </Button>

          <Button
            type="button"
            variant="link"
            class="text-muted-foreground hover:text-foreground"
            @click="() => (passwordResetDialogOpened = true)">
            {{ $t("message.forgotpassword") }}
          </Button>
        </div>
      </form>
    </Card.Content>
  </Card.Root>
</template>
