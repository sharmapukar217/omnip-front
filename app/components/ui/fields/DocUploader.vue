<script setup lang="ts">
import { useDropZone } from "@vueuse/core";
import type { FieldContext, FieldMeta, PrivateFieldContext } from "vee-validate";

import { Form } from "@/components/ui/form";
import { promptChatPDF } from "@/lib/chatPDF";
import { DOC_FILE_ALLOWED_MIME_TYPE, DOC_FILE_MAX_SIZE } from "@/lib/formSchema";
import { googleVision } from "@/lib/googleVision";
import { cn, getFileSize } from "@/lib/utils";

export interface DocUploaderFnCtx
  extends Pick<
    PrivateFieldContext,
    | "validate"
    | "resetField"
    | "handleChange"
    | "handleReset"
    | "handleBlur"
    | "setTouched"
    | "setErrors"
  > {
  errors: string[];
  value: File | undefined;
  errorMessage: string | undefined;
  meta: FieldMeta<File | undefined>;
  handleInput: FieldContext["handleChange"];
}

const props = defineProps<{
  name: string;
  label?: string;
  disabled?: boolean;
  defaultValue?: File;
  showResetBtn?: boolean;
  showDownloadFile?: boolean;
  query: { entreprise: string; familyName?: string };
}>();

const { t } = useI18n();

const skipValidation = ref(false);
const disabled = ref(props.disabled);
const dropZoneRef = ref<HTMLDivElement>();
const inputFieldRef = ref<HTMLInputElement>();
const isLoading = defineModel<boolean>("isLoading", { default: false });

const handleInput = (files: File[] | null) => {
  if (!inputFieldRef.value || !files) return;

  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));

  inputFieldRef.value.files = dataTransfer.files;
  inputFieldRef.value.dispatchEvent(new Event("input", { bubbles: true }));
};

const { isOverDropZone } = useDropZone(dropZoneRef, {
  dataTypes: [...DOC_FILE_ALLOWED_MIME_TYPE],
  onDrop: handleInput
});

const queryKeys = Object.keys(props.query || {});
const queryValues = Object.values(props.query || {});

const handleDocumentValidation = async (file: File) => {
  if (file.type == "application/pdf") {
    const content = await promptChatPDF({
      file,
      prompt: `Do you find ${queryValues.map((v) => `"${v}"`).join(" and ")} anywhere? Answer me only with TRUE or FALSE`
    });
    return content?.toUpperCase() === "TRUE";
  } else if (file.type.startsWith("image")) {
    const base64Image = await new Promise<string | undefined>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e) => resolve(e.target!.result?.toString()?.split(",")?.[1]);
      reader.onerror = (error) => reject(error);
    });

    if (!base64Image) return;
    const response = await googleVision.getOcr(base64Image);

    if (typeof response?.text !== "string") return false;

    return queryValues.some((k) => response.text.toUpperCase().includes(k.toUpperCase()));
  }

  return false;
};

async function onInput(
  e: Event,
  { handleInput, setErrors, resetField }: DocUploaderFnCtx
) {
  /** every time picker is clicked, reset field */
  resetField({ value: props.defaultValue });

  /** trigger input  */
  handleInput(e);

  /** skip validation on some conditions ( i.e: reseting field ) */
  if (skipValidation.value) {
    skipValidation.value = true;
    return;
  }

  /** can't use value from ctx, so have to grab it from input target */
  const value = (e.target as HTMLInputElement).files?.[0];

  /** validation ( sync ) */
  if (!value) return;
  if (!props.query?.entreprise) {
    return resetField({
      touched: true,
      value: props.defaultValue,
      errors: ["Enter the enterprise details first."]
    });
  }

  /**
   * validation ( async, call to ocr/chatpdf )
   * setting errors as empty string because
   * mark this field as invaid until the file is validated.
   * WARN: Do not remove this and below `setError()` statement
   */
  setErrors([" "]);
  isLoading.value = true;

  try {
    /**
     * this actually removes the error if the promise returns `true` ( explained above )
     * WARN: Do not remove this and below `setError()` statement
     */
    if (await handleDocumentValidation(value)) return setErrors([]);

    /**
     * else reset field ( to clear value ) and then set error
     */
    return resetField({
      touched: true,
      value: props.defaultValue,
      errors: [`Wrong document provided. e.x: ${queryKeys.join(" or ")} mismatched!`]
    });
  } catch (err) {
    /** oops, reset field and show error message */
    resetField({ touched: true, value: props.defaultValue, errors: [t("message.oops")] });
  } finally {
    isLoading.value = false;
  }
}

