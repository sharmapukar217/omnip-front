<script lang="ts" setup>
import HireRequestToast from "@/components/HireRequestToast.vue";
import { Button } from "@/components/ui/button";
import { pick } from "@/lib/utils";
import { incomingHireRequests } from "@/store";
import type { CustomDirectusTypes } from "@/types/direcus";

const socket = useSocket();
const { user } = useDirectusAuth();

const { readItems } = useDirectusItems<CustomDirectusTypes>({ staticToken: true });

type RequestData = {
  id: string;
  createdAt: string;
};
const { data: requests, pending } = useAsyncData(async () => {
  const userId = user.value?.id;
  if (!userId) return [];

  const requests = await readItems("hire_requests", {
    fields: [
      "id",
      // @ts-expect-error just random warns
      "sent_by.id",
      // @ts-expect-error just random warns
      "sent_by.first_name",
      // @ts-expect-error just random warns
      "sent_by.last_name",
      // @ts-expect-error just random warns
      "sent_b                             y.avatar",
      // @ts-expect-error just random warns
      "sent_by.entreprise",
      "created_at"
    ],
    filter: {
      // @ts-expect-error just random warns
      requested_users: { _in: [userId] },
      // @ts-expect-error just random warns
      created_at: { _gt: "$NOW(-3 minutes)" }
    }
  });

  return requests as RequestData[];
});

watch(requests, (d) => {
  if (!d) return;
  incomingHireRequests.value = [...d, ...incomingHireRequests.value];
});

const clearAllRequests = () => {
  incomingHireRequests.value.forEach((req) => {
    socket.emit(req.requestedBy.id, {
      id: req.id,
      event: "hire-request:rejected",
      rejectedBy: pick(user.value!, ["id", "first_name", "last_name"])
    });
  });

  incomingHireRequests.value = [];
};
</script>

<template>
  <div class="container py-4 h-full">
    <!-- skeleton -->
    <template v-if="pending">
      <div class="py-3 w-32 mb-3 rounded-md border bg-muted"></div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- skeleton -->

        <div
          v-for="idx in Math.floor(Math.random() * 5)"
          :key="idx"
          class="bg-background grid border p-4 rounded-md shadow space-y-2">
          <div class="flex gap-2 items-center">
            <div
              class="size-11 rounded-full flex-shrink-0 border bg-muted animate-pulse" />
            <div class="grid w-full gap-2">
              <div
                class="w-1/2 h-3 rounded-md flex-shrink-0 border bg-muted animate-pulse" />
              <div
                class="w-8/12 h-3 rounded flex-shrink-0 border bg-muted animate-pulse" />
            </div>
          </div>
          <div class="flex gap-2">
            <div class="w-12 h-8 rounded flex-shrink-0 bg-muted animate-pulse" />
            <div class="w-full h-8 rounded border bg-muted animate-pulse" />
            <div class="w-full h-8 rounded border bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    </template>

    <!-- actual list -->
    <template v-else-if="incomingHireRequests?.length">
      <div class="flex justify-between">
        <h1 class="font-medium text-md text-foreground/80">{{ $t("requests.hire") }}</h1>
        <Button
          size="sm"
          type="button"
          variant="link"
          class="text-muted-foreground hover:text-foreground"
          @click="() => clearAllRequests()">
          {{ $t("bouton.clear") }}
        </Button>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <template v-for="request in incomingHireRequests" :key="request.id">
          <HireRequestToast
            :id="request.id"
            is-list
            :timestamp="new Date(request.createdAt).getMilliseconds()"
            :requested-by="request.sent_by" />
        </template>
      </div>
    </template>

    <!-- empty state -->
    <template v-else>
      <div class="flex items-center justify-center">
        <div class="flex flex-col items-center justify-center text-center p-4 md:w-1/2">
          <div class="flex w-full relative">
            <div class="bg-background border p-4 w-full rounded-lg shadow-md z-10">
              <div class="flex gap-2">
                <div
                  class="size-14 flex-shrink-0 rounded-full border bg-muted animate-pulse" />
                <div class="grid w-full">
                  <div class="flex gap-4">
                    <div class="w-full h-4 mt-1 border bg-muted animate-pulse rounded" />
                    <div class="w-12 h-8 mt-1 border bg-muted animate-pulse rounded" />
                  </div>
                  <div class="w-1/2 h-3 -mt-4 border bg-muted animate-pulse rounded" />
                </div>
              </div>
              <div class="flex mt-3 overflow-hidden gap-2">
                <div
                  class="h-8 w-14 flex-shrink-0 border bg-muted animate-pulse rounded-sm"></div>
                <div class="h-8 w-full border bg-muted animate-pulse rounded-sm"></div>
                <div class="h-8 w-full border bg-muted animate-pulse rounded-sm"></div>
              </div>
            </div>

            <div
              class="bg-background border p-4 w-full rounded-lg absolute top-[7rem] shadow scale-95 -z-1" />

            <div
              class="bg-background border p-4 w-full rounded-lg absolute top-[7.8rem] shadow scale-90 -z-[2]" />
          </div>

          <div class="grid pt-10">
            <h1 class="text-lg">{{ $t("requests.norequest.title") }}</h1>
            <small class="text-xs font-medium text-muted-foreground">
              {{ $t("requests.norequest.description") }}
            </small>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
