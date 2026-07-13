import * as React from "react"
import { cva } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-semibold whitespace-nowrap",
    "transition-all duration-150 outline-none",
    "focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/70 focus-visible:ring-offset-1 focus-visible:ring-offset-card",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 disabled:text-[rgba(255,255,255,0.85)]",
    "active:scale-[0.98]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-sm hover:from-[#7C3AED] hover:to-[#6D28D9] hover:shadow-[0_4px_14px_rgba(139,92,246,0.4)] active:scale-[0.98]",
        destructive:
          "bg-[#EF4444] text-white hover:bg-[#DC2626] hover:shadow-[0_4px_14px_rgba(239,68,68,0.3)]",
        outline:
          "border border-[rgba(255,255,255,0.12)] bg-transparent text-[rgba(255,255,255,0.90)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.20)]",
        secondary:
          "border border-[rgba(255,255,255,0.12)] bg-card text-white hover:bg-card-elevated hover:border-[rgba(255,255,255,0.20)]",
        ghost:
          "bg-transparent text-[rgba(255,255,255,0.75)] hover:bg-[rgba(255,255,255,0.06)] hover:text-white",
        link:
          "bg-transparent text-[#A78BFA] underline-offset-4 hover:underline hover:text-[#C4B5FD]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-10 rounded-lg px-6 text-base has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({ className, variant = "default", size = "default", asChild = false, ...props }) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

