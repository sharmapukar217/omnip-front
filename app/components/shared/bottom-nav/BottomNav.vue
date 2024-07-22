<script lang="ts" setup>
import { cn, getDirectusAssetUrl } from "@/lib/utils";
import BottomNavSkeleton from "./BottomNavSkeleton.vue";

const route = useRoute();
const { status, currentUser } = useCurrentUser();
</script>

<template>
  <BottomNavSkeleton v-if="status === 'pending' && !currentUser" />

  <div
    v-else-if="currentUser"
    class="flex items-center md:hidden border-t sticky bottom-0 py-2 bg-background z-50">
    <NuxtLink
      to="/"
      :class="
        cn(
          'w-full grid place-items-center gap-1 hover:text-foreground',
          route.path === '/' ? 'text-foreground' : 'text-muted-foreground'
        )
      ">
      <div
        :class="cn(' !size-6', route.path === '/' ? 'i-bi-house-fill' : 'i-bi-house')" />
      <small class="text-start font-medium">{{ $t("page.home") }} </small>
    </NuxtLink>

    <NuxtLink
      to="/requests"
      class="w-full grid place-items-center gap-1 text-muted-foreground hover:text-foreground">
      <div
        :class="
          cn(
            ' !size-6',
            route.path === '/requests' ? 'i-bi-hourglass-split' : 'i-bi-hourglass'
          )
        " />
      <small class="text-start font-medium">{{ $t("page.requests") }}</small>
    </NuxtLink>

    <NuxtLink
      to="/chat"
      :class="
        cn(
          'w-full grid place-items-center gap-1 hover:text-foreground',
          route.path.startsWith('/chat') ? 'text-foreground' : 'text-muted-foreground'
        )
      ">
      <div
        :class="
          cn(
            '!size-6',
            route.path.startsWith('/chat') ? 'i-bi-chat-dots-fill' : 'i-bi-chat-dots'
          )
        " />
      <small class="text-start font-medium">{{ $t("page.messages") }}</small>
    </NuxtLink>

    <NuxtLink
      to="/settings"
      :class="
        cn(
          'w-full grid place-items-center gap-0.5 hover:text-foreground',
          route.path.startsWith('/settings')
            ? 'text-foreground [&_div]:border-primary'
            : 'text-muted-foreground'
        )
      ">
      <div class="size-6 rounded-full flex-shrink-0 bg-muted border-2">
        <img
          v-if="currentUser.avatar"
          class="size-full rounded-full flex-shrink-0"
          :src="getDirectusAssetUrl(currentUser.avatar)"
          alt="" />
      </div>
      <small class="text-start font-medium">{{ $t("page.settings") }} </small>
    </NuxtLink>
  </div>

  <div v-else class="contents" />
</template>
