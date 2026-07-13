import { motion } from 'framer-motion'
import { Download, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common'

import { getAnalysisStatusLabel, getAnalysisStatusVariant } from '@/features/resume/services/resume.service'

export function AnalysisHeader({
  resume,
  onAnalyzeAgain,
  isAnalyzing,
  onDownloadReport,
  disableDownload,
}) {
  if (!resume) return null

  const status = resume.analysisStatus ?? 'none'

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl border border-border bg-card p-6 shadow-elevation-sm"
      aria-labelledby="analysis-header-title"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 id="analysis-header-title" className="text-h1">
            Resume Analysis
          </h1>
          <p className="text-body text-muted-foreground max-w-2xl">
            {resume.originalFileName}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StatusBadge
              status={getAnalysisStatusVariant(status)}
              label={getAnalysisStatusLabel(status)}
            />
            <span className="text-caption text-muted-foreground">
              Last analyzed: <span className="font-medium text-foreground">{resume.analyzedAt ? new Date(resume.analyzedAt).toLocaleString() : '—'}</span>
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="rounded-lg border border-border bg-card-elevated px-4 py-2.5">
              <p className="text-[11px] font-medium text-text-secondary">Current ATS Score</p>
              <p className="text-h2 font-bold tabular-nums">{resume.atsScore == null ? '—' : `${Math.round(resume.atsScore)}%`}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Button onClick={onAnalyzeAgain} disabled={isAnalyzing}>
            <RefreshCw className={isAnalyzing ? 'size-4 animate-spin' : 'size-4'} />
            {isAnalyzing ? 'Analyzing…' : 'Analyze Again'}
          </Button>
          {disableDownload ? (
            <Button variant="outline" disabled>
              <Download className="size-4" />
              Download Report
            </Button>
          ) : (
            <Button variant="outline" onClick={onDownloadReport}>
              <Download className="size-4" />
              Download Report
            </Button>
          )}
        </div>
      </div>
    </motion.section>
  )
}

