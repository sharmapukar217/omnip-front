<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Command } from "@/components/ui/command";
import { Form } from "@/components/ui/form";
import { Popover } from "@/components/ui/popover";
import { appConfig } from "@/lib/appConfig";
import { useNavStyle } from "@/lib/globalState";
import { cn } from "@/lib/utils";

const navStyle = useNavStyle();
const colorMode = useColorMode();
const { locales, locale, setLocale } = useI18n();
</script>

<template>
  <NuxtLayout name="settings">
    <Card.Root>
      <Card.Header>
        <Card.Title>{{ $t("page.theme") }}</Card.Title>
        <Card.Description>
          {{ $t("theme.description", { app: appConfig.title }) }}
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="grid gap-4">
          <Form.Field name="language">
            <!-- TODO: MAKE IT UNHIDE LATER ON -->
            <Form.Item class="flex flex-col">
              <Form.Label>{{ $t("label.language") }}</Form.Label>
              <small class="text-muted-foreground font-medium">
                {{ $t("language.description") }}
              </small>

              <Popover.Root>
                <Popover.Trigger as-child>
                  <Form.Control>
                    <Button
                      role="combobox"
                      :class="cn('w-fit !bg-background text-foreground border')">
                      <span class="text-foreground/85 me-1">{{
                        $t("language.select")
                      }}</span>
                      <span> ( {{ locale }} ) </span>
                      <div
                        class="i-lucide-chevrons-up-down ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </Form.Control>
                </Popover.Trigger>

                <Popover.Content class="w-[200px] p-0 mt-1">
                  <Command.Root>
                    <Command.Input placeholder="Search language..." />
                    <Command.Empty class="py-2.5">{{
                      $t("message.notfond")
                    }}</Command.Empty>
                    <Command.List>
                      <Command.Group>
                        <Command.Item
                          v-for="l in locales"
                          :key="l.code"
                          :value="l.code"
                          @select="() => setLocale(l.code)">
                          <div
                            :class="
                              cn(
                                'i-lucide-check !size-4 text-green-500 me-2',
                                l.code !== locale && 'opacity-0'
                              )
                            " />
                          {{ l.name }} ({{ l.code }})
                        </Command.Item>
                      </Command.Group>
                    </Command.List>
                  </Command.Root>
                </Popover.Content>
              </Popover.Root>
            </Form.Item>
          </Form.Field>

          <Form.Field
            v-slot="{ componentField }"
            v-model="colorMode.preference"
            type="radio"
            name="theme">
            <Form.Item class="space-y-1">
              <Form.Label>{{ $t("page.theme") }}</Form.Label>
              <Form.Description> {{ $t("theme.select") }} </Form.Description>

              <Form.RadioGroup
                class="grid grid-cols-2 md:grid-cols-3 max-w-xl gap-4 pt-2"
                v-bind="componentField">
                <!-- light theme selector -->
                <Form.Item>
                  <Form.Label
                    class="cursor-pointer [&:has([data-state=checked])>div]:border-primary">
                    <Form.Control>
                      <Form.RadioGroupItem value="light" class="sr-only" />
                    </Form.Control>
                    <div
                      class="items-center rounded-md p-0.5 border-2 border-muted hover:border-accent">
                      <div class="space-y-2 rounded-sm bg-[#ecedef] p-2">
                        <div class="space-y-2 rounded-md bg-white p-2 shadow-sm">
                          <div class="h-2 w-[60%] rounded-lg bg-[#ecedef]" />
                          <div class="h-2 w-[90%] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div
                          class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div
                            class="flex-shrink-0 size-3 md:size-4 rounded-full bg-[#ecedef]" />
                          <div class="h-2 w-[80%] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div
                          class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div class="h-2 w-[80%] rounded-lg bg-[#ecedef]" />
                          <div
                            class="flex-shrink-0 size-3 md:size-4 rounded-full bg-[#ecedef]" />
                        </div>
                      </div>
                    </div>
                    <span class="block w-full p-2 md:text-center font-normal">
                      {{ $t("theme.light") }}
                    </span>
                  </Form.Label>
                </Form.Item>

                <!-- dark theme selector -->
                <Form.Item>
                  <Form.Label
                    class="cursor-pointer [&:has([data-state=checked])>div]:border-primary">
                    <Form.Control>
                      <Form.RadioGroupItem value="dark" class="sr-only" />
                    </Form.Control>
                    <div
                      class="items-center rounded-lg p-0.5 border-2 border-muted bg-background hover:bg-muted hover:text-foreground">
                      <div class="space-y-2 rounded-md bg-slate-950 p-2">
                        <div class="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div class="h-2 w-[60%] rounded-md bg-slate-400" />
                          <div class="h-2 w-[90%] rounded-lg bg-slate-400" />
                        </div>
                        <div
                          class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div
                            class="flex-shrink-0 size-3 md:size-4 rounded-full bg-slate-400" />
                          <div class="h-2 w-[80%] rounded-lg bg-slate-400" />
                        </div>
                        <div
                          class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div class="h-2 w-[80%] rounded-lg bg-slate-400" />
                          <div
                            class="flex-shrink-0 size-3 md:size-4 rounded-full bg-slate-400" />
                        </div>
                      </div>
                    </div>
                    <span class="block w-full p-2 md:text-center font-normal">
                      {{ $t("theme.dark") }}
                    </span>
                  </Form.Label>
                </Form.Item>

                <!-- system theme selector -->
                <Form.Item>
                  <Form.Label
                    class="cursor-pointer [&:has([data-state=checked])>div]:border-primary">
                    <Form.Control>
                      <Form.RadioGroupItem value="system" class="sr-only" />
                    </Form.Control>

                    <div
                      class="flex flex-row rounded-md p-0.5 border-2 border-muted hover:border-accent">
                      <!-- light half -->
                      <div class="space-y-2 w-full bg-[#ecedef] rounded-l-md py-2 ps-2">
                        <div class="space-y-2 rounded-l-md bg-white ps-2 py-2">
                          <div class="h-2 w-full rounded-l-lg bg-[#ecedef]" />
                          <div class="h-2 w-full rounded-l-lg bg-[#ecedef]" />
                        </div>

                        <div
                          class="flex items-center space-x-2 rounded-l-md bg-white ps-2 py-2">
                          <div
                            class="flex-shrink-0 size-3 md:size-4 rounded-full bg-[#ecedef]" />
                          <div class="h-2 w-full rounded-l-lg bg-[#ecedef]" />
                        </div>

                        <div class="rounded-l-md bg-white ps-2 py-3">
                          <div class="h-2 w-full rounded-l-lg bg-[#ecedef]" />
                        </div>
                      </div>

                      <!-- dark half -->
                      <div class="space-y-2 w-full bg-slate-950 rounded-r-md py-2 pe-2">
                        <div class="space-y-2 rounded-r-md bg-slate-800 py-2 pe-2">
                          <div class="h-2 w-[60%] rounded-r-lg bg-slate-400" />
                          <div class="h-2 w-[90%] rounded-r-lg bg-slate-400" />
                        </div>

                        <div
                          class="space-x-2 rounded-r-md bg-slate-800 pe-2 py-2.5 md:py-3">
                          <div class="h-2 w-[80%] rounded-r-lg bg-slate-400" />
                        </div>

                        <div
                          class="flex items-center space-x-2 rounded-r-md bg-slate-800 pe-2 py-2.5 md:py-2 shadow-sm">
                          <div class="h-2 w-full rounded-r-lg bg-slate-400" />
                          <div
                            class="flex-shrink-0 size-3 md:size-4 rounded-full bg-slate-400" />
                        </div>
                      </div>
                    </div>

                    <span class="block w-full p-2 md:text-center font-normal">
                      {{ $t("theme.system") }}
                    </span>
                  </Form.Label>
                </Form.Item>
              </Form.RadioGroup>
            </Form.Item>
          </Form.Field>

          <div>
            <Form.Field v-slot="{ componentField }" type="radio" name="navStyle">
              <Form.Item class="space-y-1">
                <Form.Label>{{ $t("appearance.navigationbar.title") }}</Form.Label>
                <Form.Description>
                  {{ $t("appearance.navigationbar.description") }}
                </Form.Description>

                <Form.RadioGroup
                  v-bind="componentField"
                  v-model="navStyle"
                  class="flex gap-8 pt-2">
                  <Form.Item>
                    <Form.Label
                      class="cursor-pointer [&:has([data-state=checked])>div]:border-primary">
                      <Form.Control>
                        <Form.RadioGroupItem
                          value="default"
                          class="size-10 bg-background [&_svg]:size-10 !outline-none !ring-0 border-muted flex flex-col items-center gap-2" />
                      </Form.Control>
                      <small class="text-xs">{{
                        $t("label.navigationbar.default")
                      }}</small>
                    </Form.Label>
                  </Form.Item>

                  <Form.Item>
                    <Form.Label
                      class="cursor-pointer [&:has([data-state=checked])>div]:border-primary flex flex-col items-center gap-2 dark:hidden">
                      <Form.Control>
                        <Form.RadioGroupItem
                          value="inverted"
                          class="header-inverted size-10 bg-background [&_svg]:size-10 !outline-none !ring-0 border-muted" />
                      </Form.Control>
                      <small class="text-xs">{{
                        $t("label.navigationbar.inverted")
                      }}</small>
                    </Form.Label>
                  </Form.Item>
                </Form.RadioGroup>
              </Form.Item>
            </Form.Field>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  </NuxtLayout>
</template>
