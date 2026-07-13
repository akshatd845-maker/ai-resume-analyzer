import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export function LoadingState({ rows = 3, className, ...props }) {
  return (
    <div className={cn('space-y-4', className)} {...props} aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
