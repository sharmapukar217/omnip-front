import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import type { QueryClient } from "@tanstack/vue-query";
import { toast } from "vue-sonner";
import { queryKeys, toastKeys } from "./constants";

export const setupOfflineMutations = (queryClient: QueryClient) => {
  const { t } = useI18n();
  const { updateMe } = useDirectusUsers();
  const { readItems, updateItem, createItem } = useDirectusItems<any>({
    staticToken: true
  });

  // Offline support for updating current user
  queryClient.setMutationDefaults(queryKeys.currentUserProfile(), {
    retry: 1,
    throwOnError: false,
    networkMode: "offlineFirst",

    mutationFn: async (variables) => {
      return await updateMe(variables, {});
    },
    onMutate(variables) {
      queryClient.cancelQueries({ queryKey: queryKeys.currentUser });

      const currentUser = queryClient.getQueryData(queryKeys.currentUser);

      queryClient.setQueryData(queryKeys.currentUser, (old: CurrentUser) => ({
        ...old,
        ...variables
      }));

      return { currentUser };
    },
    onSettled(_data, error, _variables, context) {
      if (error) {
        toast.info(t("message.oops"), { id: toastKeys.PROFILE });
        queryClient.setQueryData(queryKeys.currentUser, () => context.currentUser);
      } else {
        toast.success(t("message.success.update.profile"), { id: toastKeys.PROFILE });
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
    }
  });

  queryClient.setMutationDefaults(["push-notification"], {
    retry: true,
    async mutationFn({ user, swRegistration }: any) {
      let permission = await FirebaseMessaging.checkPermissions();

      if (permission.receive === "prompt") {
        permission = await FirebaseMessaging.requestPermissions();
      }

      if (permission.receive !== "granted") return;

      const { token } = await FirebaseMessaging.getToken({
        serviceWorkerRegistration: swRegistration,
        vapidKey: import.meta.env.NUXT_PUBLIC_VAPID_KEY
      });

      // @ts-expect-error I'll fix ts on code cleanup :-)
      const savedToken = await readItems("push_notifications", {
        filter: { token: { _eq: token } },
        fields: ["id", "user.id"]
      });

      if (!savedToken?.length) {
        return await createItem("push_notifications", { user, token });
      }

      if (savedToken?.[0] && savedToken[0].user?.id !== user) {
        await updateItem("push_notifications", savedToken[0].id, { user });
      }

      console.info("done setting up push notification token.");
    }
  });
};