const downloadFile = (file?: File) => {
  if (file && file instanceof File) {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");

    a.setAttribute("href", url);
    a.setAttribute("download", file.name);

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
</script>

<template>
  <Form.Field v-slot="ctx" :name="name">
    <Form.Item>
      <!-- eslint-disable -->
      <Form.Label
        v-if="label"
        class="text-sm font-medium leading-none capitalize"
        v-html="label" />

      <Form.Control>
        <input
          ref="inputFieldRef"
          type="file"
          class="peer hidden"
          :disabled="disabled || isLoading"
          @input="(e: Event) => onInput(e, ctx)" />

        <div
          ref="dropZoneRef"
          :class="
            cn(
              'relative flex rounded-lg shadow-sm transition-colors bg-muted/40 peer-disabled:border-border',
              [
                ctx.value
                  ? 'border-2'
                  : 'border-dashed border-[3.5px] hover:border-primary',
                ctx.meta.touched && !!ctx.errorMessage && '!border-destructive',
                isOverDropZone && 'border-dashed border-[3.5px] border-primary'
              ]
            )
          ">
          <Form.Label
            :class="
              cn(
                'size-full px-4 py-4 cursor-pointer group',
                isOverDropZone && 'cursor-grab',
                disabled && 'cursor-not-allowed',
                isLoading && 'cursor-wait'
              )
            ">
            <div v-if="isLoading && !ctx.value" class="flex gap-3">
              <div class="size-8 rounded-md bg-muted border animate-pulse"></div>
              <div class="flex flex-col w-full pt-1 gap-1">
                <div class="border bg-muted rounded-sm py-1 animate-pulse"></div>
                <div class="border bg-muted rounded-sm py-1 w-16 animate-pulse"></div>
              </div>
            </div>

            <!-- file info viewer -->
            <div v-else-if="ctx.value" class="flex items-center">
              <div
                :class="
                  cn('!size-8 shrink-0', [
                    ctx.value.type === 'application/pdf'
                      ? 'i-bi-file-earmark-pdf-fill'
                      : ctx.value.type.startsWith('image')
                        ? 'i-bi-file-earmark-image-fill'
                        : ctx.value.type.startsWith('video')
                          ? 'i-bi-file-earmark-play-fill'
                          : 'i-bi-file-earmark-x-fill'
                  ])
                " />

              <div class="ps-4 pe-8 grid items-center">
                <button
                  type="button"
                  :class="
                    cn(
                      'text-xs md:text-sm font-medium ',
                      props.showDownloadFile &&
                        ctx.value &&
                        'hover:underline hover:text-primary'
                    )
                  "
                  @click="() => downloadFile(ctx.value)">
                  <span class="text-ellipsis line-clamp-1 break-all">
                    {{ ctx.value.name }}
                  </span>
                </button>
                <small class="text-xs text-muted-foreground">
                  {{ getFileSize(ctx.value.size) }}
                </small>
              </div>
            </div>

            <!-- uploader -->
            <div v-else class="flex flex-col items-center pb-1">
              <div
                :class="
                  cn(
                    'i-bi-cloud-arrow-up !size-10 md:!size-16 text-muted-foreground group-hover:text-primary transition-colors mb-4',
                    disabled && 'group-hover:text-muted-foreground',
                    ctx.meta.touched && !!ctx.errorMessage && '!text-destructive'
                  )
                " />
              <div
                :class="
                  cn(
                    'text-sm font-medium text-center text-foreground/70 leading-3 mb-2',
                    disabled &&
                      'bg-muted text-transparent border [&_*]:text-transparent rounded-sm animate-pulse'
                  )
                ">
                <span> Drag and drop your file(s) or </span>
                <span class="text-foreground hover:underline underline-offset-2">
                  choose
                </span>
                <span> to upload </span>
              </div>
              <div
                :class="
                  cn('text-muted-foreground text-sm', [
                    disabled &&
                      'text-transparent bg-muted border rounded-md animate-pulse'
                  ])
                ">
                <small class="text-sm">
                  png, jpg, pdf | max {{ getFileSize(DOC_FILE_MAX_SIZE, 0) }}
                </small>
              </div>
            </div>
          </Form.Label>

          <div v-if="isLoading" class="p-2 text-primary my-auto">
            <svg width="2em" height="2em" viewBox="0 0 24 24">
              <circle cx="12" cy="3.5" r="1.5" fill="currentColor" opacity="0">
                <animateTransform
                  attributeName="transform"
                  calcMode="discrete"
                  dur="2.4s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 12 12;90 12 12;180 12 12;270 12 12" />
                <animate
                  attributeName="opacity"
                  dur="0.6s"
                  keyTimes="0;0.5;1"
                  repeatCount="indefinite"
                  values="1;1;0" />
              </circle>
              <circle cx="12" cy="3.5" r="1.5" fill="currentColor" opacity="0">
                <animateTransform
                  attributeName="transform"
                  begin="0.2s"
                  calcMode="discrete"
                  dur="2.4s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="30 12 12;120 12 12;210 12 12;300 12 12" />
                <animate
                  attributeName="opacity"
                  begin="0.2s"
                  dur="0.6s"
                  keyTimes="0;0.5;1"
                  repeatCount="indefinite"
                  values="1;1;0" />
              </circle>
              <circle cx="12" cy="3.5" r="1.5" fill="currentColor" opacity="0">
                <animateTransform
                  attributeName="transform"
                  begin="0.4s"
                  calcMode="discrete"
                  dur="2.4s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="60 12 12;150 12 12;240 12 12;330 12 12" />
                <animate
                  attributeName="opacity"
                  begin="0.4s"
                  dur="0.6s"
                  keyTimes="0;0.5;1"
                  repeatCount="indefinite"
                  values="1;1;0" />
              </circle>
            </svg>
          </div>

          <button
            type="button"
            title="Reset field"
            v-if="props.showResetBtn && !ctx.value && !isLoading"
            class="absolute right-2.5 top-5 size-7 rounded-full text-muted-foreground hover:bg-muted focus:ring-2 focus:ring-primary inline-flex items-center justify-center group"
            @click="
              () => {
                skipValidation = true;
                handleInput([props.defaultValue]);
              }
            ">
            <div
              class="i-bi-arrow-repeat !size-5 group-hover:rotate-45 transition-transform" />
          </button>

          <button
            v-if="ctx.value && !isLoading"
            type="button"
            class="inline-flex items-center justify-center h-4 w-4 rounded-full text-destructive hover:text-destructive/85 absolute right-4 top-1/2 -translate-y-1/2"
            @click.stop="() => ctx.handleReset({ value: undefined })">
            <div class="i-bi-x-circle-fill" />
          </button>
        </div>

        <Form.Message />
      </Form.Control>
    </Form.Item>
  </Form.Field>
</template>
