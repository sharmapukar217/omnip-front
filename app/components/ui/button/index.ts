import { type VariantProps, tv } from "tailwind-variants";
export { default as Button } from "./Button.vue";

export const buttonVariants = tv({
  base: [
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
  ],

  variants: {
    variant: {
      default: [
        "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        "focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      ],
      inverted: [
        "bg-foreground text-background shadow-sm hover:bg-foreground/90",
        "focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
      ],
      destructive: [
        "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        "focus:ring-2 focus:ring-destructive focus:ring-offset-2 focus:ring-offset-background"
      ],
      outline: [
        "border border-input bg-background shadow-sm hover:bg-muted hover:text-muted-foreground"
      ],
      secondary: [
        "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        "focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background"
      ],
      ghost: [
        "text-muted-foreground hover:bg-muted hover:text-foreground",
        "focus:ring-2 focus:ring-muted focus:ring-offset-2 focus:ring-offset-background focus:bg-muted"
      ],
      link: "text-primary underline-offset-4 hover:underline"
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3 text-xs",
      lg: "h-11 rounded-md px-8",
      icon: "h-9 w-9"
    },
    noRing: {
      true: "focus:ring-0 focus:ring-offset-0"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    noRing: false
  }
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;
