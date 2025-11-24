import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-sans",
  {
    variants: {
      variant: {
        primary:
          "bg-app-primary border-[2px] p-[14px] text-app-text-yellow font-bold border-app-primary-border rounded-[14px] hover:bg-app-primary/90 active:scale-[0.99]",
        secondary:
          "bg-app-tertiary border border-transparent p-[12px] text-app-text-grey font-semibold rounded-[14px] hover:bg-app-tertiary/80 hover:border-app-text-grey/50 active:scale-[0.99]",
        ghost: "py-[14px] font-bold text-app-text-yellow active:scale-[0.99]",
        unstyled: "bg-transparent text-app-text-black font-semibold",
      },
      size: {
        default: "",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
