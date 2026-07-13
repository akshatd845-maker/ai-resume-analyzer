import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bookmark, MapPin } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

function MatchBadge({ pct }) {
  if (pct == null) return null
  const variant = pct >= 80 ? 'success' : pct >= 60 ? 'warning' : 'destructive'
  return (
    <Badge variant={variant} className="px-2.5 py-0.5 text-[11px] font-semibold tabular-nums">
      {pct}%
    </Badge>
  )
}

function WorkTypeBadge({ remote }) {
  return (
    <Badge
      variant={remote ? 'secondary' : 'outline'}
      className={cn(
        'px-2 py-0.5 text-[10px] font-medium',
        remote && 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
      )}
    >
      {remote ? 'Remote' : 'Onsite'}
    </Badge>
  )
}

function CompanyInitials({ name = '' }) {
  const letters = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-primary/15 text-[12px] font-bold text-accent select-none">
      {letters || '?'}
    </span>
  )
}

function JobRow({ match, index }) {
  const company = match.jobTitle ?? match.company ?? match.role ?? 'Company'
  const role = match.jobTitle ?? match.role ?? 'Role'
  const location = match.location ?? 'Remote'
  const isRemote = match.remote ?? location?.toLowerCase().includes('remote')
  const pct = match.matchPercentage

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: 0.12 + index * 0.05 }}
      className="group flex items-center gap-3 rounded-[12px] px-3 py-2.5
                 transition-colors hover:bg-white/[0.04]"
    >
      <CompanyInitials name={company} />

      <div className="min-w-0 flex-1">
        {/* Company name — white, readable */}
        <p className="truncate text-[13px] font-medium text-white">{company}</p>
        <div className="mt-0.5 flex items-center gap-1.5 flex-wrap">
          {/* Role — clearly secondary but not invisible */}
          <span className="text-[11px] text-text-body truncate">{role}</span>
          {location ? (
            <>
              <span className="text-white/20" aria-hidden="true">·</span>
              <span className="flex items-center gap-0.5 text-[11px] text-text-secondary">
                <MapPin className="size-3" aria-hidden="true" />
                {location}
              </span>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <WorkTypeBadge remote={isRemote} />
        <MatchBadge pct={pct} />
        <button
          type="button"
          className="p-1 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100
                     hover:text-primary focus-visible:opacity-100 focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-primary rounded"
          aria-label="Bookmark job"
        >
          <Bookmark className="size-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

export function DashboardJobMatches({ data }) {
  const matches = data?.jobMatching?.bestMatches ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.25 }}
      className="h-full"
    >
      <Card className="p-5 h-full hover:border-border-hover cursor-default">
        <section aria-labelledby="job-matches-title" className="h-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 id="job-matches-title" className="text-[15px] font-semibold text-white">
              Recent Job Matches
            </h2>
            <Link
              to="/jobs"
              className="text-[12px] font-medium text-primary transition-colors
                         hover:text-primary/80 focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              View All
            </Link>
          </div>

          {/* Rows */}
          <div className="mt-3 space-y-0.5">
            {matches.length ? (
              matches.slice(0, 5).map((match, i) => (
                <JobRow key={match.id ?? match._id ?? i} match={match} index={i} />
              ))
            ) : (
              <p className="px-3 py-4 text-[13px] text-text-secondary">
                No job matches yet. Run job matching to see results.
              </p>
            )}
          </div>
        </section>
      </Card>
    </motion.div>
  )
}
