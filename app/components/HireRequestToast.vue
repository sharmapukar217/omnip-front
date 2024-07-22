<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { HIRE_REUQESTS_TIMEOUT_MS } from "@/lib/constants";
import { getDirectusAssetUrl, pick } from "@/lib/utils";
import { incomingHireRequests } from "@/store";
import { useCounter, useIntervalFn, useTransition } from "@vueuse/core";

const props = defineProps<{
  isList?: boolean;
  timestamp: number;
  requestedBy: {
    id: string;
    avatar: string;
    first_name: string;
    last_name: string;
    entreprise: string;
  };
}>();

const progress = useCounter(0, { max: 100 });
const width = useTransition(progress.count, { duration: 100 });

const route = useRoute();
const socket = useSocket();
const emit = defineEmits(["closeToast"]);
const { user: currentUser } = useDirectusAuth();

const { pause } = useIntervalFn(() => {
  const percentage = ((Date.now() - props.timestamp!) / HIRE_REUQESTS_TIMEOUT_MS) * 100;
  progress.set(percentage);

  if (percentage >= 100) {
    pause();
    incomingHireRequests.value = incomingHireRequests.value.filter(
      (r) => r.requestedBy.id !== props.requestedBy.id
    );
  }
}, 1000);

watch(incomingHireRequests, (requests) => {
  if (!requests.find((r) => r.requestedBy.id !== props.requestedBy.id))
    emit("closeToast");
});

const handleReject = () => {
  emit("closeToast");

  socket.emit(props.requestedBy.id, {
    event: "hire-request:rejected",
    rejectedBy: pick(currentUser.value!, ["id"])
  });

  incomingHireRequests.value = incomingHireRequests.value.filter(
    (r) => r.requestedBy.id !== props.requestedBy.id
  );
};

const handleAccept = () => {
  emit("closeToast");

  socket.emit(props.requestedBy.id, {
    event: "hire-request:accepted",
    acceptedBy: pick(currentUser.value!, ["id", "first_name", "last_name", "avatar"])
  });

  incomingHireRequests.value = incomingHireRequests.value.filter(
    (r) => r.requestedBy.id !== props.requestedBy.id
  );
};
</script>

<template>
  <div
    v-if="isList || route.path !== '/requests'"
    class="grid px-4 py-4 bg-background border rounded-lg md:min-w-[356px] w-full">
    <div class="flex gap-2">
      <div class="size-11 bg-muted rounded-full flex-shrink-0 border border-primary">
        <img
          alt=""
          :src="getDirectusAssetUrl(requestedBy.avatar)"
          class="size-10 rounded-full flex-shrink-0" />
      </div>
      <div class="flex flex-col justify-center">
        <span class="text-sm font-medium">{{ $t("requests.hire") }}</span>
        <div class="text-xs text-muted-foreground">
          <span class="font-medium">{{ requestedBy.first_name }}</span>
          {{ $t("bouton.from") }}
          <span class="font-medium">{{ requestedBy.entreprise }}</span>
          {{ $t("requests.invite") }}
        </div>
      </div>
    </div>

    <div class="flex items-center pt-3 gap-2">
      <Button size="icon" :ring="false" variant="ghost" class="flex-shrink-0">
        <div class="i-bi-info !size-5" />
      </Button>

      <Button :ring="false" variant="outline" class="w-full" @click="handleReject">
        {{ $t("requests.reject") }}
      </Button>
      <Button
        :ring="false"
        variant="outline"
        class="w-full relative overflow-hidden"
        @click="handleAccept">
        <div class="z-10">{{ $t("requests.accept") }}</div>
        <div
          class="absolute inset-0 bg-primary pointer-events-none"
          :style="`width: ${width}%`" />
      </Button>
    </div>
  </div>
</template>
