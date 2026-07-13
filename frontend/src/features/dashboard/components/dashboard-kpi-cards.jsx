import { motion } from 'framer-motion'
import { BarChart2, Briefcase, FileText, User } from 'lucide-react'

import { computeCompletion } from '@/features/dashboard/services/dashboard.service'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/* Small decorative sparkline (pure SVG) */
function Sparkline({ color = '#22C55E', className }) {
  return (
    <svg
      viewBox="0 0 64 24"
      className={cn('h-6 w-16', className)}
      aria-hidden="true"
      fill="none"
    >
      <polyline
        points="0,18 10,12 20,16 32,6 44,10 54,4 64,8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  )
}

/* Circular progress ring for profile completion */
function MiniRing({ value, size = 40, stroke = 4 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="-rotate-90"
      aria-hidden="true"
    >
      {/* Visible track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth={stroke}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#22C55E"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
      />
    </svg>
  )
}

function KpiCard({ delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="h-full"
    >
      <Card className="p-5 h-full hover:border-border-hover cursor-default">
        {children}
      </Card>
    </motion.div>
  )
}

export function DashboardKpiCards({ data }) {
  const atsScore = data?.ats?.latestScore ?? data?.ats?.result?.overallScore ?? 0
  const totalResumes = data?.resume?.total ?? 0
  const recentUploads = data?.resume?.recentUploads ?? 0
  const jobMatches = data?.jobMatching?.totalMatches ?? 0
  const extracted = data?.analysis?.latest?.extractedData
  const completion = computeCompletion(extracted)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Card 1 — Resume Score */}
      <KpiCard delay={0.05}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12px] font-medium text-text-secondary">Resume Score</p>
            <p className="mt-2 text-[34px] font-bold leading-none text-white tabular-nums">
              {atsScore || '—'}
            </p>
          </div>
          <span className="inline-flex size-9 items-center justify-center rounded-[12px] bg-success/15">
            <BarChart2 className="size-4 text-success" aria-hidden="true" />
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Badge variant="success" className="px-2 py-0.5 text-[11px] font-semibold">
            ● Excellent
          </Badge>
          <Sparkline color="#22C55E" />
        </div>
      </KpiCard>

      {/* Card 2 — Total Resumes */}
      <KpiCard delay={0.09}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12px] font-medium text-text-secondary">Total Resumes</p>
            <p className="mt-2 text-[34px] font-bold leading-none text-white tabular-nums">
              {totalResumes}
            </p>
          </div>
          <span className="inline-flex size-9 items-center justify-center rounded-[12px] bg-primary/15">
            <FileText className="size-4 text-accent" aria-hidden="true" />
          </span>
        </div>
        <div className="mt-3">
          <p className="text-[12px] text-text-secondary">
            {recentUploads > 0 ? `+${recentUploads} this month` : 'No uploads this month'}
          </p>
        </div>
      </KpiCard>

      {/* Card 3 — Job Matches */}
      <KpiCard delay={0.13}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12px] font-medium text-text-secondary">Job Matches</p>
            <p className="mt-2 text-[34px] font-bold leading-none text-white tabular-nums">
              {jobMatches}
            </p>
          </div>
          <span className="inline-flex size-9 items-center justify-center rounded-[12px] bg-success/15">
            <Briefcase className="size-4 text-success" aria-hidden="true" />
          </span>
        </div>
        <div className="mt-3">
          <p className="text-[12px] text-text-secondary">
            {jobMatches > 0 ? 'Roles matched to your profile' : 'Run job matching to see results'}
          </p>
        </div>
      </KpiCard>

      {/* Card 4 — Profile Completion */}
      <KpiCard delay={0.17}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12px] font-medium text-text-secondary">Profile Completion</p>
            <p className="mt-2 text-[34px] font-bold leading-none text-white tabular-nums">
              {completion}%
            </p>
          </div>
          <MiniRing value={completion} />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Badge
            variant={completion >= 80 ? 'success' : completion >= 50 ? 'warning' : 'destructive'}
            className="px-2 py-0.5 text-[11px] font-semibold"
          >
            ●{' '}
            {completion >= 80 ? 'Almost Ready' : completion >= 50 ? 'In Progress' : 'Incomplete'}
          </Badge>
          <User className="size-3.5 text-text-secondary" aria-hidden="true" />
        </div>
      </KpiCard>
    </div>
  )
}
