import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

import { ResumeHero, ResumeQuickStats } from '@/features/resume/components/resume-hero'
import { ResumeList } from '@/features/resume/components/resume-list'
import {
  ResumePreviewPanel,
  ResumePreviewSheet,
} from '@/features/resume/components/resume-preview-panel'
import {
  ResumeEmptyState,
  ResumeError,
  ResumeSkeleton,
} from '@/features/resume/components/resume-states'
import { ResumeUploadZone } from '@/features/resume/components/resume-upload-zone'
import {
  useEnrichedResumes,
  useResumeMutations,
} from '@/features/resume/hooks/use-resumes'
import { ConfirmDialog, ContentContainer, PageContainer } from '@/components/common'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

function useIsMobile(breakpoint = 1280) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint,
  )

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const handler = (e) => setIsMobile(e.matches)
    media.addEventListener('change', handler)
    setIsMobile(media.matches)
    return () => media.removeEventListener('change', handler)
  }, [breakpoint])

  return isMobile
}

export function ResumePage() {
  const uploadRef = useRef(null)
  const isMobile = useIsMobile()

  const {
    resumes,
    enriched,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    analysesLoading,
  } = useEnrichedResumes()

  const { upload, remove, replace, analyze } = useResumeMutations()

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedId, setSelectedId] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [replaceTarget, setReplaceTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [analyzingId, setAnalyzingId] = useState(null)

  const selectedResume = enriched.find((r) => r.id === selectedId) ?? null

  useEffect(() => {
    if (!selectedId && enriched.length > 0) {
      setSelectedId(enriched[0].id)
    }
  }, [enriched, selectedId])

  useEffect(() => {
    if (selectedId && !enriched.find((r) => r.id === selectedId)) {
      setSelectedId(enriched[0]?.id ?? null)
    }
  }, [enriched, selectedId])

  const scrollToUpload = useCallback(() => {
    uploadRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleUpload = useCallback(
    async ({ file, onProgress }) => {
      await upload.mutateAsync({ file, onProgress })
    },
    [upload],
  )

  const handleReplace = useCallback(
    async ({ oldId, file, onProgress }) => {
      const newResume = await replace.mutateAsync({ oldId, file, onProgress })
      setReplaceTarget(null)
      setSelectedId(newResume._id)
    },
    [replace],
  )

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    try {
      await remove.mutateAsync(deleteTarget.id)
      toast.success('Resume deleted')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to delete resume')
    }
  }, [deleteTarget, remove])

  const handleAnalyze = useCallback(
    async (resume) => {
      setAnalyzingId(resume.id)
      try {
        await analyze.mutateAsync(resume.id)
        toast.success('Analysis complete')
      } catch (err) {
        toast.error(err?.response?.data?.message ?? 'Analysis failed')
      } finally {
        setAnalyzingId(null)
      }
    },
    [analyze],
  )

  const handleSelect = useCallback(
    (resume) => {
      setSelectedId(resume.id)
      if (isMobile) setPreviewOpen(true)
    },
    [isMobile],
  )

  const handleView = useCallback(
    (resume) => {
      setSelectedId(resume.id)
      if (isMobile) setPreviewOpen(true)
    },
    [isMobile],
  )

  const handlePreview = useCallback(
    (resume) => {
      setSelectedId(resume.id)
      setPreviewOpen(true)
    },
    [],
  )

  if (isLoading) {
    return (
      <PageContainer>
        <ResumeSkeleton />
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer>
        <ResumeError onRetry={() => refetch()} message={error?.response?.data?.message} />
      </PageContainer>
    )
  }

  const hasResumes = resumes.length > 0

  return (
    <PageContainer>
      <ContentContainer>
        {!hasResumes ? (
          <div className="space-y-8">
            <ResumeHero
              resumes={[]}
              enriched={[]}
              onUpload={scrollToUpload}
              onRefresh={() => refetch()}
              isRefreshing={isFetching}
            />
            <div ref={uploadRef}>
              <ResumeUploadZone onUpload={handleUpload} onReplace={handleReplace} />
            </div>
            <ResumeEmptyState onUpload={scrollToUpload} />
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
            <ResumeHero
              resumes={resumes}
              enriched={enriched}
              onUpload={scrollToUpload}
              onRefresh={() => refetch()}
              isRefreshing={isFetching || analysesLoading}
            />

            <div className="grid gap-6 xl:grid-cols-[280px_1fr_340px]">
              <aside className="space-y-4" ref={uploadRef} aria-label="Upload and stats">
                <ResumeUploadZone
                  onUpload={handleUpload}
                  onReplace={handleReplace}
                  replaceTarget={replaceTarget}
                  onCancelReplace={() => setReplaceTarget(null)}
                  compact
                />
                <ResumeQuickStats resumes={resumes} enriched={enriched} />
              </aside>

              <main aria-label="Resume library">
                <ResumeList
                  resumes={resumes}
                  enriched={enriched}
                  search={search}
                  sort={sort}
                  statusFilter={statusFilter}
                  viewMode={viewMode}
                  onSearchChange={setSearch}
                  onSortChange={setSort}
                  onStatusFilterChange={setStatusFilter}
                  onViewModeChange={setViewMode}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                  onView={handleView}
                  onPreview={handlePreview}
                  onAnalyze={handleAnalyze}
                  onReplace={(resume) => {
                    setReplaceTarget(resume)
                    scrollToUpload()
                  }}
                  onDelete={(resume) => setDeleteTarget(resume)}
                  analyzingId={analyzingId}
                />
              </main>

              <ResumePreviewPanel
                resume={selectedResume}
                onAnalyze={handleAnalyze}
                isAnalyzing={analyzingId === selectedId}
              />
            </div>
          </motion.div>
        )}

        <ResumePreviewSheet
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          resume={selectedResume}
          onAnalyze={handleAnalyze}
          isAnalyzing={analyzingId === selectedId}
        />

        <ConfirmDialog
          open={Boolean(deleteTarget)}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title="Delete resume"
          description={`Are you sure you want to delete "${deleteTarget?.originalFileName}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          destructive
        />
      </ContentContainer>
    </PageContainer>
  )
}
