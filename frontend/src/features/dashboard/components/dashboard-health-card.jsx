import { motion } from 'framer-motion'

import {
  computeCompletion,
  computeHealthScore,
  getResumeStatusLabel,
} from '@/features/dashboard/services/dashboard.service'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

function ProgressRing({ value, label }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative flex size-36 items-center justify-center" role="img" aria-label={`${label}: ${value}%`}>
      <svg className="-rotate-90" width="144" height="144" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-border/50" />
        <motion.circle
          cx="72"
          cy="72"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          className="text-primary"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-h2 font-bold">{value}</p>
        <p className="text-caption text-muted-foreground font-medium">{label}</p>
      </div>
    </div>
  )
}

export function DashboardHealthCard({ analysis, ats }) {
  const extracted = analysis?.latest?.extractedData
  const completion = computeCompletion(extracted)
  const atsScore = ats?.latestScore ?? ats?.result?.overallScore ?? 0
  const healthScore = computeHealthScore({
    atsScore,
    completion,
    analysisStatus: analysis?.status,
  })

  const metrics = [
    { label: 'Completion', value: completion },
    { label: 'ATS score', value: atsScore || '—' },
    { label: 'Status', value: getResumeStatusLabel(analysis?.status) },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      aria-labelledby="health-card-title"
    >
      <Card className="shadow-elevation-md">
        <CardHeader>
          <CardTitle id="health-card-title" className="text-h3">
            Resume health overview
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center">
          <ProgressRing value={healthScore} label="Health" />
          <div className="grid gap-4 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-border bg-card-elevated p-4">
                <p className="text-caption text-text-secondary font-medium">{metric.label}</p>
                <p className={cn('mt-1 text-h3 font-semibold', typeof metric.value === 'number' && 'tabular-nums')}>
                  {typeof metric.value === 'number' ? `${metric.value}%` : metric.value}
                </p>
                {typeof metric.value === 'number' ? (
                  <Progress value={metric.value} className="mt-3 h-1.5" />
                ) : null}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.section>
  )
}
