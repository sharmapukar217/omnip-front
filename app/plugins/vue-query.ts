import { Capacitor } from "@capacitor/core";
import { broadcastQueryClient } from "@tanstack/query-broadcast-client-experimental";
import { persistQueryClient } from "@tanstack/query-persist-client-core";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import type { DehydratedState } from "@tanstack/vue-query";
import { QueryClient, VueQueryPlugin, dehydrate, hydrate } from "@tanstack/vue-query";

export default defineNuxtPlugin(async (nuxt) => {
  const vueQueryState = useState<DehydratedState | null>("vue-query");

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 1000 * 60,
        enabled: !import.meta.env.SSR,

        refetchOnMount: false,
        refetchOnWindowFocus: true
      }
    }
  });

  nuxt.vueApp.use(VueQueryPlugin, {
    queryClient,
    clientPersister(client) {
      return persistQueryClient({
        queryClient: client,
        persister: createSyncStoragePersister({
          key: "VUE_QUERY_STORAGE",
          storage: import.meta.env.SSR ? undefined : localStorage
        })
      });
    }
  });

  if (import.meta.server) {
    nuxt.hooks.hook("app:rendered", () => {
      vueQueryState.value = dehydrate(queryClient);
    });
  }

  if (import.meta.client) {
    nuxt.hooks.hook("app:created", () => {
      hydrate(queryClient, vueQueryState.value);

      if (Capacitor.getPlatform() === "web") {
        broadcastQueryClient({ queryClient, options: { type: "localstorage" } });
      }
    });
  }
});
