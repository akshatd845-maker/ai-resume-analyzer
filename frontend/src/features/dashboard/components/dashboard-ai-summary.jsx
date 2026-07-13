import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { Card } from '@/components/ui/card'

const RING_SIZE = 96
const STROKE = 7
const R = (RING_SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * R

function SuggestionRing({ total }) {
  const pct = total > 0 ? Math.min((total / 20) * 100, 100) : 0
  const offset = CIRC - (pct / 100) * CIRC

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: RING_SIZE, height: RING_SIZE }}
    >
      <svg
        width={RING_SIZE}
        height={RING_SIZE}
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* Visible track */}
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={R}
          fill="none"
          stroke="var(--border)"
          strokeWidth={STROKE}
        />
        <motion.circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={R}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          initial={{ strokeDashoffset: CIRC }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-[20px] font-bold leading-none text-white tabular-nums">{total}</p>
        <p className="text-[10px] font-medium text-text-secondary mt-0.5">Total</p>
      </div>
    </div>
  )
}

function SuggestionRow({ icon: Icon, label, count, color }) {
  return (
    <div className="flex items-center justify-between rounded-[10px] px-3 py-2 transition-colors hover:bg-white/[0.04]">
      <div className="flex items-center gap-2">
        <Icon className="size-3.5 shrink-0" style={{ color }} aria-hidden="true" />
        <span className="text-[13px] text-text-body">{label}</span>
      </div>
      <span className="text-[13px] font-semibold text-white tabular-nums">{count}</span>
    </div>
  )
}

export function DashboardAiSummary({ data }) {
  const ai = data?.analysis?.latest?.aiAnalysis
  const critical = ai?.weaknesses?.length ?? 0
  const important = ai?.improvementSuggestions?.length ?? 0
  const recommended = ai?.strengths?.length ?? 0
  const total = critical + important + recommended

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="h-full"
    >
      <Card className="p-5 h-full hover:border-border-hover cursor-default">
        <section aria-labelledby="ai-summary-title" className="h-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 id="ai-summary-title" className="text-[15px] font-semibold text-white">
              AI Suggestions
            </h2>
            <Link
              to="/analysis"
              className="text-[12px] font-medium text-primary transition-colors
                         hover:text-primary/80 focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              View All
            </Link>
          </div>

          {/* Ring + breakdown */}
          <div className="mt-5 flex items-center gap-6">
            <SuggestionRing total={total} />
            <div className="flex-1 space-y-1">
              <SuggestionRow icon={AlertCircle} label="Critical" count={critical} color="var(--destructive)" />
              <SuggestionRow icon={Info} label="Important" count={important} color="var(--warning)" />
              <SuggestionRow
                icon={CheckCircle2}
                label="Recommended"
                count={recommended}
                color="var(--success)"
              />
            </div>
          </div>

          {!total ? (
            <p className="mt-4 text-[12px] text-text-secondary">
              Run an analysis to generate AI suggestions.
            </p>
          ) : null}
        </section>
      </Card>
    </motion.div>
  )
}
