<script lang="ts" setup>
import Freelancer from "@/components/pages/requests/Freelancer.vue";
import Institute from "@/components/pages/requests/Institute.vue";
import { ROLE } from "@/lib/constants";

const { currentUser } = useCurrentUser();
</script>

<template>
  <div v-if="currentUser?.id" class="contents">
    <template v-if="currentUser.role === ROLE.freelancer">
      <Freelancer />
    </template>
    <template v-else>
      <Institute />
    </template>
  </div>
</template>
