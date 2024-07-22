import type { CustomDirectusTypes, DirectusUsers } from "@/types/directus";
import { useQuery, useQueryClient, type QueryOptions } from "@tanstack/vue-query";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  queryKeys,
  REFRESH_TOKEN_STORAGE_KEY
} from "../lib/constants";

// export const README_FIELDS = [
//   "id",
//   "first_name",
//   "last_name",
//   "email",
//   "avatar",
//   "telephone",
//   "role",
//   "entreprise",
//   "account_type"
// ] as const;

export type CurrentUser = DirectusUsers;

/**
 * function to load current user
 * handles all auth tokens ( auto refresh token if needed )
 **/
export async function getCurrentUser() {
  try {
    const { set } = useDirectusTokens();
    const accessToken = useCookie(ACCESS_TOKEN_STORAGE_KEY);
    const refreshToken = useCookie(REFRESH_TOKEN_STORAGE_KEY);

    const { readMe, user, refresh } = useDirectusAuth<CustomDirectusTypes>({
      staticToken: false,
      authConfig: { autoRefresh: false }
    });

    if (!accessToken.value && !refreshToken.value) return null;

    // set tokens
    set({
      expires: 0,
      expires_at: 0,
      access_token: accessToken.value!,
      refresh_token: refreshToken.value!
    });

    // OPTIMIZE: No need to refresh token
    // if access token is valid
    if (accessToken.value) {
      const response = await readMe();
      if (response) {
        return response as CurrentUser;
      } else {
        accessToken.value = undefined;
      }
    }

    // OPTIMIZE: Only refresh token, if
    // access token is expired, or is invalid
    if (!accessToken.value && refreshToken.value) {
      const response = await refresh({});
      if (response) {
        return user.value as CurrentUser;
      } else {
        refreshToken.value = undefined;
      }
    }

    // no user at this point
    return null;
  } catch (error) {
    console.error("getCurrentUser()", error.toString());
    throw error;
  }
}

type UseCurrentQueryOpts = Omit<
  QueryOptions<
    CurrentUser | null,
    Error,
    CurrentUser | null,
    (typeof queryKeys)["currentUser"]
  >,
  "queryFn" | "queryKey"
>;

export const useCurrentUser = (opts?: UseCurrentQueryOpts) => {
  const { user } = useDirectusAuth();
  const queryClient = useQueryClient();

  const {
    status,
    refetch,
    isLoading,
    data: currentUser
  } = useQuery({
    ...opts,
    queryFn: getCurrentUser,
    refetchOnWindowFocus: true,
    queryKey: queryKeys.currentUser,
    initialData: () => {
      const state = queryClient.getQueryState(queryKeys.currentUser);
      if (!state || Date.now() - state.dataUpdatedAt <= 60 * 1000) {
        return user.value as CurrentUser;
      }
    }
  });

  return { currentUser, status, refetch, isLoading };
};
