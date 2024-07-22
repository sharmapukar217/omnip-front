<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/valibot";
import * as v from "valibot";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { FILE_FOLDER } from "@/lib/constants";
import { avatarField } from "@/lib/formSchema";
import { cn, getDirectusAssetUrl } from "@/lib/utils";

/** composables */
const { t } = useI18n();
const { user, updateMe } = useDirectusUsers();
const { uploadFiles } = useDirectusFiles({ staticToken: true });

/** refs */
const imageSrc = ref(getDirectusAssetUrl(user.value?.avatar as string));

const { meta, errors, isSubmitting, handleSubmit } = useForm({
  validationSchema: toTypedSchema(v.object({ avatar: v.optional(avatarField) }))
});

watch(errors, () => {
  if (errors.value.avatar) toast.error(errors.value.avatar);
});

const fileToUrl = (file: File) => URL.createObjectURL(file);

const onSubmit = handleSubmit(async function (values) {
  if (!values.avatar) return;

  const formData = new FormData();
  const uuid = crypto.randomUUID();

  formData.append("id", uuid);
  formData.append("folder", FILE_FOLDER.avatars);
  formData.append(
    "file",
    new File([values.avatar], `${uuid}.png`, { type: values.avatar.type })
  );

  toast.info(t("message.avatar.loading"));

  await uploadFiles(formData)
    .then(async (response) => {
      toast.info(t("message.avatar.loading"));
      await updateMe({ avatar: response }, {});
      toast.success(t("message.success.avatar"));
    })
    .catch(() => {
      toast.error(t("message.error.avatar"));
    });
});
</script>

<template>
  <Card.Root id="user-avatar-update-form" as="form" @submit="onSubmit">
    <Card.Content class="flex pt-6 justify-between">
      <div class="w-full flex flex-col">
        <Card.Title>{{ $t("title.avatar.main") }}</Card.Title>
        <div class="pt-4">
          <Card.Description class="text-foreground">
            {{ $t("title.avatar") }}
          </Card.Description>
          <Card.Description>
            {{ $t("description.avatar") }}
          </Card.Description>
        </div>
      </div>

      <div class="w-1/3 flex items-center justify-end">
        <div class="flex flex-col items-center gap-1">
          <FormField v-slot="{ value, handleChange, handleReset }" name="avatar">
            <input
              id="avatar-file-picker"
              type="file"
              class="peer hidden"
              @change="handleChange" />

            <label
              for="avatar-file-picker"
              :class="
                cn(
                  'relative rounded-full bg-muted border-2 size-16 md:size-20 lg:size-24 cursor-pointer',
                  errors.avatar && 'border-destructive',
                  isSubmitting && 'animate-pulse'
                )
              ">
              <template v-if="value">
                <img alt="" :src="fileToUrl(value)" class="size-full rounded-full z-10" />
              </template>
              <template v-else>
                <img alt="" :src="imageSrc" class="size-full rounded-full z-10" />
              </template>
            </label>

            <template v-if="value">
              <button
                type="reset"
                class="mt-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                @click="handleReset">
                {{ $t("message.reset") }}
              </button>
            </template>
          </FormField>
        </div>
      </div>
    </Card.Content>
    <Card.Footer>
      <small class="text-xs md:text-sm">
        {{ $t("form.validation.indication.avatar") }}
      </small>
      <template v-if="meta.dirty && meta.valid">
        <Button size="sm" class="ms-auto lg:me-2 py-1.5" :loading="isSubmitting">
          {{ $t("message.update") }}
        </Button>
      </template>
    </Card.Footer>
  </Card.Root>
</template>
