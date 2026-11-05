import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: "icon";
}

/**
 * Shared accessible button primitive for gallery controls.
 */
export function Button({
  className,
  type = "button",
  variant = "icon",
  ...props
}: ButtonProps) {
  const variantClassName =
    variant === "icon"
      ? "grid place-items-center border border-white/30 bg-black/50 text-white backdrop-blur-sm transition-colors hover:border-neon-pink hover:bg-neon-pink"
      : "";

  return (
    <button
      className={cn(variantClassName, className)}
      type={type}
      {...props}
    />
  );
}
