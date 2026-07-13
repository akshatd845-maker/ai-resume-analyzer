import { Skeleton } from '@/components/ui/skeleton'

export function AnalysisSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading resume analysis">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Skeleton className="h-12 w-72" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-44" />
          <Skeleton className="h-[70vh] rounded-xl" />
        </div>
      </div>
    </div>
  )
}

