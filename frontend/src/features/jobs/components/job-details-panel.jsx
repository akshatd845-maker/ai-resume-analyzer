import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Star, Layers, RefreshCcw, ChevronRight } from 'lucide-react'

import { SkillGapCard } from '@/features/jobs/components/skill-gap-card'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common'
import { Button } from '@/components/ui/button'

function ScoreBar({ label, value }) {
  const pct = value ?? 0
  const color =
    pct >= 80 ? 'bg-success' : pct >= 60 ? 'bg-warning' : 'bg-destructive'

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12px] text-text-secondary">{label}</span>
        <span className="text-[12px] font-semibold text-white tabular-nums">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
    </div>
  )
}

export function JobDetailsPanel({
  job,
  matchPercentage,
  categoryScores,
  matchedSkills,
  missingSkills,
  recommendations,
  onAnalyzeMatchAgain,
  loading,
}) {
  const breakdown = useMemo(() => {
    return [
      { label: 'Skills', value: categoryScores?.skills },
      { label: 'Keywords', value: categoryScores?.keywords },
      { label: 'Experience', value: categoryScores?.experience },
      { label: 'Education', value: categoryScores?.education },
    ].filter((x) => x.value != null)
  }, [categoryScores])

  if (loading) {
    return (
      <aside aria-label="Job details" className="sticky top-6">
        <Card className="p-5 space-y-3">
          {[40, 20, 60, 20, 80].map((w, i) => (
            <Skeleton
              key={i}
              className="h-4"
              style={{ width: `${w}%` }}
            />
          ))}
        </Card>
      </aside>
    )
  }

  if (!job) {
    return (
      <aside aria-label="Job details" className="sticky top-6">
        <EmptyState
          icon={Layers}
          title="No job selected"
          description="Select a recommendation from the list to view detailed analysis."
          className="py-12"
        />
      </aside>
    )
  }

  const matchTone =
    matchPercentage >= 80 ? 'success' : matchPercentage >= 60 ? 'warning' : 'destructive'

  return (
    <aside aria-label="Job details" className="sticky top-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="overflow-hidden p-0 gap-0">
          {/* Header */}
          <div className="p-5 border-b border-border">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-white truncate">
                  {job.title ?? 'Job title not available'}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  {job?.location ? (
                    <span className="flex items-center gap-1 text-[11px] text-text-secondary">
                      <MapPin className="size-3" aria-hidden="true" />
                      {job.location}
                    </span>
                  ) : null}
                  {job?.employmentType ? (
                    <span className="flex items-center gap-1 text-[11px] text-text-secondary">
                      <Clock className="size-3" aria-hidden="true" />
                      {job.employmentType}
                    </span>
                  ) : null}
                </div>
              </div>
              <Badge
                variant={matchTone}
                className="px-3 py-1 text-[13px] font-bold tabular-nums"
              >
                {matchPercentage ?? 0}%
              </Badge>
            </div>

            {job?.experienceLevel ? (
              <Badge
                variant="secondary"
                className="mt-2.5 px-2 py-0.5 text-[11px] font-medium"
              >
                <Star className="size-3 mr-1" aria-hidden="true" />
                {job.experienceLevel}
              </Badge>
            ) : null}
          </div>

          <div className="p-5 space-y-5">
            {/* Match breakdown */}
            {breakdown.length > 0 ? (
              <section aria-label="Match breakdown">
                <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-text-secondary">
                  Match Breakdown
                </p>
                <div className="space-y-3">
                  {breakdown.map((b) => (
                    <ScoreBar key={b.label} label={b.label} value={b.value} />
                  ))}
                </div>
              </section>
            ) : null}

            {/* Skill gap */}
            <SkillGapCard
              matchedSkills={matchedSkills}
              missingSkills={missingSkills}
              requiredSkills={job?.requiredSkills ?? []}
            />

            {/* AI Suggestions */}
            {(recommendations ?? []).length > 0 ? (
              <section aria-label="AI suggestions">
                <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-wider text-text-secondary">
                  AI Suggestions
                </p>
                <div className="space-y-2">
                  {recommendations.map((r, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-xl border border-border bg-card-elevated p-3"
                    >
                      <ChevronRight
                        className="mt-0.5 size-3 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <p className="text-[12px] text-text-secondary leading-relaxed">{r}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Refresh button */}
            <Button
              variant="secondary"
              className="w-full gap-2"
              onClick={onAnalyzeMatchAgain}
              aria-label="Refresh job recommendations"
            >
              <RefreshCcw className="size-3.5" aria-hidden="true" />
              Refresh Recommendations
            </Button>
          </div>
        </Card>
      </motion.div>
    </aside>
  )
}
