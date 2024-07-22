<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/valibot";
import * as v from "valibot";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/fields";
import { Form } from "@/components/ui/form";
import { ResponsiveDrawer } from "@/components/ui/responsive-drawer";
import { appConfig } from "@/lib/appConfig";
import { passwordField } from "@/lib/formSchema";
import { cn } from "@/lib/utils";
import { BiometryType, NativeBiometric } from "capacitor-native-biometric";

const { t } = useI18n();
const { login } = useDirectusAuth();
const { currentUser } = useCurrentUser();
const { biometricType, hasCredential, refetch } = useHasBiometricCredential();

const isPasswordValidating = ref(false);
const open = defineModel<boolean>("open", { default: false });
const props = defineProps<{
  showBiometricOption?: boolean;
  onVerified?: (pasword: string) => void;
}>();

const { handleSubmit, setErrors, isSubmitting, meta, resetForm } = useForm({
  validationSchema: toTypedSchema(v.object({ password: passwordField }))
});

const verifyPasswordFn = async (values: { password: string }) => {
  if (!currentUser.value) return;

  isPasswordValidating.value = true;
  toast.info(t("message.check.loading"), { id: "verify-password" });

  // try to login with entered password [ As there is no direct way to validate password ]
  try {
    await login(currentUser.value.email!, values.password, { options: { mode: "json" } });
    toast.success("Password verified!", { id: "verify-password" });
    open.value = false;
    resetForm();
    await props.onVerified?.(values.password);
  } catch (err) {
    if (err.response?.status === 400 || err.response?.status === 401) {
      setErrors({ password: t("form.validation.invalid.password") });
    } else {
      toast.error(t("message.oops"), { id: "verify-password" });
      console.error("<VerifyPasswordDialog /> verifyPasswordFn()", err.message);
    }
  } finally {
    isPasswordValidating.value = false;
  }
};

const handlePasswordVerify = handleSubmit(verifyPasswordFn);

const verifyWithBiometric = async () => {
  if (!hasCredential) return;

  try {
    const credential = await NativeBiometric.getCredentials({
      server: appConfig.appId
    });

    await verifyPasswordFn({ password: credential.password });
  } catch (err) {
    console.error("<VerifyPasswordDialog /> verifyWithBiometric()", err.message);
  }
};
</script>

<template>
  <ResponsiveDrawer.Root
    v-model:open="open"
    @open-change="(open: boolean) => open && refetch()">
    <ResponsiveDrawer.Content>
      <ResponsiveDrawer.Header>
        <ResponsiveDrawer.Title>Verify your password</ResponsiveDrawer.Title>
        <ResponsiveDrawer.Description>
          To continue, please enter your password so that we could verify that its you.
        </ResponsiveDrawer.Description>
      </ResponsiveDrawer.Header>

      <form @submit="handlePasswordVerify">
        <div class="p-4 md:p-0">
          <Form.Field v-slot="{ componentField }" name="password">
            <Form.Item>
              <Form.Label>{{ $t("label.actual.password") }}</Form.Label>
              <div class="flex gap-2">
                <div class="relative w-full">
                  <PasswordField v-bind="componentField" />
                  <div
                    v-if="isPasswordValidating"
                    class="absolute bg-background size-6 right-2.5 top-2">
                    <div class="i-line-md-loading-alt-loop !size-6" />
                  </div>
                </div>

                <Button
                  v-if="hasCredential"
                  type="button"
                  variant="secondary"
                  class="w-full md:w-auto"
                  :disabled="isSubmitting"
                  @click="verifyWithBiometric">
                  <div
                    :class="
                      cn(
                        'i-lucide-fingerprint !size-5',
                        (biometricType === BiometryType.FACE_ID ||
                          biometricType === BiometryType.FACE_AUTHENTICATION) &&
                          'i-lucide-scan-face',

                        biometricType === BiometryType.IRIS_AUTHENTICATION &&
                          'i-lucide-scan-eye',

                        (biometricType === BiometryType.FINGERPRINT ||
                          biometricType === BiometryType.TOUCH_ID ||
                          biometricType === BiometryType.MULTIPLE) &&
                          'i-lucide-fingerprint'
                      )
                    " />
                </Button>
              </div>
            </Form.Item>
            <Form.Message />
          </Form.Field>
        </div>

        <ResponsiveDrawer.Footer class="md:ms-auto">
          <ResponsiveDrawer.Close as-child>
            <Button variant="outline" size="sm">{{ $t("message.cancel") }}</Button>
          </ResponsiveDrawer.Close>

          <Button size="sm" type="submit" :loading="isSubmitting" :disabled="!meta.valid">
            Verify
          </Button>
        </ResponsiveDrawer.Footer>
      </form>
    </ResponsiveDrawer.Content>
  </ResponsiveDrawer.Root>
</template>
