import { BarChart2, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

import { EmptyState } from '@/components/common'
import { Button } from '@/components/ui/button'

export function AnalysisEmptyState({ onAnalyze }) {
  return (
    <EmptyState
      icon={FileText}
      title="Analysis not available"
      description="Upload and analyze your resume to unlock ATS scoring, insights, and improvement suggestions."
      actionLabel="Analyze Resume"
      onAction={onAnalyze}
      className="min-h-[420px]"
    />
  )
}

export function AnalysisPendingState({ onAnalyze, onBack, isAnalyzing }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-[520px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-20 text-center"
    >
      <div className="mb-6 flex size-16 items-center justify-center rounded-xl border border-primary/25 bg-primary/15">
        <BarChart2 className="size-8 text-primary" aria-hidden="true" />
      </div>

      <h2 className="text-h2 font-semibold tracking-tight text-foreground">
        Analysis Not Available Yet
      </h2>

      <p className="mt-3 max-w-md text-body text-text-secondary">
        Your resume hasn&apos;t been analyzed yet. Run an AI analysis to generate your ATS score,
        strengths, weaknesses and recommendations.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={onAnalyze} disabled={isAnalyzing} size="lg">
          <BarChart2 className={isAnalyzing ? 'size-4 animate-pulse' : 'size-4'} aria-hidden="true" />
          {isAnalyzing ? 'Analyzing…' : 'Run Analysis'}
        </Button>
        {onBack ? (
          <Button variant="outline" size="lg" onClick={onBack}>
            Go Back
          </Button>
        ) : null}
      </div>
    </motion.div>
  )
}

