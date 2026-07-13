import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-[rgba(255,255,255,0.06)]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
