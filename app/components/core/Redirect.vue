<script lang="ts" setup>
import type { TypedPathParameter } from "@typed-router/__paths";
import type { RoutesNamesList } from "@typed-router/__routes";

type RedirectProps = {
  to: TypedPathParameter<RoutesNamesList>;
  beforeRedirect?: () => void;
  afterRedirect?: () => void;
};

const props = defineProps<RedirectProps>();

onMounted(() => {
  props.beforeRedirect?.();
  return navigateTo(props.to).then(async () => {
    await props.afterRedirect?.();
  });
});
</script>

<template>
  <div class="contents" />
</template>
