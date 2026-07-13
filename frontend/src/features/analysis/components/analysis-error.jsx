import { AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function AnalysisError({ message, onRetry }) {
  return (
    <Card className="border-destructive/30 shadow-elevation-sm">
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-5" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 className="text-h3">Unable to load analysis</h2>
          <p className="text-small text-text-secondary max-w-md">
            {message ?? 'Something went wrong while fetching resume analysis.'}
          </p>
        </div>
        <Button onClick={onRetry}>Try again</Button>
      </CardContent>
    </Card>
  )
}

