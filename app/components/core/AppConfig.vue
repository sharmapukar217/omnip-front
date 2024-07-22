<script lang="ts" setup>
const { $pwa } = useNuxtApp();

onMounted(() => {
  if ($pwa?.offlineReady) {
    //
  }
});
</script>

<template>
  <div />
</template>
