import { DrawerClose, DrawerPortal, DrawerTrigger } from "vaul-vue";

import DrawerRoot from "./Drawer.vue";
import DrawerContent from "./DrawerContent.vue";
import DrawerDescription from "./DrawerDescription.vue";
import DrawerFooter from "./DrawerFooter.vue";
import DrawerHeader from "./DrawerHeader.vue";
import DrawerOverlay from "./DrawerOverlay.vue";
import DrawerTitle from "./DrawerTitle.vue";

export const Drawer = {
  Root: DrawerRoot,
  Overlay: DrawerOverlay,
  Content: DrawerContent,
  Header: DrawerHeader,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Portal: DrawerPortal,
  Trigger: DrawerTrigger,
  Close: DrawerClose
} as const;

export {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger
};
