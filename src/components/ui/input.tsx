import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-lg border border-white/15 bg-black/25 px-3 py-2 text-sm text-white shadow-inner shadow-black/20 outline-none transition-[border-color,box-shadow] placeholder:text-white/30 focus-visible:border-neon-cyan/70 focus-visible:ring-2 focus-visible:ring-neon-cyan/25 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-400/70 aria-invalid:ring-2 aria-invalid:ring-red-400/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
