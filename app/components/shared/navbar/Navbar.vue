<script setup lang="ts">
import { LogoIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Dropdown from "./Dropdown.vue";
import NavbarSkeleton from "./NavbarSkeleton.vue";
import Notifications from "./Notifications.vue";

const { status, currentUser } = useCurrentUser();
</script>

<template>
  <header class="sticky top-0 bg-background border-b-2 z-50">
    <div class="container flex items-center">
      <NavbarSkeleton v-if="status === 'pending' && !currentUser" />

      <div v-else class="contents">
        <NuxtLink to="/" class="p-0">
          <LogoIcon :classes="{ root: 'size-16 p-0' }" />
        </NuxtLink>

        <template v-if="currentUser">
          <div class="ms-auto flex items-center justify-end gap-4">
            <div class="hidden md:flex items-center gap-4">
              <NuxtLink
                to="/"
                class="text-sm font-medium text-muted-foreground"
                exact-active-class="!text-foreground">
                {{ $t("page.home") }}
              </NuxtLink>

              <NuxtLink
                to="/requests"
                class="text-sm font-medium text-muted-foreground"
                exact-active-class="!text-foreground">
                {{ $t("page.requests") }}
              </NuxtLink>

              <NuxtLink
                to="/chat"
                class="text-sm font-medium text-muted-foreground"
                active-class="!text-foreground">
                Chats
              </NuxtLink>
            </div>

            <Notifications />
            <Dropdown />
          </div>
        </template>

        <div v-else class="flex items-center justify-end ms-auto gap-3">
          <Button size="sm" variant="ghost" as-child :no-ring="true">
            <NuxtLink to="/login" active-class="bg-muted text-muted-foreground">
              {{ $t("page.login") }}
            </NuxtLink>
          </Button>

          <Button size="sm" variant="ghost" as-child :no-ring="true">
            <NuxtLink to="/register" active-class="bg-muted text-muted-foreground">
              {{ $t("page.register") }}
            </NuxtLink>
          </Button>
        </div>
      </div>
    </div>
  </header>
</template>
