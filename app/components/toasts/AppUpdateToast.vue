<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { UpdateIcon } from "@radix-icons/vue";

defineEmits(["closeToast"]);
defineProps<{ onUpdate: () => void }>();
</script>

<template>
  <div class="grid gap-1 px-4 py-4 border w-full max-w-md rounded-lg shadow-lg">
    <div class="flex items-center gap-3">
      <div><UpdateIcon class="shrink-0 size-5" /></div>
      <h1 class="font-semibold text-foreground">Update Available</h1>
    </div>

    <div class="ps-8 grid gap-1.5">
      <div class="text-sm text-muted-foreground">
        An update is available. Would you like to update?
      </div>

      <div class="flex gap-2 mt-2">
        <Button
          size="sm"
          class="w-full"
          :no-ring="true"
          variant="default"
          @click="onUpdate">
          Update
        </Button>
        <Button size="sm" variant="outline" class="w-full" @click="$emit('closeToast')">
          Not now
        </Button>
      </div>
    </div>
  </div>
</template>
