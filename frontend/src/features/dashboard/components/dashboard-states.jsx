import { AlertTriangle, FileUp } from 'lucide-react'
import { EmptyState } from '@/components/common'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      {/* Hero */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      {/* Middle row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>

      {/* Job matches + quick actions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-56 rounded-xl" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function DashboardEmptyState({ onUpload }) {
  return (
    <EmptyState
      icon={FileUp}
      title="Upload your first resume"
      description="Start by uploading a resume to unlock AI analysis, ATS scoring, and personalized job matches."
      actionLabel="Upload Resume"
      onAction={onUpload}
    />
  )
}

export function DashboardError({ onRetry, message }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border
                 border-danger/25 bg-card px-8 py-12 text-center"
    >
      {/* Error icon */}
      <span
        className="mb-4 inline-flex size-12 items-center justify-center rounded-full
                   bg-danger/15 border border-danger/25"
        aria-hidden="true"
      >
        <AlertTriangle className="size-5 text-danger" />
      </span>

      {/* Heading */}
      <h2 className="text-[16px] font-semibold text-white">Unable to load dashboard</h2>

      {/* Message */}
      <p className="mt-1.5 max-w-md text-[13px] text-text-secondary">
        {message ?? 'Something went wrong while fetching your dashboard data.'}
      </p>

      {/* Retry button */}
      <Button
        variant="secondary"
        onClick={onRetry}
        className="mt-5"
      >
        Try again
      </Button>
    </div>
  )
}
