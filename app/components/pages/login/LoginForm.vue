<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/fields";
import { Form } from "@/components/ui/form";
import { appConfig } from "@/lib/appConfig";
import { BIOMETRY_MAX_ATTEMPTS, toastKeys } from "@/lib/constants";
import { credentialSchema } from "@/lib/formSchema";
import { cn } from "@/lib/utils";
import type { CustomDirectusTypes } from "@/types/directus";
import { Capacitor } from "@capacitor/core";
import { useMutation } from "@tanstack/vue-query";
import { toTypedSchema } from "@vee-validate/valibot";
import { BiometryType, NativeBiometric } from "capacitor-native-biometric";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

const props = withDefaults(defineProps<{ onLogin?: () => void }>(), {
  onLogin: undefined
});

const { t } = useI18n();
const { $pwa } = useNuxtApp();
const { refetch } = useCurrentUser();
const { login } = useDirectusAuth<CustomDirectusTypes>({
  staticToken: true
});

const { mutateAsync: setupPushNotification } = useMutation<any, Error, any>({
  mutationKey: ["push-notifications"]
});

const { hasCredential, biometricType } = useHasBiometricCredential();

const { handleSubmit, isSubmitting, setErrors, resetForm } = useForm({
  keepValuesOnUnmount: true,
  validationSchema: toTypedSchema(credentialSchema)
});

const loginFn = async (values: { email: string; password: string }) => {
  toast.info(t("message.loading"), { id: toastKeys.AUTH });

  return login(values.email, values.password, { readMe: false })
    .then(async () => {
      const user = await refetch();

      if (user.data) {
        resetForm();
        await setupPushNotification({
          user: user.data.id,
          swRegistration: $pwa?.getSWRegistration()
        });

        toast.success(t("message.success.connect", { name: user.data.first_name }), {
          id: toastKeys.AUTH
        });
        await props.onLogin?.();
      } else {
        toast.error(t("message.error.connect"), { id: toastKeys.AUTH });
      }
    })
    .catch((err) => {
      console.error("loginFn()", err.message);

      if (err.response?.status === 400 || err.response?.status === 401) {
        return setErrors({ email: t("form.validation.invalid.credentials") });
      }

      toast.error(t("message.error.connect"), { id: toastKeys.AUTH });
    });
};

const onSubmit = handleSubmit(loginFn);

const handleBiometricLogin = async () => {
  try {
    await NativeBiometric.verifyIdentity({
      reason: "Login using biometrics",
      title: "Login",
      description: "Use your biometrics to login to your omnip account...",
      maxAttempts: BIOMETRY_MAX_ATTEMPTS
    });

    const credential = await NativeBiometric.getCredentials({
      server: appConfig.appId
    });

    isSubmitting.value = true;
    await loginFn({ email: credential.username, password: credential.password });
  } catch (err) {
    console.error("<LoginForm /> handleBiometricLogin()", err.message);
  } finally {
    resetForm();
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col gap-6">
    <form class="space-y-6" @submit="onSubmit">
      <Form.Field v-slot="{ componentField }" name="email">
        <Form.Item>
          <Form.Label>{{ $t("label.mail") }}</Form.Label>
          <Form.Control>
            <Form.Input
              type="email"
              autocorrect="off"
              autocomplete="off"
              v-bind="componentField"
              :placeholder="$t('placeholder.example', { ex: 'chewbacca@omnip.eu' })" />
            <Form.Message />
          </Form.Control>
        </Form.Item>
      </Form.Field>

      <Form.Field v-slot="{ componentField }" name="password">
        <Form.Item class="relative">
          <div class="flex items-center">
            <Form.Label>{{ $t("label.password") }}</Form.Label>
            <button
              type="button"
              class="ms-auto text-sm hover:text-primary hover:underline">
              {{ $t("message.forgotpassword") }}
            </button>
          </div>

          <Form.Control class="flex gap-2">
            <PasswordField v-bind="componentField" autocomplete="off" />
          </Form.Control>
          <Form.Message />
        </Form.Item>
      </Form.Field>

      <div class="flex gap-2">
        <Button class="px-6 w-full" :loading="isSubmitting">
          {{ $t("page.login") }}
        </Button>

        <template v-if="hasCredential">
          <Button
            type="button"
            :no-ring="true"
            class="flex-shrink-0 bg-primary/5 border border-primary text-primary hover:bg-primary/20"
            :disabled="isSubmitting"
            @click="handleBiometricLogin">
            <div
              :class="
                cn(
                  'text-primary !size-5',
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
        </template>
      </div>
    </form>

    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background px-2 text-foreground/75 font-medium">
          {{ $t("message.orcontinue") }}
        </span>
      </div>
    </div>

    <Button variant="outline" class="space-x-3" :disabled="isSubmitting">
      <div class="i-bi-google text-red-500" />
      <span>Google</span>
    </Button>

    <template v-if="Capacitor.getPlatform() === 'ios'">
      <Button variant="inverted" class="space-x-3" :ring="false" :disabled="isSubmitting">
        <div class="i-bi-apple text-background" />
        <span>Apple</span>
      </Button>
    </template>
  </div>

  <div class="mt-4 px-8 text-center text-sm text-muted-foreground">
    {{ $t("message.click.accept") }}
    <a
      href="#"
      class="inline underline underline-offset-4 hover:text-foreground font-medium">
      {{ $t("message.terms_and_conditions") }}
    </a>
    and
    <a
      href="#"
      class="inline underline underline-offset-4 hover:text-foreground font-medium">
      {{ $t("message.privacy_policy") }}
    </a>
    .
  </div>

  <div class="text-center text-sm text-muted-foreground border-t pt-4 mt-4">
    {{ $t("message.createaccount") }}
    <NuxtLink to="/register" class="text-foreground hover:underline ms-1">
      {{ $t("page.register") }}
    </NuxtLink>
  </div>
</template>
