import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  [
    "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-xl border px-4 py-3 text-sm",
    "has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3",
    "[&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border-border bg-card-elevated text-text-body",
        destructive:
          "border-[#EF4444]/25 bg-[#EF4444]/10 text-[#EF4444] *:data-[slot=alert-description]:text-[#EF4444]/85",
        warning:
          "border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#F59E0B] *:data-[slot=alert-description]:text-[#F59E0B]/85",
        success:
          "border-[#22C55E]/25 bg-[#22C55E]/10 text-[#22C55E] *:data-[slot=alert-description]:text-[#22C55E]/85",
        info:
          "border-[#8B5CF6]/25 bg-[#8B5CF6]/10 text-[#A78BFA] *:data-[slot=alert-description]:text-[#A78BFA]/85",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({ className, variant, ...props }) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 line-clamp-1 min-h-4 font-semibold tracking-tight", className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm opacity-85 [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
