import { useMemo, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, Briefcase, Upload, ScanSearch, RefreshCcw } from 'lucide-react'

import { JobsShell } from '@/features/jobs/components/jobs-shell'
import { JobsHero } from '@/features/jobs/components/jobs-hero'
import { MatchSummaryCard } from '@/features/jobs/components/match-summary-card'
import { JobFilters } from '@/features/jobs/components/job-filters'
import { JobGrid } from '@/features/jobs/components/job-grid'
import { JobDetailsPanel } from '@/features/jobs/components/job-details-panel'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common'

import { useJobsMatching } from '@/features/jobs/hooks/use-jobs-matching'
import { useResumes } from '@/features/resume/hooks/use-resumes'

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

/* ── Empty State ──────────────────────────────────────────────── */
function JobsEmptyState({ onRefresh, onUploadResume, isRefreshing, hasResume }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full"
    >
      <EmptyState
        icon={Briefcase}
        title="No Job Recommendations Yet"
        description="Upload and analyze your resume to receive personalized AI-powered job recommendations tailored to your skills and experience."
        action={
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {hasResume ? (
              <Button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCcw
                  className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                {isRefreshing ? 'Analyzing…' : 'Get Recommendations'}
              </Button>
            ) : (
              <Button
                onClick={onUploadResume}
                className="gap-2"
              >
                <Upload className="size-3.5" aria-hidden="true" />
                Upload Resume
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={onUploadResume}
              className="gap-2"
            >
              <ScanSearch className="size-3.5" aria-hidden="true" />
              Analyze Existing Resume
            </Button>
          </div>
        }
      />
    </motion.div>
  )
}

/* ── Filtered empty state ─────────────────────────────────────── */
function FilteredEmptyState({ onReset, onRefresh, isRefreshing }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      <EmptyState
        icon={ScanSearch}
        title="No matches for your filters"
        description="Try adjusting or clearing your filters."
        action={
          <div className="mt-5 flex gap-3">
            <Button
              variant="secondary"
              onClick={onReset}
            >
              Clear Filters
            </Button>
            <Button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCcw
                className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              Refresh
            </Button>
          </div>
        }
      />
    </motion.div>
  )
}

/* ── Error state ──────────────────────────────────────────────── */
function JobsErrorState({ onRetry }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-destructive/20
                 bg-card px-8 py-12 text-center"
    >
      <span
        className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20"
        aria-hidden="true"
      >
        <AlertTriangle className="size-5 text-destructive" />
      </span>
      <p className="text-[16px] font-semibold text-white">
        We couldn&apos;t match your resume to jobs
      </p>
      <p className="mt-1.5 text-[13px] text-text-secondary">Please try again.</p>
      <Button
        variant="secondary"
        onClick={onRetry}
        className="mt-5"
      >
        Retry
      </Button>
    </div>
  )
}

/* ── Loading skeleton ─────────────────────────────────────────── */
function JobsLoadingSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading jobs">
      <div className="space-y-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-14 rounded-xl" />
      <div className="grid gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

