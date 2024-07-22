import DialogRoot from "./Dialog.vue";
import DialogClose from "./DialogClose.vue";
import DialogContent from "./DialogContent.vue";
import DialogDescription from "./DialogDescription.vue";
import DialogFooter from "./DialogFooter.vue";
import DialogHeader from "./DialogHeader.vue";
import DialogScrollContent from "./DialogScrollContent.vue";
import DialogTitle from "./DialogTitle.vue";
import DialogTrigger from "./DialogTrigger.vue";

export const Dialog = {
  Root: DialogRoot,
  Close: DialogClose,
  Trigger: DialogTrigger,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Content: DialogContent,
  ScrollContent: DialogScrollContent,
  Footer: DialogFooter
} as const;

export {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger
};
