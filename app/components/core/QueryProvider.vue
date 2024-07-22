<script lang="ts" setup>
import { ROLE, VUE_QUERY_STORAGE_KEY } from "@/lib/constants";
import { setupOfflineMutations } from "@/lib/offlineMutation";
import type {
  TanstackQueryDevtools,
  TanstackQueryDevtoolsConfig
} from "@tanstack/query-devtools";
import {
  persistQueryClientRestore,
  persistQueryClientSubscribe,
  type PersistedQueryClientRestoreOptions
} from "@tanstack/query-persist-client-core";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { onlineManager, useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();
const { currentUser } = useCurrentUser();
let devtool: TanstackQueryDevtools | undefined = undefined;

// put it on top, DO NOT MOVE
setupOfflineMutations(queryClient);

async function toggleDevTool(opts?: TanstackQueryDevtoolsConfig) {
  if (currentUser.value?.role !== ROLE.admin) return;

  if (!devtool) {
    try {
      const { TanstackQueryDevtools } = await import("@tanstack/query-devtools");
      devtool = new TanstackQueryDevtools({
        version: "5",
        onlineManager,
        client: queryClient,
        queryFlavor: "Vue Query",
        position: opts?.position || "bottom",
        buttonPosition: opts?.buttonPosition || "top-left"
      });
      devtool.mount(document.getElementById("tsqd-parent-container")!);
    } finally {
      // DONE
    }
  }

  devtool.unmount();
  devtool = undefined;
}

onMounted(async () => {
  window.queryDevtool = toggleDevTool;

  const opts: PersistedQueryClientRestoreOptions = {
    queryClient,
    persister: createSyncStoragePersister({
      storage: localStorage,
      key: VUE_QUERY_STORAGE_KEY
    })
  };

  queryClient.isRestoring.value = true;

  try {
    await persistQueryClientRestore(opts);
    await queryClient.resumePausedMutations();
    await queryClient.invalidateQueries();
  } finally {
    queryClient.isRestoring.value = false;
  }

  return persistQueryClientSubscribe(opts);
});
</script>

<template>
  <slot />
  <div id="tsqd-parent-container" class="z-100" />
</template>
