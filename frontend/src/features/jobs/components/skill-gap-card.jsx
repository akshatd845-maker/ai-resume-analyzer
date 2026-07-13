import { CheckCircle2, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

function getProgressColor(value) {
  const v = value ?? 0
  if (v >= 80) return 'bg-success'
  if (v >= 60) return 'bg-warning'
  if (v >= 40) return 'bg-orange-500'
  return 'bg-destructive'
}

export function SkillGapCard({ matchedSkills, missingSkills, requiredSkills = [] }) {
  const matchedCount = matchedSkills?.length ?? 0
  const requiredCount = requiredSkills?.length ?? 0
  const progress = requiredCount > 0 ? Math.round((matchedCount / requiredCount) * 100) : 0

  const hasData = matchedCount > 0 || (missingSkills?.length ?? 0) > 0

  if (!hasData) return null

  return (
    <section aria-label="Skill gap analysis">
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-text-secondary">
          Skill Gap
        </p>
        <span className="text-[11px] font-semibold text-white tabular-nums">
          {progress}% matched
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
        <div
          className={`h-full rounded-full ${getProgressColor(progress)} transition-all duration-700`}
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${progress}% skills matched`}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Matched */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-success">
            <CheckCircle2 className="size-3" aria-hidden="true" />
            Matched ({matchedCount})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(matchedSkills ?? []).slice(0, 10).map((s) => (
              <Badge
                key={s}
                variant="success"
                className="rounded-md px-2 py-0.5 text-[11px] font-medium"
              >
                {s}
              </Badge>
            ))}
            {(matchedSkills ?? []).length === 0 ? (
              <span className="text-[11px] text-text-secondary">None returned</span>
            ) : null}
          </div>
        </div>

        {/* Missing */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-destructive">
            <XCircle className="size-3" aria-hidden="true" />
            Missing ({missingSkills?.length ?? 0})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(missingSkills ?? []).slice(0, 10).map((s) => (
              <Badge
                key={s}
                variant="destructive"
                className="rounded-md px-2 py-0.5 text-[11px] font-medium"
              >
                {s}
              </Badge>
            ))}
            {(missingSkills ?? []).length === 0 ? (
              <span className="text-[11px] text-text-secondary">None returned</span>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
