<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/valibot";
import * as v from "valibot";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { FILTER_STORE_STORAGE_KEY } from "@/lib/constants";

const props = defineProps<{
  disabled?: boolean;
  values: Record<string, unknown>;
  onSave?: (data: unknown) => void;
}>();

const { t } = useI18n();
const open = ref(false);
const { handleSubmit, handleReset } = useForm({
  keepValuesOnUnmount: true,
  validationSchema: toTypedSchema(
    v.object({
      title: v.pipe(v.string(), v.trim(), v.minLength(3)),
      description: v.optional(v.string())
    })
  )
});

const handleSave = handleSubmit(function (formValues) {
  let arr: unknown[] = [];
  const data = {
    ...formValues,
    values: props.values,
    id: crypto.randomUUID(),
    createdAt: new Date().toString()
  };
  toast.info("Saving to local storage...");

  const dbValue = localStorage.getItem(FILTER_STORE_STORAGE_KEY);
  if (dbValue) {
    try {
      arr = JSON.parse(dbValue) || [];
      console.debug(`DONE: ${arr.length} FILTER VALUE(S) LOADED`);
    } catch {
      console.error("ERR: DEFECTED FILTER STORAGE");
      localStorage.removeItem(FILTER_STORE_STORAGE_KEY);
      toast.error(t("message.oops"));
    }
  }

  arr = [data, ...arr];
  localStorage.setItem(FILTER_STORE_STORAGE_KEY, JSON.stringify(arr));
  toast.success("Configuration saved successfully...");
  props.onSave?.(data);
  open.value = false;
  handleReset();
});
</script>

<template>
  <AlertDialog v-model:open="open">
    <AlertDialogTrigger as-child>
      <Button
        size="sm"
        type="button"
        class="w-full"
        variant="outline"
        :disabled="disabled">
        Save Filters
      </Button>
    </AlertDialogTrigger>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Save the search configuration?</AlertDialogTitle>
        <AlertDialogDescription>
          Saving the search configuration allow you to instantly start searching in future
          use.
        </AlertDialogDescription>

        <div
          class="text-sm font-medium border border-input rounded-md bg-muted px-2 py-1">
          Please note that this is stored in your device, so only accessible on this
          device!
        </div>

        <form class="grid gap-4 text-left pt-4" @submit="handleSave">
          <FormField v-slot="{ componentField }" name="title">
            <FormItem>
              <FormLabel>Title<sup class="text-destructive">*</sup></FormLabel>
              <FormControl>
                <FormInput v-bind="componentField" placeholder="e.x: My search" />
                <FormMessage />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="description">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  rows="4"
                  v-bind="field"
                  placeholder="e.x: Reason to save."
                  class="w-full text-sm font-medium border border-input bg-background rounded-md focus:ring-2 focus:ring-primary focus:border-primary" />
                <FormMessage />
              </FormControl>
            </FormItem>
          </FormField>

          <div class="flex flex-col sm:flex-row justify-end gap-x-2">
            <Button type="submit" class="sm:order-2">Save </Button>
            <AlertDialogCancel @click="() => handleReset()"> Cancel </AlertDialogCancel>
          </div>
        </form>
      </AlertDialogHeader>
    </AlertDialogContent>
  </AlertDialog>
</template>
