import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base
        "h-9 w-full min-w-0 rounded-md px-3 py-1 text-sm outline-none transition-[color,box-shadow]",
        // Colors
        "border border-border bg-card text-white",
        "placeholder:text-text-placeholder",
        // Focus
        "focus-visible:border-primary/70 focus-visible:ring-2 focus-visible:ring-primary/20",
        // Hover
        "hover:border-border-hover",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 disabled:text-[rgba(255,255,255,0.85)]",
        // File input
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white",
        // Invalid
        "aria-invalid:border-[#EF4444] aria-invalid:ring-[#EF4444]/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }

