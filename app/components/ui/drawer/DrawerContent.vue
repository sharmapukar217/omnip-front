<script lang="ts" setup>
import { cn } from "@/lib/utils";
import type { DialogContentEmits, DialogContentProps } from "radix-vue";
import { useForwardPropsEmits } from "radix-vue";
import { tv, type VariantProps } from "tailwind-variants";
import { DrawerContent, DrawerPortal } from "vaul-vue";
import type { HtmlHTMLAttributes } from "vue";
import DrawerOverlay from "./DrawerOverlay.vue";

const variants = tv({
  slots: {
    content: "fixed z-50 flex bg-background outline-none",
    grabber: "bg-muted rounded-md z-[100] flex-shrink-0"
  },
  variants: {
    direction: {
      top: {
        content: "flex-col border-b rounded-b-[10px] inset-x-0 top-0 h-auto",
        grabber: "mx-auto my-3 h-2 w-[120px] order-2"
      },
      right: {
        content: "flex-row border-l inset-y-0 right-0 h-full w-auth",
        grabber: "my-auto mx-2 w-2 h-[120px]"
      },
      bottom: {
        content: "flex-col border-t rounded-t-[10px] inset-x-0 bottom-0 h-auto",
        grabber: "mx-auto my-3 h-2 w-[120px]"
      },
      left: {
        content: "flex-row border-r inset-y-0 left-0 h-svh w-auth",
        grabber: "my-auto mx-2 w-2 h-[120px] order-2"
      },
      center: {
        content:
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        grabber: "hidden"
      }
    }
  },
  defaultVariants: {
    direction: "bottom"
  }
});

const emits = defineEmits<DialogContentEmits>();
const dismissible = inject<boolean | undefined>("dismissible");
const direction = inject<Ref<VariantProps<typeof variants>["direction"]>>("direction");
const props = defineProps<DialogContentProps & { class?: HtmlHTMLAttributes["class"] }>();

const forwarded = useForwardPropsEmits(props, emits);
const { content, grabber } = variants({ direction: direction?.value });
</script>

<template>
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent v-bind="forwarded" :class="cn(props.class, content({ direction }))">
      <div
        :class="grabber({ direction, class: dismissible !== true && 'bg-background' })" />
      <slot />
    </DrawerContent>
  </DrawerPortal>
</template>
