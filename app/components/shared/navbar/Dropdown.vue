<script setup lang="ts">
import LogoutPrompt from "@/components/shared/LogoutPrompt.vue";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { ROLE } from "@/lib/constants";
import { getDirectusAssetUrl } from "@/lib/utils";

const logoutMenuOpened = ref(false);
const { currentUser } = useCurrentUser();

const colorMode = useColorMode();
const { locales, locale, setLocale } = useI18n();

// actions
const ACTIONS = {
  toggleDevTool: () => window.queryDevtool(),
  updateColorMode: (value: typeof colorMode.value) => {
    colorMode.preference = value;
  },
  updateLocale: (value: typeof locale.value) => {
    setLocale(value);
  }
};
</script>

<template>
  <DropdownMenu.Root v-if="currentUser">
    <DropdownMenu.Trigger as-child>
      <Button variant="ghost" class="rounded-full size-8 p-0">
        <img
          v-if="currentUser.avatar"
          :src="getDirectusAssetUrl(currentUser.avatar)"
          class="size-full rounded-full flex-shrink-0" />
      </Button>
    </DropdownMenu.Trigger>

    <DropdownMenu.Content align="end" class="w-52 md:w-60">
      <DropdownMenu.Label>
        <small class="inline">
          {{ currentUser.first_name }}
          {{ currentUser.last_name }}
          <template v-if="currentUser.account_type">
            ({{ currentUser.account_type }})
          </template>
        </small>
        <small class="block">{{ currentUser.email }}</small>
      </DropdownMenu.Label>

      <DropdownMenu.Group>
        <DropdownMenu.Separator />

        <DropdownMenu.Label class="text-xs font-medium text-muted-foreground">
          {{ $t("title.general") }}
        </DropdownMenu.Label>
        <DropdownMenu.Item as-child>
          <NuxtLink to="/settings">
            <div class="!size-4 i-bi-person-circle me-3" />
            <span>{{ $t("page.settings.profile") }}</span>
            <DropdownMenu.Shortcut>⇧P</DropdownMenu.Shortcut>
          </NuxtLink>
        </DropdownMenu.Item>

        <DropdownMenu.Item as-child>
          <NuxtLink to="/settings">
            <div class="!size-4 i-bi-credit-card-fill me-3" />
            <span>{{ $t("page.settings.billing") }}</span>
            <DropdownMenu.Shortcut>⇧B</DropdownMenu.Shortcut>
          </NuxtLink>
        </DropdownMenu.Item>

        <DropdownMenu.Item as-child>
          <NuxtLink to="/settings">
            <div class="!size-4 i-bi-gear-wide-connected me-3" />
            <span>{{ $t("page.settings") }}</span>
            <DropdownMenu.Shortcut>⇧S</DropdownMenu.Shortcut>
          </NuxtLink>
        </DropdownMenu.Item>
      </DropdownMenu.Group>

      <DropdownMenu.Separator />

      <DropdownMenu.Group>
        <DropdownMenu.Label class="text-xs font-medium text-muted-foreground">
          System
        </DropdownMenu.Label>

        <!-- NOTE: No translation needed as this is only for devs -->
        <DropdownMenu.Item
          v-if="currentUser.role === ROLE.admin"
          @click="ACTIONS.toggleDevTool">
          <div class="!size-4 i-bi-database-gear me-3" />
          <span>Query Devtool</span>
          <DropdownMenu.Shortcut>⇧Q</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <!-- NOTE: No translation needed as this is only for devs -->

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <div class="!size-4 i-bi-palette me-3" />
            {{ $t("label.theme") }}
            <small class="text-[10px] uppercase ms-auto">{{ colorMode.value }}</small>
          </DropdownMenu.SubTrigger>

          <DropdownMenu.SubContent :side-offset="10">
            <DropdownMenu.Item
              class="group"
              @click="() => ACTIONS.updateColorMode('light')">
              <div class="i-bi-sun me-3" />
              <small>{{ $t("theme.light") }} </small>
              <div
                v-if="colorMode.value === 'light'"
                class="i-bi-check-lg ms-auto text-green-500 group-focus:text-primary-foreground" />
            </DropdownMenu.Item>

            <DropdownMenu.Item @click="() => ACTIONS.updateColorMode('dark')">
              <div class="i-bi-moon me-3" />
              <small>{{ $t("theme.dark") }} </small>
              <div
                v-if="colorMode.value === 'dark'"
                class="i-bi-check-lg ms-auto text-green-500 group-focus:text-primary-foreground" />
            </DropdownMenu.Item>

            <DropdownMenu.Item @click="() => ACTIONS.updateColorMode('system')">
              <div class="i-lucide-laptop-minimal me-3" />
              <small>{{ $t("theme.system") }} </small>
              <div
                v-if="colorMode.value === 'system'"
                class="i-bi-check-lg ms-auto text-green-500 group-focus:text-primary-foreground" />
            </DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <div class="!size-4 i-heroicons-language me-3" />
            {{ $t("label.language") }}
            <small class="text-[10px] uppercase ms-auto">{{ locale }}</small>
          </DropdownMenu.SubTrigger>

          <DropdownMenu.SubContent :side-offset="10">
            <DropdownMenu.Item
              v-for="l in locales"
              :key="l.code"
              @click="() => ACTIONS.updateLocale(l.code)">
              <small>{{ l.name }} </small>
              <div
                v-if="locale === l.code"
                class="i-bi-check-lg ms-auto text-green-500 group-focus:text-primary-foreground" />
            </DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      </DropdownMenu.Group>

      <DropdownMenu.Separator />

      <DropdownMenu.Item
        class="text-destructive focus:bg-destructive focus:text-destructive-foreground w-full"
        @click="() => (logoutMenuOpened = true)">
        <div class="!size-4 i-lucide-log-out me-3" />
        <span>{{ $t("page.logout") }}</span>
        <DropdownMenu.Shortcut>⇧L</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>

  <LogoutPrompt v-model:open="logoutMenuOpened" />
</template>
