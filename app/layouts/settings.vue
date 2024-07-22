<script setup lang="ts">
import { Card } from "@/components/ui/card";
import { ROLE } from "@/lib/constants";
import { cn, getDirectusAssetUrl } from "@/lib/utils";

const route = useRoute();
const { status, currentUser } = useCurrentUser();
const path = computed(() => route.path.replaceAll("/", ""));

const menus = [
  {
    title: "title.account",
    links: [
      {
        title: "page.settings.profile",
        href: "/settings/profile",
        icon: "i-bi-person-circle"
      },
      {
        title: "page.settings.documents",
        href: "/settings/documents",
        icon: "i-bi-file-earmark-richtext"
      },
      {
        title: "page.settings.institute",
        href: "/settings/address",
        icon: "i-bi-file-earmark-richtext"
      },
      {
        title: "page.settings.preferences",
        href: "/settings/preferences",
        icon: "i-bi-sliders",
        condition: () => {
          return currentUser.value?.role === ROLE.freelancer;
        }
      }
    ]
  },

  {
    title: "title.general",
    links: [
      {
        title: "page.settings.security",
        href: "/settings/security",
        icon: "i-bi-shield-lock"
      },
      {
        title: "page.settings.appearance",
        href: "/settings/appearance",
        icon: "i-bi-palette"
      },
      {
        title: "page.settings.billing",
        href: "/settings/billing",
        icon: "i-lucide-badge-dollar-sign"
      }
    ]
  },
  {
    title: "page.others",
    links: [
      {
        title: "page.help",
        href: "/app/help",
        icon: "i-bi-question-circle"
      },
      {
        title: "page.report",
        href: "/app/report",
        icon: "i-bi-flag"
      },
      {
        title: "page.about",
        href: "/app/about",
        icon: "i-bi-info-circle"
      }
    ]
  }
];
</script>

<template>
  <!-- skeleton -->
  <div v-if="status === 'pending' && !currentUser" class="contents">
    <div class="flex py-4 md:py-6 border-b bg-background/80">
      <div class="px-4 py-2 md:container flex items-center gap-4">
        <div class="rounded-full size-10 bg-muted flex-shrink-0" />
        <div class="space-y-2">
          <div class="rounded w-48 h-4 bg-muted flex-shrink-0" />
          <div class="rounded w-32 h-4 bg-muted flex-shrink-0" />
        </div>
      </div>
    </div>
    <div class="py-2 md:py-4 flex flex-col md:flex-row gap-2 md:gap-4 md:container">
      <aside class="md:w-2/5 lg:w-1/5 px-4 md:px-0">
        <nav class="flex flex-col md:gap-2">
          <div v-for="(menu, i) in menus" :key="i" class="flex flex-col gap-1">
            <div class="h-3 w-1/2 bg-muted rounded my-2" />

            <div
              v-for="(_, idx) in menu.links"
              :key="idx"
              :class="
                cn(
                  'mb-1 w-full h-9 rounded-md bg-muted',
                  i === 0 && idx == 0 ? 'bg-muted border' : 'bg-muted/80'
                )
              " />
          </div>
        </nav>
      </aside>

      <div class="w-full pt-4 pb-2 px-4 md:px-0 border-t md:border-t-0 space-y-4">
        <Card.Root>
          <Card.Header class="flex flex-row items-center">
            <div class="h-4 w-1/2 rounded-md bg-muted" />
            <div class="ms-auto size-10 bg-muted rounded-full flex-shrink-0" />
          </Card.Header>
          <Card.Content class="grid gap-4">
            <div class="h-4 w-full border rounded-md bg-muted" />
            <div class="h-4 w-1/2 border rounded-md bg-muted" />
            <div class="h-4 w-1/4 border rounded-md bg-muted" />
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header class="flex flex-row items-center">
            <div class="h-4 w-full rounded-md bg-muted" />
          </Card.Header>
          <Card.Content class="grid gap-4">
            <div class="h-4 w-full border rounded-md bg-muted" />
            <div class="h-4 w-1/2 border rounded-md bg-muted" />
            <div class="h-4 w-1/4 border rounded-md bg-muted" />
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  </div>

  <!-- actual ui -->
  <div v-else-if="currentUser" class="contents">
    <!-- setings page header ( user info) -->
    <div class="flex py-4 md:py-6 border-b bg-background/80">
      <div class="px-4 py-2 md:container flex items-center gap-4">
        <div class="rounded-full size-10 bg-muted flex-shrink-0">
          <img
            v-if="currentUser.avatar"
            alt=""
            :src="getDirectusAssetUrl(currentUser.avatar as string)"
            class="rounded-full size-full" />
        </div>

        <div>
          <div class="text-sm font-semibold inline-flex space-x-1">
            <div>
              {{ currentUser.first_name }}
              {{ currentUser.last_name }}
              <template v-if="currentUser.account_type">
                <span class="text-muted-foreground">
                  ({{ currentUser.account_type }})
                </span>
              </template>
            </div>
          </div>
          <div class="text-xs font-semibold text-muted-foreground">
            {{ currentUser.email }}
          </div>
        </div>
      </div>
    </div>

    <!-- main content -->
    <div class="py-2 md:py-4 flex flex-col md:flex-row gap-2 md:gap-4 md:container">
      <!-- sidebar -->
      <aside class="md:w-2/5 lg:w-1/5 px-4 md:px-0">
        <nav class="flex flex-col md:gap-2 md:divide-y-2">
          <div v-for="(menu, i) in menus" :key="i" class="flex flex-col gap-1">
            <div
              :class="
                cn(
                  'md:flex text-sm text-muted-foreground font-semibold py-1',
                  path !== 'settings' && 'hidden'
                )
              ">
              {{ $t(menu.title) }}
            </div>
            <div v-for="(link, idx) in menu.links" :key="idx" class="contents">
              <template
                v-if="typeof link.condition === 'function' ? link.condition() : true">
                <NuxtLink
                  v-if="link.href === route.path"
                  to="/settings"
                  class="flex md:hidden items-center -ms-3 ps-2 py-0.5 text-muted-foreground hover:text-foreground">
                  <div class="i-lucide-chevron-left !size-7" />
                  <div class="font-semibold">
                    {{ $t(link.title) }}
                  </div>
                </NuxtLink>

                <NuxtLink
                  :to="link.href"
                  :class="
                    cn(
                      'h-9 font-medium rounded-md px-3 text-xs flex items-center gap-4 md:flex hover:bg-muted',
                      path !== 'settings' && 'hidden',
                      path === 'settings' &&
                        i === 0 &&
                        idx === 0 &&
                        'md:bg-primary md:text-primary-foreground'
                    )
                  "
                  exact-active-class="!bg-primary !text-primary-foreground">
                  <div :class="cn('!size-4 flex-shrink-0', link.icon)" />
                  {{ $t(link.title) }}
                </NuxtLink>
              </template>
            </div>
          </div>
        </nav>
      </aside>

      <!-- page content from here -->
      <main class="w-full pt-4 pb-2 px-4 md:px-0 border-t-2 md:border-t-0">
        <slot />
      </main>
    </div>
  </div>
</template>
