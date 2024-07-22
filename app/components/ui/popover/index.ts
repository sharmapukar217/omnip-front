import { PopoverAnchor } from "radix-vue";
import PopoverRoot from "./Popover.vue";
import PopoverContent from "./PopoverContent.vue";
import PopoverTrigger from "./PopoverTrigger.vue";

export const Popover = {
  Root: PopoverRoot,
  Anchor: PopoverAnchor,
  Trigger: PopoverTrigger,
  Content: PopoverContent
} as const;

export { PopoverAnchor, PopoverContent, PopoverRoot, PopoverTrigger };
