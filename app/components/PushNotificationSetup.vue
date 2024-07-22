<script lang="ts" setup>
import "@/lib/firebase";
import { FirebaseMessaging } from "@capacitor-firebase/messaging";

import { useMutation } from "@tanstack/vue-query";

const { $pwa } = useNuxtApp();
const isInteracted = ref(false);
const { currentUser } = useCurrentUser();
const isPushNotificationSetup = ref(false);

const { mutate: setupPushNotification } = useMutation<any, Error, any>({
  mutationKey: ["push-notification"],
  onSuccess() {
    isPushNotificationSetup.value = true;
  }
});

onMounted(async () => {
  // Request permission to send notifications for iOS
  FirebaseMessaging.requestPermissions();

  // REASON: Can't request for notification permission
  // until user has interacted
  const onInteraction = () => {
    isInteracted.value = true;
    ["click", "keydown", "touchstart"].forEach((eventType) => {
      document.removeEventListener(eventType, onInteraction);
    });
  };

  ["click", "keydown", "touchstart"].forEach((eventType) => {
    document.addEventListener(eventType, onInteraction);
  });

  return () => {
    ["click", "keydown", "mousemove", "touchstart"].forEach((eventType) => {
      document.removeEventListener(eventType, onInteraction);
    });
  };
});

watch([isInteracted, currentUser], ([isInteracted, user]) => {
  if (!isInteracted || !user || isPushNotificationSetup.value) return;
  setupPushNotification({ user: user.id, swRegistration: $pwa?.getSWRegistration() });
});
</script>

<template>
  <div class="contents" />
</template>
