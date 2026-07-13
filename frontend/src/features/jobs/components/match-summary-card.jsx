import { motion } from 'framer-motion'
import { TrendingUp, Target, Zap, AlertTriangle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'

function SummaryPill({ icon: Icon, iconColor, iconBg, label, value, valueColor, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay }}
      className="h-full"
    >
      <Card className="flex items-center gap-3 px-4 py-3.5 hover:border-border-hover h-full cursor-default">
        <span
          className={cn('inline-flex size-8 shrink-0 items-center justify-center rounded-[10px]', iconBg)}
          aria-hidden="true"
        >
          <Icon className={cn('size-3.5', iconColor)} />
        </span>
        <div className="min-w-0">
          {/* Label — clearly readable */}
          <p className="text-[11px] text-text-secondary">{label}</p>
          {/* Value — prominent */}
          <p className={cn('text-[18px] font-bold leading-tight tabular-nums', valueColor ?? 'text-white')}>
            {value}
          </p>
        </div>
      </Card>
    </motion.div>
  )
}

export function MatchSummaryCard({ totals, bestMatchPercentage }) {
  const hasData =
    (bestMatchPercentage ?? 0) > 0 ||
    (totals?.avgMatch ?? 0) > 0 ||
    (totals?.highMatchCount ?? 0) > 0 ||
    (totals?.lowMatchCount ?? 0) > 0

  if (!hasData) return null

  return (
    <section aria-label="Resume match summary">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryPill
          icon={Target}
          iconBg="bg-success/15"
          iconColor="text-success"
          label="Best Match"
          value={`${bestMatchPercentage ?? 0}%`}
          valueColor="text-success"
          delay={0.04}
        />
        <SummaryPill
          icon={TrendingUp}
          iconBg="bg-blue-500/15"
          iconColor="text-blue-400"
          label="Average Match"
          value={`${totals?.avgMatch ?? 0}%`}
          delay={0.08}
        />
        <SummaryPill
          icon={Zap}
          iconBg="bg-primary/15"
          iconColor="text-accent"
          label="High Matches (80%+)"
          value={totals?.highMatchCount ?? 0}
          delay={0.12}
        />
        <SummaryPill
          icon={AlertTriangle}
          iconBg="bg-destructive/15"
          iconColor="text-destructive"
          label="Low Matches (<60%)"
          value={totals?.lowMatchCount ?? 0}
          delay={0.16}
        />
      </div>
    </section>
  )
}
