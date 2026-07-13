import * as React from "react"
import { cva } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#8B5CF6] text-white [a&]:hover:bg-[#7C3AED]",
        secondary:
          "border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.07)] text-[rgba(255,255,255,0.85)] [a&]:hover:bg-[rgba(255,255,255,0.12)]",
        destructive:
          "border-[#EF4444]/30 bg-[#EF4444]/15 text-[#EF4444] [a&]:hover:bg-[#EF4444]/25",
        success:
          "border-[#22C55E]/30 bg-[#22C55E]/15 text-[#22C55E]",
        warning:
          "border-[#F59E0B]/30 bg-[#F59E0B]/15 text-[#F59E0B]",
        outline:
          "border-[rgba(255,255,255,0.14)] bg-transparent text-[rgba(255,255,255,0.85)] [a&]:hover:bg-[rgba(255,255,255,0.07)]",
        ghost:
          "border-transparent bg-transparent text-[rgba(255,255,255,0.75)] [a&]:hover:bg-[rgba(255,255,255,0.07)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant = "default", asChild = false, ...props }) {
  const Comp = asChild ? Slot.Root : "span"
  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
