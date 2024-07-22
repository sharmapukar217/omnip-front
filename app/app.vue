<script lang="ts" setup>
import "@/lib/firebase";

import Toaster from "@/components/ui/Toaster.vue";
import { appColors } from "@/lib/appConfig";
import { setupOfflineMutations } from "@/lib/offlineMutations";
import { useQueryClient } from "@tanstack/vue-query";
import { watchImmediate } from "@vueuse/core";
import { ConfigProvider } from "radix-vue";
import { configure } from "vee-validate";
import PushNotificationSetup from "./components/PushNotificationSetup.vue";

const colorMode = useColorMode();
const useIdFunction = () => useId();

setupOfflineMutations(useQueryClient());
configure({ bails: false, validateOnBlur: false });
watchImmediate(colorMode, () => {
  if (import.meta.env.SSR) return;

  const metaThemeColor = document.querySelector("meta[name='theme-color']");
  metaThemeColor?.setAttribute(
    "content",
    `hsl(${appColors[colorMode.value].background})`
  );
});
</script>

<template>
  <ConfigProvider :use-id="useIdFunction">
    <NuxtPwaAssets />
    <ClientOnly>
      <PushNotificationSetup />
    </ClientOnly>

    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />
    <Toaster />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ConfigProvider>
</template>
