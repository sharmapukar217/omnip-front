<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ResponsiveDrawer } from "@/components/ui/responsive-drawer";
import { toastKeys } from "@/lib/constants";
import { emailField } from "@/lib/formSchema";
import { toTypedSchema } from "@vee-validate/valibot";
import * as v from "valibot";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

const { t } = useI18n();
const { passwordRequest } = useDirectusAuth({});
const { readUsers } = useDirectusUsers({ staticToken: true });

const open = defineModel<boolean>("open", { default: false });

const { handleSubmit, setErrors, meta, isSubmitting } = useForm({
  validationSchema: toTypedSchema(v.object({ email: emailField }))
});

const onSubmit = handleSubmit(function (data) {
  toast.info(t("message.loading"), { id: toastKeys.AUTH });

  return readUsers({ fields: [], filter: { email: { _eq: data.email } } })
    .then(async (response) => {
      if (!response.length) return setErrors({ email: t("message.emailnotfound") });

      await passwordRequest(data.email, `${location.origin}/settings/password/reset`);
      toast.success(t("message.emailreset"), { id: toastKeys.AUTH });
      open.value = false;
    })
    .catch((err) => {
      toast.error(t("message.oops"), { id: toastKeys.AUTH });
      console.error("<PasswordResetModal /> onSubmit()", err.message);
    });
});
</script>

<template>
  <ResponsiveDrawer.Root v-model:open="open">
    <ResponsiveDrawer.Content>
      <ResponsiveDrawer.Header class="p-4 md:p-0">
        <ResponsiveDrawer.Title>{{ $t("title.passwordreset") }}</ResponsiveDrawer.Title>
        <ResponsiveDrawer.Description>
          {{ $t("description.passwordreset") }}
        </ResponsiveDrawer.Description>
      </ResponsiveDrawer.Header>
      <form class="grid gap-4 p-4 md:p-0" data-vaul-no-drag @submit="onSubmit">
        <Form.Field v-slot="{ componentField }" name="email">
          <Form.Item>
            <Form.Label>{{ $t("label.mail") }}</Form.Label>
            <Form.Control>
              <Form.Input
                type="email"
                auto-correct="off"
                v-bind="componentField"
                :placeholder="$t('placeholder.example', { ex: 'chewbacca@omnip.eu' })" />
              <Form.Message />
            </Form.Control>
          </Form.Item>
        </Form.Field>

        <ResponsiveDrawer.Footer class="md:ms-auto p-0">
          <ResponsiveDrawer.Close as-child>
            <Button size="sm" variant="outline" :disabled="isSubmitting">
              {{ $t("message.cancel") }}
            </Button>
          </ResponsiveDrawer.Close>
          <Button class="capitalize" :loading="isSubmitting" :disabled="!meta.valid">
            {{ $t("message.reset") }}
          </Button>
        </ResponsiveDrawer.Footer>
      </form>
    </ResponsiveDrawer.Content>
  </ResponsiveDrawer.Root>
</template>
