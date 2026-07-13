import { motion } from 'framer-motion'
import { Briefcase, RefreshCcw, ScanSearch, Calendar, FileCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

function KpiCard({ icon: Icon, iconBg, iconColor, label, value, helper, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="h-full"
    >
      <Card className="p-5 h-full hover:border-border-hover cursor-default">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            {/* Label — visible secondary */}
            <p className="text-[11px] font-medium uppercase tracking-wider text-text-secondary">
              {label}
            </p>
            {/* Value — full white, large */}
            <p className="mt-1.5 text-[28px] font-bold leading-none text-white tabular-nums truncate">
              {value}
            </p>
            {helper ? (
              <p className="mt-1.5 text-[11px] text-text-secondary leading-relaxed">{helper}</p>
            ) : null}
          </div>
          <span
            className={`inline-flex size-9 shrink-0 items-center justify-center rounded-[12px] ${iconBg}`}
            aria-hidden="true"
          >
            <Icon className={`size-4 ${iconColor}`} />
          </span>
        </div>
      </Card>
    </motion.div>
  )
}

export function JobsHero({
  resumeLabel,
  totalRecommended,
  avgMatch,
  lastRecommendationDateLabel,
  onRefresh,
  onAnalyzeAnotherResume,
  isRefreshing,
}) {
  const hasData = totalRecommended > 0

  return (
    <section aria-label="Jobs header" className="space-y-6">
      {/* Page title row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
            AI Job Matching
          </p>
          <h1 className="flex items-center gap-2.5 text-[24px] font-bold tracking-tight text-white">
            <Briefcase className="size-6 text-primary" aria-hidden="true" />
            Jobs
          </h1>
          <p className="text-[13px] leading-relaxed text-text-secondary max-w-xl">
            Find AI-powered job recommendations based on your latest resume analysis.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <Button
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh recommendations"
            className="gap-2"
          >
            <RefreshCcw
              className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            {isRefreshing ? 'Refreshing…' : 'Refresh Recommendations'}
          </Button>
          <Button
            variant="secondary"
            onClick={onAnalyzeAnotherResume}
            aria-label="Analyze another resume"
          >
            <ScanSearch className="size-3.5 mr-2" aria-hidden="true" />
            Analyze Another Resume
          </Button>
        </div>
      </div>

      {/* KPI cards — only when data exists */}
      {hasData ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Key metrics">
          <KpiCard
            icon={Briefcase}
            iconBg="bg-primary/15"
            iconColor="text-accent"
            label="Total Job Matches"
            value={totalRecommended ?? 0}
            helper="Personalized AI recommendations"
            delay={0.05}
          />
          <KpiCard
            icon={ScanSearch}
            iconBg="bg-blue-500/15"
            iconColor="text-blue-400"
            label="Average Match Score"
            value={`${avgMatch ?? 0}%`}
            helper="Across all recommended roles"
            delay={0.09}
          />
          <KpiCard
            icon={Calendar}
            iconBg="bg-warning/15"
            iconColor="text-warning"
            label="Last Recommendation"
            value={lastRecommendationDateLabel ?? '—'}
            helper="Most recent match run"
            delay={0.13}
          />
          <KpiCard
            icon={FileCheck}
            iconBg="bg-success/15"
            iconColor="text-success"
            label="Resume Status"
            value={resumeLabel && resumeLabel !== 'Not Available' ? 'Active' : '—'}
            helper={resumeLabel !== 'Not Available' ? resumeLabel : 'No resume uploaded'}
            delay={0.17}
          />
        </div>
      ) : null}
    </section>
  )
}
