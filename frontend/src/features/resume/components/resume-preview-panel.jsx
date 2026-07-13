import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, ExternalLink, FileText, HardDrive, RefreshCw, Sparkles } from 'lucide-react'

import {
  fetchResumeFileBlob,
  getAnalysisStatusLabel,
  getAnalysisStatusVariant,
  isProtectedResumeUrl,
} from '@/features/resume/services/resume.service'
import { ResumeAnalysisPanel } from '@/features/resume/components/resume-analysis-panel'
import { formatBytes, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

function useResumePreviewSrc(resume) {
  const [previewSrc, setPreviewSrc] = useState(null)

  useEffect(() => {
    if (!resume) {
      setPreviewSrc(null)
      return undefined
    }

    let blobUrl = null
    let cancelled = false

    async function load() {
      if (isProtectedResumeUrl(resume.secureUrl)) {
        try {
          blobUrl = await fetchResumeFileBlob(resume.id ?? resume._id)
          if (!cancelled) setPreviewSrc(blobUrl)
        } catch {
          if (!cancelled) setPreviewSrc(null)
        }
      } else if (resume.secureUrl) {
        setPreviewSrc(resume.secureUrl)
      } else {
        setPreviewSrc(null)
      }
    }

    load()

    return () => {
      cancelled = true
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [resume])

  return previewSrc
}

function PreviewContent({ resume, onAnalyze, isAnalyzing, className }) {
  const previewSrc = useResumePreviewSrc(resume)
  const [tab, setTab] = useState('preview')

  // Reset to preview tab when resume changes
  useEffect(() => { setTab('preview') }, [resume?.id])

  if (!resume) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center',
          className,
        )}
      >
        <FileText className="mb-3 size-10 text-text-secondary" aria-hidden="true" />
        <p className="text-small font-medium">No resume selected</p>
        <p className="mt-1 text-caption text-text-secondary">
          Select a resume from the library to preview it here.
        </p>
      </div>
    )
  }

  const hasAnalysis = resume.aiAnalysis != null || resume.atsResults != null

  return (
    <motion.div
      key={resume.id}
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('flex flex-col gap-4', className)}
    >
      {/* Header */}
      <div className="space-y-1">
        <h3 className="truncate text-small font-semibold" title={resume.originalFileName}>
          {resume.originalFileName}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge
            status={getAnalysisStatusVariant(resume.analysisStatus)}
            label={getAnalysisStatusLabel(resume.analysisStatus)}
          />
          {resume.atsScore != null ? (
            <span className="text-caption font-medium tabular-nums">ATS {resume.atsScore}%</span>
          ) : null}
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex rounded-lg border border-border bg-muted/30 p-0.5" role="tablist" aria-label="Resume panel tabs">
        <button
          role="tab"
          aria-selected={tab === 'preview'}
          type="button"
          onClick={() => setTab('preview')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-caption font-medium transition-colors',
            tab === 'preview'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-text-secondary hover:text-foreground',
          )}
        >
          <FileText className="size-3.5" aria-hidden="true" />
          Preview
        </button>
        <button
          role="tab"
          aria-selected={tab === 'analysis'}
          type="button"
          onClick={() => setTab('analysis')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-caption font-medium transition-colors',
            tab === 'analysis'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-text-secondary hover:text-foreground',
          )}
        >
          <Sparkles className="size-3.5" aria-hidden="true" />
          Analysis
          {hasAnalysis && (
            <span className="size-1.5 rounded-full bg-[#8B5CF6]" aria-label="Has analysis" />
          )}
        </button>
      </div>

      {tab === 'preview' && (
        <>
          <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
            {previewSrc ? (
              <iframe
                src={`${previewSrc}#toolbar=0&navpanes=0`}
                title={`Preview of ${resume.originalFileName}`}
                className="h-[min(420px,50vh)] w-full bg-white"
              />
            ) : (
              <div className="flex h-[min(200px,30vh)] items-center justify-center text-caption text-text-secondary">
                Preview unavailable
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-caption font-semibold uppercase tracking-wider text-text-secondary/70">
              File metadata
            </h4>
            <dl className="grid gap-2 text-caption">
              <div className="flex items-center gap-2">
                <Calendar className="size-3.5 shrink-0 text-text-secondary" aria-hidden="true" />
                <dt className="text-text-secondary">Uploaded</dt>
                <dd className="ml-auto font-medium">{formatDate(resume.uploadedAt)}</dd>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="size-3.5 shrink-0 text-text-secondary" aria-hidden="true" />
                <dt className="text-text-secondary">Size</dt>
                <dd className="ml-auto font-medium">{formatBytes(resume.fileSize)}</dd>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="size-3.5 shrink-0 text-text-secondary" aria-hidden="true" />
                <dt className="text-text-secondary">Type</dt>
                <dd className="ml-auto font-medium">PDF</dd>
              </div>
            </dl>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-caption font-semibold uppercase tracking-wider text-text-secondary/70">
              Upload history
            </h4>
            <ul className="space-y-2 text-caption">
              <li className="flex items-center justify-between rounded-md bg-card-elevated px-3 py-2">
                <span className="text-text-body">Initial upload</span>
                <span className="text-text-secondary">{formatDate(resume.uploadedAt)}</span>
              </li>
              {resume.analyzedAt ? (
                <li className="flex items-center justify-between rounded-md bg-card-elevated px-3 py-2">
                  <span className="text-text-body">Last analyzed</span>
                  <span className="text-text-secondary">{formatDate(resume.analyzedAt)}</span>
                </li>
              ) : null}
            </ul>
          </div>
        </>
      )}

      {tab === 'analysis' && (
        <ResumeAnalysisPanel resume={resume} />
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => onAnalyze(resume)}
          disabled={isAnalyzing}
          className="flex-1"
        >
          <RefreshCw className={cn('size-4', isAnalyzing && 'animate-spin')} />
          {isAnalyzing ? 'Analyzing…' : 'Analyze'}
        </Button>
        <Button size="sm" variant="outline" asChild={!isProtectedResumeUrl(resume.secureUrl)}>
          {isProtectedResumeUrl(resume.secureUrl) ? (
            <button
              type="button"
              onClick={async () => {
                try {
                  const blobUrl = await fetchResumeFileBlob(resume.id ?? resume._id)
                  window.open(blobUrl, '_blank', 'noopener,noreferrer')
                  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000)
                } catch {
                  // ignore
                }
              }}
            >
              <ExternalLink className="size-4" />
              Open
            </button>
          ) : (
            <a href={resume.secureUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" />
              Open
            </a>
          )}
        </Button>
      </div>
    </motion.div>
  )
}

export function ResumePreviewPanel({
  resume,
  onAnalyze,
  isAnalyzing,
  className,
}) {
  return (
    <Card
      className={cn('sticky top-24 hidden shadow-elevation-sm xl:flex xl:flex-col', className)}
      aria-label="Resume preview panel"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-h3">Preview</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ScrollArea className="h-[calc(100vh-12rem)] pr-3">
          <PreviewContent resume={resume} onAnalyze={onAnalyze} isAnalyzing={isAnalyzing} />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export function ResumePreviewSheet({
  open,
  onOpenChange,
  resume,
  onAnalyze,
  isAnalyzing,
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto sm:max-w-full">
        <SheetHeader>
          <SheetTitle>Resume preview</SheetTitle>
          <SheetDescription>
            {resume?.originalFileName ?? 'View resume details and PDF preview'}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 px-4 pb-6">
          <PreviewContent resume={resume} onAnalyze={onAnalyze} isAnalyzing={isAnalyzing} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
