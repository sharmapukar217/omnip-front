<script lang="ts" setup>
import LogoIcon from "@/components/icons/LogoIcon.vue";
</script>

<template>
  <div class="flex items-center w-full">
    <LogoIcon :classes="{ root: 'size-16' }" />

    <div class="inline-flex items-center ms-auto gap-4">
      <div class="w-16 h-6 bg-muted border rounded-md flex-shrink-0 animate-pulse" />
      <div class="size-8 bg-muted border rounded-full flex-shrink-0 animate-pulse" />
      <div class="w-10 h-8 bg-muted border rounded-md flex-shrink-0 animate-pulse" />
    </div>
  </div>
</template>
