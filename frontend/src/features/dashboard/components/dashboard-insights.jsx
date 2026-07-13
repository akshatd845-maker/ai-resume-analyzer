import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, BarChart as BarChartIcon, Minus } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function InsightCard({ title, items, variant = 'default' }) {
  return (
    <Card className="shadow-elevation-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-small font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items?.length ? (
          items.slice(0, 4).map((item) => (
            <div
              key={item}
              className="rounded-lg border border-border bg-card-elevated px-3 py-2 text-small text-text-body"
            >
              {item}
            </div>
          ))
        ) : (
          <p className="text-caption text-text-secondary">No data available yet.</p>
        )}
        {variant === 'recommendation' && items?.[0] ? (
          <Badge variant="secondary" className="mt-2">
            Top recommendation
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  )
}

function TrendIndicator({ current, previous }) {
  if (current == null || previous == null) {
    return (
      <span className="inline-flex items-center gap-1 text-caption text-muted-foreground">
        <Minus className="size-3.5" />
        No trend data
      </span>
    )
  }

  const diff = current - previous
  const isUp = diff > 0
  const isFlat = diff === 0

  return (
    <span
      className={
        isFlat
          ? 'inline-flex items-center gap-1 text-caption text-muted-foreground'
          : isUp
            ? 'inline-flex items-center gap-1 text-caption text-success'
            : 'inline-flex items-center gap-1 text-caption text-destructive'
      }
    >
      {isFlat ? <Minus className="size-3.5" /> : isUp ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
      {isFlat ? 'Stable' : `${Math.abs(diff)} pts vs average`}
    </span>
  )
}

export function DashboardInsights({ ats, analysis }) {
  const ai = analysis?.latest?.aiAnalysis
  const currentScore = ats?.latestScore ?? ats?.result?.overallScore ?? null
  const previousScore = ats?.averageScore ?? null

  const breakdown = ats?.result?.categoryScores
    ? Object.entries(ats.result.categoryScores).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        score: value,
      }))
    : []

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        aria-labelledby="ats-overview-title"
      >
        <Card className="shadow-elevation-md">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle id="ats-overview-title" className="text-h3">
                ATS overview
              </CardTitle>
              <p className="mt-1 text-small text-muted-foreground">
                How applicant tracking systems read your resume.
              </p>
            </div>
            <div className="text-right">
              <p className="text-h2 font-bold tabular-nums text-primary">{currentScore ?? '—'}</p>
              <TrendIndicator current={currentScore} previous={previousScore} />
            </div>
          </CardHeader>
          <CardContent className="h-72">
            {breakdown.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdown} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'var(--muted)' }}
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--card)',
                      color: 'var(--foreground)',
                    }}
                  />
                  <Bar dataKey="score" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border">
                <BarChartIcon className="size-6 text-text-secondary/40" aria-hidden="true" />
                <p className="text-small text-text-secondary">Run an analysis to unlock ATS insights.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.14 }}
        aria-labelledby="ai-insights-title"
        className="space-y-4"
      >
        <div>
          <h2 id="ai-insights-title" className="text-h3">
            AI recommendations
          </h2>
          <p className="text-small text-muted-foreground">Strengths, gaps, and your next best improvement.</p>
        </div>
        <div className="grid gap-4">
          <InsightCard title="Strengths" items={ai?.strengths} />
          <InsightCard title="Weaknesses" items={ai?.weaknesses} />
          <InsightCard
            title="Top recommendation"
            items={ai?.improvementSuggestions}
            variant="recommendation"
          />
          {ai?.summary ? (
            <Card className="shadow-elevation-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-small font-medium">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-small text-text-body leading-relaxed">{ai.summary}</p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </motion.section>
    </div>
  )
}
