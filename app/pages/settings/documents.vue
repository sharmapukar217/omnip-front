<script lang="ts" setup>
import DocumentUploadForm from "@/components/pages/settings/DocumentUploadForm.vue";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FILE_FOLDER } from "@/lib/constants";
import { documentsSchema } from "@/lib/formSchema";
import { getFileExtension, renameFile } from "@/lib/utils";
import { toTypedSchema } from "@vee-validate/valibot";
import * as v from "valibot";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

const { t } = useI18n();
const { user, client, updateMe } = useDirectusUsers();
const { uploadFiles } = useDirectusFiles({ staticToken: true });

const isLoading = ref(false);
const initialValues = ref<Partial<v.InferInput<typeof documentsSchema>>>({});

const loadFile = (fileId: string) => {
  if (!fileId) return;

  return client
    .request<Blob>(() => ({ path: `/assets/${fileId}` }))
    .then((blob) => {
      return new File([blob], `${fileId}.${getFileExtension(blob.type)}`, {
        type: blob.type
      });
    })
    .catch(() => undefined);
};

const { setValues, isSubmitting, meta, handleSubmit } = useForm({
  validationSchema: toTypedSchema(v.object({ documents: documentsSchema }))
});

watch(
  user,
  async (user) => {
    if (!user) return;
    const fileIds = [user.assurance, user.kbis, user.cni, user.diplome];

    isLoading.value = true;
    const f = await Promise.all(fileIds.map((id) => loadFile(id)));
    initialValues.value = { assurance: f[0], kbis: f[1], cni: f[2], diplome: f[3] };
    isLoading.value = false;

    setValues({ documents: initialValues.value });
  },
  { immediate: true }
);

const onSubmit = handleSubmit(async function (values) {
  let shouldUpdate = false;

  try {
    // upload docs
    const docsFormData = new FormData();

    if (values.documents.assurance.name !== initialValues.value.assurance?.name) {
      shouldUpdate = true;
      const uuid = crypto.randomUUID();
      docsFormData.append("id", uuid);
      docsFormData.append("folder", FILE_FOLDER.assurance);
      docsFormData.append("file", renameFile(values.documents.assurance, uuid));
    }

    if (values.documents.kbis.name !== initialValues.value.kbis?.name) {
      shouldUpdate = true;
      const uuid = crypto.randomUUID();
      docsFormData.append("id", uuid);
      docsFormData.append("folder", FILE_FOLDER.kbis);
      docsFormData.append("file", renameFile(values.documents.kbis, uuid));
    }

    if (values.documents.cni.name !== initialValues.value.cni?.name) {
      shouldUpdate = true;
      const uuid = crypto.randomUUID();
      docsFormData.append("id", uuid);
      docsFormData.append("folder", FILE_FOLDER.cni);
      docsFormData.append("file", renameFile(values.documents.cni, uuid));
    }

    if (user.value?.accountType === "freelancer" && values.documents.diplome) {
      if (values.documents.diplome.name === initialValues.value.diplome?.name) return;

      shouldUpdate = true;
      const uuid = crypto.randomUUID();
      docsFormData.append("id", uuid);
      docsFormData.append("folder", FILE_FOLDER.diplome);
      docsFormData.append("file", renameFile(values.documents.diplome, uuid));
    }

    if (!shouldUpdate) return;

    toast.info(t("message.file.loading"));
    const response = await uploadFiles(docsFormData);
    toast.success(t("message.success.upload.file"));

    /** response can be array or object, so make it array always */
    const documents = Array.isArray(response) ? response : [response];

    const docs = {
      assurance: documents.find((d) => d.folder === FILE_FOLDER.assurance)?.id,
      diplome: documents.find((d) => d.folder === FILE_FOLDER.diplome)?.id,
      kbis: documents.find((d) => d.folder === FILE_FOLDER.kbis)?.id,
      cni: documents.find((d) => d.folder === FILE_FOLDER.cni)?.id
    };

    await updateMe(docs, {});

    toast.success(t("message.success.update.profile"));
  } catch (err) {
    toast.error(t("message.oops"));
  }
});
</script>

<template>
  <NuxtLayout name="settings">
    <Card.Root v-if="user" as="form" @submit="onSubmit">
      <Card.Header>
        <Card.Title>{{ $t("page.settings.documents") }}</Card.Title>
        <Card.Description>
          {{ $t("register.document.update.description") }}
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="grid gap-4 w-full">
          <DocumentUploadForm
            :is-loading="isLoading"
            :values="initialValues"
            :family-name="user.last_name"
            :entreprise="user.entreprise"
            :account-type="user.accountType" />
        </div>
      </Card.Content>
      <Card.Footer>
        <Button size="sm" class="ms-auto" :loading="isSubmitting" :disabled="!meta.valid">
          {{ $t("message.update") }}
        </Button>
      </Card.Footer>
    </Card.Root>
  </NuxtLayout>
</template>
