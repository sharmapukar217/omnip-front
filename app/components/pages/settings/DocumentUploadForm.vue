<script lang="ts" setup>
import { DocUploader } from "@/components/ui/fields";

const props = defineProps<{
  entreprise: string;
  familyName?: string;
  isLoading?: boolean;
  accountType?: string;
  values?: { assurance?: File; cni?: File; kbis?: File; diplome?: File };
}>();
</script>

<template>
  <div class="grid gap-4">
    <DocUploader
      :is-loading="isLoading"
      :show-reset-btn="true"
      :show-download-file="true"
      name="documents.assurance"
      label="Insurance <sup class='text-destructive ms-1'>*</sup>"
      :query="{ entreprise: props.entreprise }"
      :default-value="props.values?.assurance" />
    <DocUploader
      :is-loading="isLoading"
      :show-reset-btn="true"
      :show-download-file="true"
      name="documents.kbis"
      label="KBIS <sup class='text-destructive ms-1'>*</sup>"
      :query="{ entreprise: props.entreprise }"
      :default-value="props.values?.kbis" />

    <DocUploader
      :is-loading="isLoading"
      :show-reset-btn="true"
      :show-download-file="true"
      name="documents.cni"
      label="CNI <sup class='text-destructive ms-1'>*</sup>"
      :query="{ entreprise: props.entreprise, 'family name': props.familyName }"
      :default-value="props.values?.cni" />

    <DocUploader
      v-if="props.accountType === 'freelancer'"
      :is-loading="isLoading"
      :show-reset-btn="true"
      :show-download-file="true"
      name="documents.diplome"
      label="Graduation <sup class='text-destructive ms-1'>*</sup>"
      :query="{ entreprise: props.entreprise }"
      :default-value="props.values?.diplome" />
  </div>
</template>
