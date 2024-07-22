import { toastKeys } from "@/lib/constants";
import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { toast } from "vue-sonner";

export const useLogout = () => {
  const { t } = useI18n();
  const { $pwa } = useNuxtApp();
  const queryClient = useQueryClient();
  const { user, logout } = useDirectusAuth();
  const { deleteItems } = useDirectusItems({
    staticToken: true
  });

  return useMutation({
    mutationFn: async () => {
      if ((await FirebaseMessaging.checkPermissions()).receive === "granted") {
        const { token } = await FirebaseMessaging.getToken({
          vapidKey: process.env.NUXT_PUBLIC_VAPID_KEY,
          serviceWorkerRegistration: $pwa?.getSWRegistration()
        });

        if (token) {
          await deleteItems("push_notifications", { filter: { token: { _eq: token } } });
        }

        await FirebaseMessaging.deleteToken();
      }

      await logout();
    },
    async onSettled(_data, error) {
      if (error) {
        toast.info(t("message.oops"), { id: toastKeys.AUTH });
      } else {
        user.value = undefined;
        await queryClient.resetQueries();
        await navigateTo("/login?redirect=true");
      }
    }
  });
};
