import { useEffect, useMemo, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Circle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function gradeFromScore(score) {
  if (score == null || Number.isNaN(Number(score))) return null
  const s = Number(score)
  if (s >= 90) return 'A'
  if (s >= 80) return 'B'
  if (s >= 70) return 'C'
  return 'D'
}

function getGradeColor(grade) {
  switch (grade) {
    case 'A':
      return 'text-success'
    case 'B':
      return 'text-accent'
    case 'C':
      return 'text-warning'
    case 'D':
      return 'text-destructive'
    default:
      return 'text-text-secondary'
  }
}

function getProgressColor(value) {
  const v = value ?? 0
  if (v >= 80) return 'bg-success'
  if (v >= 60) return 'bg-warning'
  if (v >= 40) return 'bg-orange-500'
  return 'bg-destructive'
}

export function ATSScoreCard({ atsScore, previousScore }) {
  const target = useMemo(() => (atsScore == null ? 0 : Math.max(0, Math.min(100, Number(atsScore)))), [atsScore])
  const grade = gradeFromScore(atsScore)

  const CIRCUMFERENCE = 301.59 // 2 * PI * 48

  const motionVal = useMotionValue(CIRCUMFERENCE)
  const springVal = useSpring(motionVal, { stiffness: 120, damping: 18 })
  const prevTargetRef = useRef(null)

  useEffect(() => {
    const prev = prevTargetRef.current
    const prevOffset = prev == null ? CIRCUMFERENCE : CIRCUMFERENCE - (prev / 100) * CIRCUMFERENCE
    const newOffset = CIRCUMFERENCE - (target / 100) * CIRCUMFERENCE
    prevTargetRef.current = target
    motionVal.set(prevOffset)
    motionVal.set(newOffset)
  }, [target, motionVal])

  return (
    <Card className="shadow-elevation-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-h3">ATS Score</CardTitle>
            <p className="text-caption text-text-secondary">Overall resume ATS readiness</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="text-caption font-semibold text-text-secondary">Grade</span>
              <span className={`${getGradeColor(grade)} text-h2 font-bold`} aria-label={`ATS grade ${grade ?? 'N/A'}`}>
                {grade ?? '—'}
              </span>
            </div>
            {previousScore != null ? (
              <p className="mt-1 text-caption text-text-secondary">
                Previous: <span className="font-medium tabular-nums text-foreground">{previousScore}%</span>
              </p>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="relative flex size-28 items-center justify-center">
            <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90" aria-hidden="true">
              <circle cx="56" cy="56" r="48" stroke="var(--border)" strokeWidth="10" fill="none" />
              <motion.circle
                cx="56"
                cy="56"
                r="48"
                stroke="var(--primary)"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="301.59"
                style={{
                  strokeDashoffset: springVal,
                }}
              />
            </svg>
            <motion.div className="absolute text-h3 font-bold tabular-nums">
              {/** We render numeric value separately using motion value */}
              {/** Keep plain number to avoid typing issues in SVG */}
              {atsScore == null ? '—' : `${Math.round(target)}%`}
            </motion.div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-h2 font-bold tabular-nums">{atsScore == null ? '—' : `${Math.round(atsScore)}%`}</div>
            <p className="mt-1 text-caption text-text-secondary">Higher score means better ATS match.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CategoryScoreCard({ title, icon: Icon, percent, insight }) {
  const p = percent == null ? 0 : Math.max(0, Math.min(100, Number(percent)))

  return (
    <Card className="shadow-elevation-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {Icon ? <Icon className="mt-0.5 size-5 text-text-secondary" aria-hidden="true" /> : <Circle className="mt-0.5 size-5 text-text-secondary" aria-hidden="true" />}
            <div>
              <p className="text-small font-semibold">{title}</p>
              {insight ? <p className="mt-1 text-caption text-text-secondary">{insight}</p> : null}
            </div>
          </div>
          <div className="text-right">
            <p className="text-h3 font-bold tabular-nums">{percent == null ? '—' : `${Math.round(p)}%`}</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="h-2 w-full rounded-full bg-white/[0.08]">
            <motion.div
              className={`h-2 rounded-full ${getProgressColor(p)}`}
              initial={{ width: '0%' }}
              animate={{ width: `${p}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              aria-hidden="true"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

