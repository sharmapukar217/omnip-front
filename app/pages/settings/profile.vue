<script lang="ts" setup>
import ProfileAvatarUpload from "@/components/pages/settings/ProfileAvatarUpload.vue";
import ProfileDeleteForm from "@/components/pages/settings/ProfileDeleteForm.vue";
import ProfileUpdateForm from "@/components/pages/settings/ProfileUpdateForm.vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ rootClass?: string }>();
</script>

<template>
  <NuxtLayout name="settings">
    <div :class="cn('grid gap-4 w-full', props.rootClass)">
      <ProfileAvatarUpload />
      <ProfileUpdateForm />
      <ProfileDeleteForm />
    </div>
  </NuxtLayout>
</template>
