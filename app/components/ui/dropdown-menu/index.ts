import { DropdownMenuPortal } from "radix-vue";
import DropdownMenuRoot from "./DropdownMenu.vue";
import DropdownMenuContent from "./DropdownMenuContent.vue";
import DropdownMenuGroup from "./DropdownMenuGroup.vue";
import DropdownMenuItem from "./DropdownMenuItem.vue";
import DropdownMenuLabel from "./DropdownMenuLabel.vue";
import DropdownMenuSeparator from "./DropdownMenuSeparator.vue";
import DropdownMenuShortcut from "./DropdownMenuShortcut.vue";
import DropdownMenuSub from "./DropdownMenuSub.vue";
import DropdownMenuSubContent from "./DropdownMenuSubContent.vue";
import DropdownMenuSubTrigger from "./DropdownMenuSubTrigger.vue";
import DropdownMenuTrigger from "./DropdownMenuTrigger.vue";

export const DropdownMenu = {
  Portal: DropdownMenuPortal,
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Group: DropdownMenuGroup,
  Item: DropdownMenuItem,
  Shortcut: DropdownMenuShortcut,
  Separator: DropdownMenuSeparator,
  Label: DropdownMenuLabel,
  Sub: DropdownMenuSub,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent
} as const;

export {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
};
