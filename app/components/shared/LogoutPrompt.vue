<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { ResponsiveDrawer } from "@/components/ui/responsive-drawer";

const { currentUser } = useCurrentUser();
const { isPending, mutate, reset } = useLogout();
const isOpen = defineModel<boolean>({ default: false });

const handleClose = () => {
  reset();
};
</script>

<template>
  <ResponsiveDrawer.Root
    v-if="currentUser"
    v-model:open="isOpen"
    :dismissible="isOpen && !isPending">
    <ResponsiveDrawer.Content>
      <ResponsiveDrawer.Header>
        <ResponsiveDrawer.Title>
          {{ $t("page.logout") }}
        </ResponsiveDrawer.Title>
        <ResponsiveDrawer.Description>
          {{ $t("message.prompt_logout") }}
        </ResponsiveDrawer.Description>
      </ResponsiveDrawer.Header>

      <ResponsiveDrawer.Footer class="md:ms-auto">
        <ResponsiveDrawer.Close as-child>
          <Button size="sm" variant="outline" @click="handleClose">
            {{ $t("message.cancel") }}
          </Button>
        </ResponsiveDrawer.Close>

        <Button size="sm" variant="default" :loading="isPending" @click="mutate">
          {{ $t("message.confirm") }}
        </Button>
      </ResponsiveDrawer.Footer>
    </ResponsiveDrawer.Content>
  </ResponsiveDrawer.Root>
</template>
