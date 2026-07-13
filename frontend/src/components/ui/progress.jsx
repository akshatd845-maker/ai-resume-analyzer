import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Progress bar with dynamic color:
 *  0–39%   → red   (#EF4444)
 *  40–59%  → orange (#F97316)
 *  60–79%  → yellow (#F59E0B)
 *  80–100% → green  (#22C55E)
 */
function getProgressColor(value) {
  const v = value ?? 0
  if (v >= 80) return "bg-[#22C55E]"
  if (v >= 60) return "bg-[#F59E0B]"
  if (v >= 40) return "bg-[#F97316]"
  return "bg-[#EF4444]"
}

function Progress({ className, value, ...props }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full",
        "bg-[rgba(255,255,255,0.08)]",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("h-full w-full flex-1 transition-all duration-500", getProgressColor(value))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
