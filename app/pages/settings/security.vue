<script lang="ts" setup>
import PasswordUpdateForm from "@/components/pages/settings/PasswordUpdateForm.vue";
import VerifyPasswordDialog from "@/components/shared/VerifyPasswordDialog.vue";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResponsiveDrawer } from "@/components/ui/responsive-drawer";
import { appConfig } from "@/lib/appConfig";
import { cn } from "@/lib/utils";
import { createReusableTemplate } from "@vueuse/core";
import { BiometryType, NativeBiometric } from "capacitor-native-biometric";
import { toast } from "vue-sonner";

const { t } = useI18n();
const { currentUser } = useCurrentUser();
const passwordVerifyModalOpened = ref(false);
const { biometricType, hasCredential, refetch } = useHasBiometricCredential();
const [UseBiometricIconTemplate, BiometricIcon] = createReusableTemplate();

const resetBiometric = () => {
  toast.info(t("message.loading"), { id: "biometric" });
  NativeBiometric.deleteCredentials({ server: appConfig.appId })
    .then(async () => {
      await refetch();
      toast.success("Biometric disabled successfully!", { id: "biometric" });
    })
    .catch((err) => {
      console.error("resetBiometric():", err);
      toast.error(t("message.oops"), { id: "biometric" });
    });
};

const initBiometricSetup = async () => {
  if (!currentUser.value) return;
  // else proceed to setup biometric
  if (biometricType.value === BiometryType.NONE) return;

  return NativeBiometric.verifyIdentity({
    reason: "Setup biometric for login.",
    title: "Setup biometric",
    maxAttempts: 3
  })
    .then(() => (passwordVerifyModalOpened.value = true))
    .catch(() => undefined);
};

const setupBiometric = async (password: string) => {
  if (!currentUser.value?.email) return;

  await NativeBiometric.setCredentials({
    password,
    server: appConfig.appId,
    username: currentUser.value.email
  })
    .then(async () => {
      await refetch();
      toast.success("Biometric setup successfully!", { id: "biometric" });
    })
    .catch((err) => {
      console.error("setupBiometric():", err);
      toast.error(t("message.oops"), { id: "biometric" });
    });
};
</script>

<template>
  <NuxtLayout name="settings">
    <VerifyPasswordDialog
      v-model:open="passwordVerifyModalOpened"
      :on-verified="(p: string) => setupBiometric(p)" />

    <div class="grid gap-4 w-full">
      <PasswordUpdateForm />

      <UseBiometricIconTemplate>
        <div
          :class="
            cn(
              'ms-4 i-lucide-fingerprint !size-5',
              (biometricType === BiometryType.FACE_ID ||
                biometricType === BiometryType.FACE_AUTHENTICATION) &&
                'i-lucide-scan-face',

              biometricType === BiometryType.IRIS_AUTHENTICATION && 'i-lucide-scan-eye',

              (biometricType === BiometryType.FINGERPRINT ||
                biometricType === BiometryType.TOUCH_ID ||
                biometricType === BiometryType.MULTIPLE) &&
                'i-lucide-fingerprint'
            )
          " />
      </UseBiometricIconTemplate>

      <Card.Root v-if="biometricType !== BiometryType.NONE">
        <Card.Header>
          <Card.Title>Biometric login</Card.Title>
          <Card.Description>
            Login to your account with biometric for ease...
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <template v-if="!hasCredential">
            <Button
              type="button"
              variant="secondary"
              class="w-full md:w-auto"
              @click="initBiometricSetup">
              <span> Enable biometric </span>
              <BiometricIcon />
            </Button>
          </template>
          <template v-else>
            <ResponsiveDrawer.Root>
              <ResponsiveDrawer.Trigger as-child>
                <Button type="button" variant="secondary" class="w-full md:w-auto">
                  <span> Disable biometric </span>
                  <BiometricIcon />
                </Button>
              </ResponsiveDrawer.Trigger>
              <ResponsiveDrawer.Content>
                <ResponsiveDrawer.Header>
                  <ResponsiveDrawer.Title>Are you sure?</ResponsiveDrawer.Title>
                  <ResponsiveDrawer.Description>
                    Do you really want to disable biometric login?
                  </ResponsiveDrawer.Description>
                </ResponsiveDrawer.Header>
                <ResponsiveDrawer.Footer>
                  <ResponsiveDrawer.Close as-child>
                    <Button variant="outline">{{ $t("message.cancel") }}</Button>
                  </ResponsiveDrawer.Close>
                  <Button @click="resetBiometric">{{ $t("message.confirm") }}</Button>
                </ResponsiveDrawer.Footer>
              </ResponsiveDrawer.Content>
            </ResponsiveDrawer.Root>
          </template>
        </Card.Content>
      </Card.Root>
    </div>
  </NuxtLayout>
</template>
