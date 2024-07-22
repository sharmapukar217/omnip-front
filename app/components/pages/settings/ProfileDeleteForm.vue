<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PasswordField } from "@/components/ui/fields";
import { Form } from "@/components/ui/form";
import { ResponsiveDrawer } from "@/components/ui/responsive-drawer";
import { appConfig } from "@/lib/appConfig";
import { toastKeys } from "@/lib/constants";
import { accountDeletionSchema } from "@/lib/formSchema";
import { useQueryClient } from "@tanstack/vue-query";
import { toTypedSchema } from "@vee-validate/valibot";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

const { t } = useI18n();

const { currentUser } = useCurrentUser();
const { deleteUser } = useDirectusUsers();
const { login, user, logout } = useDirectusAuth();

const queryClient = useQueryClient();
const accountDeleteAlertOpened = ref(false);

const { handleSubmit, isSubmitting, meta, setErrors } = useForm({
  validationSchema: toTypedSchema(accountDeletionSchema)
});

const onAccountDeleteSubmit = handleSubmit(function (data) {
  if (!currentUser.value?.id) return;
  toast.info(t("message.check.loading"));

  return login(currentUser.value.email!, data.password)
    .then(async () => {
      toast.info(t("message.user.deleting.loading"), { id: toastKeys.AUTH });
      await deleteUser(currentUser.value!.id!);
      await logout();

      user.value = undefined;
      await navigateTo("/login");
      await queryClient.cancelQueries();
      await queryClient.resetQueries();

      await navigateTo("/auth/login");
      accountDeleteAlertOpened.value = false;
      toast.success(t("message.success.delete.account"), { id: toastKeys.AUTH });
    })
    .catch((err) => {
      if ([400, 401].includes(err.response?.status)) {
        return setErrors({ password: t("form.validation.invalid.password") });
      }

      toast.error(t("message.error.delete.account"), { id: toastKeys.AUTH });
    });
});
</script>

<template>
  <Card.Root class="border-destructive/50">
    <Card.Header>
      <Card.Title>{{ $t("message.delete.accompte") }}</Card.Title>
      <Card.Description class="text-foreground text-pretty text-xs">
        {{ $t("description.delete.account") }}
        <span class="hover:underline font-medium md:font-semibold">
          {{ appConfig.title }}.
        </span>
        {{ $t("description.indication.delete.account") }}
      </Card.Description>
    </Card.Header>

    <Card.Footer class="border-destructive/30 bg-destructive/5">
      <ResponsiveDrawer.Root>
        <ResponsiveDrawer.Trigger as-child>
          <Button variant="destructive" class="ms-auto">
            {{ $t("title.delete.account") }}
          </Button>
        </ResponsiveDrawer.Trigger>
        <ResponsiveDrawer.Content>
          <ResponsiveDrawer.Header>
            <ResponsiveDrawer.Title>
              {{ $t("description.are_you_sure") }}
            </ResponsiveDrawer.Title>
            <ResponsiveDrawer.Description>
              <div class="space-y-4">
                <div>
                  {{ appConfig.title }}
                  {{ $t("description.indication.delete.account.sure") }}
                </div>

                <small
                  class="text-xs font-medium md:text-sm bg-destructive/10 text-destructive rounded-md py-1.5 px-2.5 border border-destructive/15">
                  {{ $t("message.not.reversible") }}
                </small>
              </div>
            </ResponsiveDrawer.Description>
          </ResponsiveDrawer.Header>

          <form autoComplete="off" class="pt-2" @submit="onAccountDeleteSubmit">
            <div class="p-4 md:p-0 grid gap-4">
              <Form.Field v-slot="{ componentField }" name="password">
                <Form.Item>
                  <Form.Label class="text-muted-foreground">
                    {{ $t("form.validation.require.email") }}
                  </Form.Label>
                  <Form.Control>
                    <PasswordField v-bind="componentField" />
                    <Form.Message />
                  </Form.Control>
                </Form.Item>
              </Form.Field>

              <Form.Field v-slot="{ componentField }" name="verify">
                <Form.Item>
                  <Form.Label class="text-muted-foreground">
                    {{ $t("form.validation.indication.delete.account") }}
                  </Form.Label>
                  <Form.Control>
                    <Form.Input v-bind="componentField" />
                    <Form.Message />
                  </Form.Control>
                </Form.Item>
              </Form.Field>
            </div>

            <ResponsiveDrawer.Footer class="border-t md:border-t-0 md:mt-4">
              <ResponsiveDrawer.Close as-child>
                <Button size="sm" variant="outline">{{ $t("message.cancel") }} </Button>
              </ResponsiveDrawer.Close>
              <Button
                size="sm"
                variant="destructive"
                class="w-full md:w-auto"
                :loading="isSubmitting"
                :disabled="!meta.valid">
                {{ $t("title.delete.account") }}
              </Button>
            </ResponsiveDrawer.Footer>
          </form>
        </ResponsiveDrawer.Content>
      </ResponsiveDrawer.Root>
    </Card.Footer>
  </Card.Root>
</template>
