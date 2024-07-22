<script lang="ts" setup>
import Redirect from "@/components/core/Redirect.vue";
import { LoginForm, LoginFormSkeleton } from "@/components/pages/login";
import { queryKeys, toastKeys } from "@/lib/constants";
import { useQueryClient } from "@tanstack/vue-query";
import { toast } from "vue-sonner";

const { t } = useI18n();
const route = useRoute();
const previousRoute = usePreviousRoute();
const { currentUser, isLoading, status } = useCurrentUser();

const handleLoginSuccess = async () => {
  await navigateTo(previousRoute.value);
};

watch([isLoading, currentUser, () => route.query], ([isLoading, currentUser, query]) => {
  if (currentUser) handleLoginSuccess();
  if (isLoading || query?.redirect === "false") return;

  if (query?.error === "auth") {
    toast.error(t("message.error.login_required"), { id: toastKeys.AUTH });
  }
});

definePageMeta({
  middleware: [
    async function (_to, from) {
      const queryClient = useQueryClient();
      if (from.query.redirect === "false") return;

      const currentUser = await queryClient.fetchQuery({
        queryKey: queryKeys.currentUser,
        queryFn: getCurrentUser
      });

      if (currentUser) {
        return await navigateTo(usePreviousRoute().value);
      }
    }
  ]
});
</script>

<template>
  <div class="flex flex-col w-full min-h-[calc(100vh-58px)] md:min-h-[calc(100vh-114px)]">
    <div class="m-auto flex w-full flex-col justify-center sm:w-[550px] container py-10">
      <!-- show skeleton here -->
      <LoginFormSkeleton v-if="status === 'pending'" />

      <!-- login form -->
      <div v-else-if="!currentUser" class="md:px-4 space-y-6">
        <div class="flex flex-col space-y-2">
          <h1 class="text-2xl font-semibold tracking-tight">
            {{ $t("title.login") }}
          </h1>
          <p class="text-sm lg:text-base text-muted-foreground">
            {{ $t("description.login") }}
          </p>
        </div>

        <LoginForm :on-login="handleLoginSuccess" />
      </div>

      <Redirect v-else :to="previousRoute" />
    </div>
  </div>
</template>
