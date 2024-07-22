import { getCurrentUser } from "@/composables/useCurrentUser";
import { queryKeys } from "@/lib/constants";
import { useQueryClient } from "@tanstack/vue-query";
import type { TypedPathParameter } from "@typed-router/__paths";
import type { RoutesNamesList } from "@typed-router/__routes";

const NON_PROTECTED_ROUTES = ["/login", "/register"];

export default defineNuxtRouteMiddleware(async function (to, from) {
  const queryClient = useQueryClient();
  const previousRoute = usePreviousRoute();

  if (from.name !== "404") {
    if (NON_PROTECTED_ROUTES.includes(from.path)) {
      previousRoute.value = "/";
    } else {
      previousRoute.value = from.fullPath as TypedPathParameter<RoutesNamesList>;
    }
  }

  const currentUser = await queryClient.fetchQuery({
    queryKey: queryKeys.currentUser,
    queryFn: getCurrentUser
  });

  // still no user, redirect to login page
  if (!currentUser && !NON_PROTECTED_ROUTES.includes(to.path)) {
    return navigateTo(encodeURI(`/login?error=auth`), {
      replace: true,
      redirectCode: 401
    });
  }
});
