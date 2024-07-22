<script lang="ts" setup>
import { Toaster } from "vue-sonner";
</script>

<template>
  <Toaster
    class="toaster group"
    position="bottom-right"
    :toast-options="{
      classes: {
        toast:
          'z-[1000] group toast rounded-md group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
        description: 'group-[.toast]:text-muted-foreground',
        actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
        cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground'
      }
    }" />
</template>
