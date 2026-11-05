import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type CardProps = HTMLAttributes<HTMLDivElement>;

/**
 * Shared surface primitive for framed, overflow-clipped content.
 */
export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-white/20 bg-ink shadow-2xl shadow-black/40",
        className,
      )}
      {...props}
    />
  );
}
