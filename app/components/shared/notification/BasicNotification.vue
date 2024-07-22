<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

type NotificationProps = {
  title: string;
  description: string;

  timestamp: Date;
  iconClass?: string;

  /** action button props */
  action?: {
    title: string;
    class?: string;
    onClick: () => void;
  };

  /** cancel button props */
  cancel?: {
    title: string;
    class?: string;
    onClick: () => void;
  };
};

defineProps<NotificationProps>();
</script>

<template>
  <div class="grid rounded-md px-3 py-1">
    <div class="flex items-center">
      <div class="relative inline-block shrink-0">
        <img
          alt=""
          class="w-12 h-12 rounded-full"
          src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" />
        <div
          v-if="iconClass"
          class="absolute bottom-0 right-0 inline-flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full">
          <div :class="cn('!size-3', iconClass)" />
        </div>
      </div>

      <div class="ms-3 text-sm font-normal w-full">
        <div class="text-sm font-semibold text-foreground">{{ title }}</div>
        <div class="text-sm font-normal text-foreground/80">{{ description }}</div>
        <span
          v-if="timestamp"
          class="text-xs font-medium text-muted-foreground capitalize">
          {{ formatDistanceToNow(timestamp, { addSuffix: true }) }}
        </span>
      </div>
    </div>

    <div class="flex ms-[3.5rem] mt-3 gap-3">
      <template v-if="action">
        <Button size="sm" :no-ring="true" :class="action.class" @click="action.onClick">
          {{ action.title }}
        </Button>
      </template>
      <template v-if="cancel">
        <Button size="sm" variant="outline" :class="cancel.class" @click="cancel.onClick">
          {{ cancel.title }}
        </Button>
      </template>
    </div>
  </div>
</template>
