import { memo } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock } from 'lucide-react'

import { cn } from '@/lib/utils'
import { getMatchTone, formatMatchPercent } from '@/features/jobs/utils/match-badges'
import { Badge } from '@/components/ui/badge'

function MatchBadge({ matchPercentage }) {
  const tone = getMatchTone(matchPercentage)
  const variant = tone === 'success' ? 'success' : tone === 'warning' ? 'warning' : 'destructive'

  return (
    <Badge
      variant={variant}
      className="px-2.5 py-0.5 text-[11px] font-bold tabular-nums"
      aria-label={`${formatMatchPercent(matchPercentage)} match`}
    >
      {formatMatchPercent(matchPercentage)}
    </Badge>
  )
}

export const JobCard = memo(function JobCard({ job, matchPercentage, isSelected, onSelect }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
    >
      <button
        type="button"
        className={cn(
          'w-full text-left rounded-xl border p-4 transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          isSelected
            ? 'border-primary/50 bg-primary/10 shadow-[0_0_0_1px_rgba(139,92,246,0.3)]'
            : 'border-border bg-card hover:border-border-hover hover:bg-card-elevated hover:shadow-lg',
        )}
        onClick={onSelect}
        aria-label={`View details for ${job?.title ?? 'job'}`}
        aria-pressed={isSelected}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          {/* Company initials avatar */}
          <div className="flex items-start gap-3 min-w-0">
            <span
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-[10px]
                         bg-primary/15 text-[12px] font-bold text-accent select-none"
              aria-hidden="true"
            >
              {(job?.title ?? 'J').slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p
                className="truncate text-[14px] font-semibold text-white"
                title={job?.title}
              >
                {job?.title ?? 'Job title not available'}
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
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
          </div>
          <MatchBadge matchPercentage={matchPercentage} />
        </div>

        {/* Skills */}
        {(job?.requiredSkills ?? []).length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Skills summary">
            {(job.requiredSkills ?? []).slice(0, 3).map((s) => (
              <Badge
                key={s}
                variant="secondary"
                className="rounded-md px-2 py-0.5 text-[11px] font-normal"
              >
                {s}
              </Badge>
            ))}
            {(job?.requiredSkills ?? []).length > 3 ? (
              <span className="text-[11px] text-text-secondary">
                +{(job.requiredSkills ?? []).length - 3} more
              </span>
            ) : null}
          </div>
        ) : null}
      </button>
    </motion.div>
  )
})
