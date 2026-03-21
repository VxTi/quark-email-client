import type React from "react";
import type { ComponentProps } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring/30 cursor-pointer disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-muted text-muted-foreground hover:bg-muted/80",
        ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-2",
        sm: "px-3 py-1.5 text-xs",
        lg: "px-6 py-3 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type Props = ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

export default function Button({ className, variant, size, ...props }: Props) {
  return <button className={twMerge(buttonVariants({ variant, size }), className)} {...props} />;
}
