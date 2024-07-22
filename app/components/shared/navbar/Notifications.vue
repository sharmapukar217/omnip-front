<script setup lang="ts">
import { BasicNotification } from "@/components/shared/notification";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Popover } from "@/components/ui/popover";
import { useIsDesktop } from "@/components/ui/responsive-drawer/lib";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createReusableTemplate } from "@vueuse/core";

const isOpen = ref(false);
const isDesktop = useIsDesktop();
const [TriggerTemplate, Trigger] = createReusableTemplate();
const [NotificationsListTemplate, NotificationsList] = createReusableTemplate();
</script>

<template>
  <TriggerTemplate>
    <Button variant="ghost" class="rounded-full size-7 p-0">
      <div class="i-heroicons-bell !size-5" />
    </Button>
  </TriggerTemplate>

  <NotificationsListTemplate>
    <ScrollArea class="h-[300px]">
      <div class="grid gap-4">
        <BasicNotification
          title="Hire request"
          icon-class="i-bi-clock-history"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          :timestamp="new Date(2024, 5, 10)"
          :action="{ title: 'Accept', onClick: () => {} }"
          :cancel="{ title: 'Cancel', onClick: () => {} }" />

        <BasicNotification
          title="Friend Request"
          icon-class="i-bi-person-plus-fill"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          :timestamp="new Date(2024, 5, 10)"
          :action="{ title: 'Accept', onClick: () => {} }"
          :cancel="{ title: 'Reject', onClick: () => {} }" />

        <BasicNotification
          title="Period Completed"
          icon-class="i-bi-person-plus-fill"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          :timestamp="new Date(2024, 5, 10)" />
      </div>
    </ScrollArea>
  </NotificationsListTemplate>

  <div class="contents">
    <Popover.Root v-if="isDesktop" v-model:open="isOpen">
      <Popover.Trigger as-child><Trigger /> </Popover.Trigger>
      <Popover.Content align="end" class="p-0 min-w-[22rem]">
        <div class="border-b px-4 py-2">
          <h1 class="text-lg font-semibold leading-none tracking-tight">
            {{ $t("page.settings.notifications") }}
          </h1>
        </div>

        <div class="p-1"><NotificationsList /></div>
      </Popover.Content>
    </Popover.Root>

    <Drawer.Root v-else v-model:open="isOpen">
      <Drawer.Trigger as-child><Trigger /> </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header class="border-b">
          <Drawer.Title> {{ $t("page.settings.notifications") }} </Drawer.Title>
        </Drawer.Header>

        <div class="p-1" data-vaul-no-drag><NotificationsList /></div>
      </Drawer.Content>
    </Drawer.Root>
  </div>
</template>