/* ── Main page ────────────────────────────────────────────────── */
export function JobsPage() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const { data: resumes = [], isLoading: resumesLoading } = useResumes()

  const defaultResume = useMemo(() => {
    if (!Array.isArray(resumes) || !resumes.length) return null
    return resumes[0] ?? null
  }, [resumes])

  const [selectedResumeId, setSelectedResumeId] = useState(defaultResume?._id ?? null)

  useEffect(() => {
    if (!selectedResumeId && defaultResume?._id) {
      setSelectedResumeId(defaultResume._id)
    }
  }, [defaultResume?._id, selectedResumeId])

  const { matches, totals, isMatching, error, refresh } = useJobsMatching()

  const [selectedJobId, setSelectedJobId] = useState(null)

  const bestMatches = useMemo(() => matches?.bestMatches ?? [], [matches])

  useEffect(() => {
    if (!selectedJobId && bestMatches.length) {
      setSelectedJobId(bestMatches[0]?.job?.id ?? null)
    }
  }, [bestMatches, selectedJobId])

  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [matchScore, setMatchScore] = useState('')
  const [company, setCompany] = useState('')
  const [sort, setSort] = useState('newest')

  const resetFilters = useCallback(() => {
    setSearch('')
    setLocation('')
    setExperienceLevel('')
    setMatchScore('')
    setCompany('')
    setSort('newest')
  }, [])

  const filteredSortedMatches = useMemo(() => {
    let arr = [...bestMatches]

    if (search) {
      const q = search.toLowerCase()
      arr = arr.filter((m) => (m.job?.title ?? '').toLowerCase().includes(q))
    }

    if (location) {
      const q = location.toLowerCase()
      arr = arr.filter((m) => (m.job?.location ?? '').toLowerCase().includes(q))
    }

    if (experienceLevel) {
      arr = arr.filter((m) => (m.job?.experienceLevel ?? '') === experienceLevel)
    }

    if (matchScore) {
      if (matchScore === 'high') arr = arr.filter((m) => (m.matchPercentage ?? 0) >= 80)
      if (matchScore === 'medium')
        arr = arr.filter(
          (m) => (m.matchPercentage ?? 0) >= 60 && (m.matchPercentage ?? 0) < 80,
        )
      if (matchScore === 'low') arr = arr.filter((m) => (m.matchPercentage ?? 0) < 60)
    }

    // company field is UI-only (not in backend schema) — skip filtering

    if (sort === 'highest') {
      arr.sort((a, b) => (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0))
    } else if (sort === 'alphabetical') {
      arr.sort((a, b) => (a.job?.title ?? '').localeCompare(b.job?.title ?? ''))
    }

    return arr
  }, [bestMatches, search, location, experienceLevel, matchScore, sort])

  const selectedMatch = useMemo(() => {
    if (!selectedJobId) return null
    return bestMatches.find((m) => m.job?.id === selectedJobId) ?? null
  }, [bestMatches, selectedJobId])

  const handleRefresh = useCallback(() => {
    refresh(selectedResumeId)
  }, [refresh, selectedResumeId])

  useEffect(() => {
    if (selectedResumeId) {
      refresh(selectedResumeId)
    }
  }, [refresh, selectedResumeId])

  const resumeLabel = defaultResume?.originalFileName ?? 'Not Available'

  const lastRecommendationDateLabel = useMemo(() => '—', [])

  const hasResume = Boolean(selectedResumeId)
  const hasAnyMatches = bestMatches.length > 0
  const isFiltered =
    Boolean(search) ||
    Boolean(location) ||
    Boolean(experienceLevel) ||
    Boolean(matchScore) ||
    Boolean(company) ||
    sort !== 'newest'
  const filteredIsEmpty = filteredSortedMatches.length === 0

  if (resumesLoading) {
    return (
      <JobsShell>
        <JobsLoadingSkeleton />
      </JobsShell>
    )
  }

  if (error) {
    return (
      <JobsShell>
        <JobsErrorState onRetry={handleRefresh} />
      </JobsShell>
    )
  }

  return (
    <JobsShell>
      <div className="space-y-6">
        {/* Page header with KPI cards (KPIs only shown when data exists) */}
        <JobsHero
          resumeLabel={resumeLabel}
          totalRecommended={bestMatches.length}
          avgMatch={totals?.avgMatch ?? 0}
          lastRecommendationDateLabel={lastRecommendationDateLabel}
          onRefresh={handleRefresh}
          onAnalyzeAnotherResume={() => navigate('/resumes')}
          isRefreshing={isMatching}
        />

        {/* Analytics row — only shown when there are matches */}
        {hasAnyMatches ? (
          <MatchSummaryCard
            totals={totals}
            bestMatchPercentage={totals?.bestMatch ?? 0}
          />
        ) : null}

        {/* No data at all — show full empty state */}
        {!isMatching && !hasAnyMatches ? (
          <JobsEmptyState
            onRefresh={handleRefresh}
            onUploadResume={() => navigate('/resumes')}
            isRefreshing={isMatching}
            hasResume={hasResume}
          />
        ) : (
          <>
            {/* Filters — only show when there are matches */}
            {hasAnyMatches ? (
              <JobFilters
                search={search}
                onSearchChange={setSearch}
                location={location}
                onLocationChange={setLocation}
                experienceLevel={experienceLevel}
                onExperienceLevelChange={setExperienceLevel}
                matchScore={matchScore}
                onMatchScoreChange={setMatchScore}
                company={company}
                onCompanyChange={setCompany}
                sort={sort}
                onSortChange={setSort}
                onReset={resetFilters}
              />
            ) : null}

            {/* Filtered empty */}
            {hasAnyMatches && filteredIsEmpty && isFiltered ? (
              <FilteredEmptyState
                onReset={resetFilters}
                onRefresh={handleRefresh}
                isRefreshing={isMatching}
              />
            ) : null}

            {/* Results grid */}
            {!filteredIsEmpty ? (
              <div className={isMobile ? 'space-y-6' : 'grid gap-6 xl:grid-cols-[1fr_360px]'}>
                <div>
                  <JobGrid
                    matches={filteredSortedMatches}
                    selectedJobId={selectedJobId}
                    onSelectJob={setSelectedJobId}
                  />
                </div>
                <div>
                  <JobDetailsPanel
                    job={selectedMatch?.job ?? null}
                    matchPercentage={selectedMatch?.matchPercentage ?? 0}
                    categoryScores={selectedMatch?.categoryScores ?? null}
                    matchedSkills={selectedMatch?.matchedSkills ?? []}
                    missingSkills={selectedMatch?.missingSkills ?? []}
                    recommendations={selectedMatch?.recommendations ?? []}
                    onAnalyzeMatchAgain={handleRefresh}
                    loading={isMatching}
                  />
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </JobsShell>
  )
}
