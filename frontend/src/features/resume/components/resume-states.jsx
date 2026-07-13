import { AlertCircle, FileText } from 'lucide-react'

import { EmptyState } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ResumeSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading resumes">
      <div className="space-y-3">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96 max-w-full" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[280px_1fr_340px]">
        <Skeleton className="h-96 rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        </div>
        <Skeleton className="hidden h-96 rounded-xl xl:block" />
      </div>
    </div>
  )
}

export function ResumeEmptyState({ onUpload }) {
  return (
    <EmptyState
      icon={FileText}
      title="Your resume library is empty"
      description="Upload a PDF resume to unlock AI analysis, ATS scoring, and personalized job matching. Your documents are stored securely."
      actionLabel="Upload your first resume"
      onAction={onUpload}
      className="min-h-[420px]"
    />
  )
}

export function ResumeError({ onRetry, message }) {
  return (
    <Card className="border-destructive/30 shadow-elevation-sm">
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-5" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 className="text-h3">Unable to load resumes</h2>
          <p className="text-small text-text-secondary max-w-md">
            {message ?? 'Something went wrong while fetching your resume library.'}
          </p>
        </div>
        <Button onClick={onRetry}>Try again</Button>
      </CardContent>
    </Card>
  )
}
