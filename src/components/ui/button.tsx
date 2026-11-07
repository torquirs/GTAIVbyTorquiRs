import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold outline-none transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-neon-cyan/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-neon-cyan/50 bg-neon-cyan text-ink shadow-[0_0_22px_rgba(149,233,223,0.2)] hover:bg-neon-cyan/90 hover:shadow-[0_0_28px_rgba(149,233,223,0.34)] active:scale-[0.98]",
        outline:
          "border border-white/15 bg-white/[0.04] text-white/85 hover:border-neon-cyan/45 hover:bg-white/[0.08] hover:text-white",
        secondary:
          "border border-white/10 bg-white/[0.08] text-white/80 hover:bg-white/[0.13] hover:text-white",
        ghost: "border border-transparent bg-transparent text-white/70 hover:bg-white/[0.08] hover:text-white",
        destructive:
          "border border-red-300/30 bg-red-500/10 text-red-200 hover:bg-red-500/20",
        link: "border border-transparent bg-transparent text-neon-cyan underline-offset-4 hover:underline",
        icon: "grid place-items-center border border-white/30 bg-black/50 text-white backdrop-blur-sm transition-colors hover:border-neon-pink hover:bg-neon-pink",
      },
      size: {
        default: "min-h-10 px-4 py-2 text-xs tracking-[0.14em]",
        sm: "min-h-9 px-3 py-1.5 text-xs",
        lg: "min-h-12 px-6 py-3 text-xs tracking-[0.18em]",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "icon",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "icon",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Component = asChild ? Slot.Root : "button";

  return (
    <Component
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
