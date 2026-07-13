import { useState } from 'react'
import {
  AlertTriangle,
  Award,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Search,
  Sparkles,
  Tag,
  Target,
  TrendingUp,
  XCircle,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

// ─── helpers ────────────────────────────────────────────────────────────────

function scoreColor(value) {
  if (value >= 80) return 'text-[#22C55E]'
  if (value >= 60) return 'text-[#F59E0B]'
  if (value >= 40) return 'text-[#F97316]'
  return 'text-[#EF4444]'
}

function scoreLabel(value) {
  if (value >= 80) return 'Excellent'
  if (value >= 60) return 'Good'
  if (value >= 40) return 'Fair'
  return 'Needs Work'
}

function priorityVariant(priority) {
  if (priority === 'high') return 'destructive'
  if (priority === 'medium') return 'warning'
  return 'secondary'
}

const CATEGORY_LABELS = {
  contact: 'Contact Info',
  summary: 'Summary',
  skills: 'Skills',
  education: 'Education',
  experience: 'Experience',
  projects: 'Projects',
  certifications: 'Certifications',
  keywords: 'Keywords',
  achievements: 'Achievements',
  formatting: 'Formatting',
}

const CATEGORY_WEIGHTS = {
  contact: 5,
  summary: 10,
  skills: 20,
  education: 15,
  experience: 20,
  projects: 10,
  certifications: 5,
  keywords: 8,
  achievements: 4,
  formatting: 3,
}

// ─── sub-sections ────────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, count }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-3.5 shrink-0 text-text-secondary" aria-hidden="true" />
      <span className="text-caption font-semibold uppercase tracking-wide text-text-secondary">
        {title}
      </span>
      {count != null && (
        <span className="ml-auto text-caption text-text-secondary">{count}</span>
      )}
    </div>
  )
}

function CollapsibleSection({ title, icon, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 text-left"
        aria-expanded={open}
      >
        <icon.type
          {...icon.props}
          className="size-3.5 shrink-0 text-text-secondary"
          aria-hidden="true"
        />
        <span className="text-caption font-semibold uppercase tracking-wide text-text-secondary">
          {title}
        </span>
        <span className="ml-auto text-text-secondary">
          {open ? (
            <ChevronUp className="size-3.5" />
          ) : (
            <ChevronDown className="size-3.5" />
          )}
        </span>
      </button>
      {open && children}
    </div>
  )
}

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score }) {
  const r = 36
  const circ = 2 * Math.PI * r
  const dash = ((score ?? 0) / 100) * circ

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="96" height="96" viewBox="0 0 96 96" aria-label={`ATS score: ${score ?? 0}%`}>
        {/* track */}
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="8"
        />
        {/* progress */}
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke={
            (score ?? 0) >= 80
              ? '#22C55E'
              : (score ?? 0) >= 60
                ? '#F59E0B'
                : (score ?? 0) >= 40
                  ? '#F97316'
                  : '#EF4444'
          }
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          transform="rotate(-90 48 48)"
          className="transition-all duration-700"
        />
        <text
          x="48"
          y="44"
          textAnchor="middle"
          dominantBaseline="middle"
          className={cn('text-[22px] font-bold fill-current', scoreColor(score ?? 0))}
          fill="currentColor"
        >
          {score ?? '—'}
        </text>
        <text
          x="48"
          y="62"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fill="rgba(255,255,255,0.5)"
        >
          / 100
        </text>
      </svg>
      <span className={cn('text-caption font-semibold', scoreColor(score ?? 0))}>
        {score != null ? scoreLabel(score) : 'Not scored'}
      </span>
    </div>
  )
}

// ─── Category Scores ─────────────────────────────────────────────────────────

function CategoryScores({ categoryScores }) {
  if (!categoryScores) return null
  const entries = Object.entries(categoryScores).sort(
    (a, b) => (CATEGORY_WEIGHTS[b[0]] ?? 0) - (CATEGORY_WEIGHTS[a[0]] ?? 0),
  )

  return (
    <div className="space-y-2.5">
      {entries.map(([key, value]) => (
        <div key={key} className="space-y-1">
          <div className="flex items-center justify-between text-caption">
            <span className="text-text-secondary">
              {CATEGORY_LABELS[key] ?? key}{' '}
              <span className="text-[10px] opacity-50">({CATEGORY_WEIGHTS[key] ?? 0}%)</span>
            </span>
            <span className={cn('font-medium tabular-nums', scoreColor(value))}>
              {Math.round(value)}
            </span>
          </div>
          <Progress value={value} className="h-1.5" />
        </div>
      ))}
    </div>
  )
}

// ─── Strengths / Weaknesses ───────────────────────────────────────────────────

function StrengthsList({ items }) {
  if (!items?.length) return <p className="text-caption text-text-secondary">None identified</p>
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-caption">
          <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#22C55E]" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function WeaknessesList({ items }) {
  if (!items?.length) return <p className="text-caption text-text-secondary">None identified</p>
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-caption">
          <XCircle className="mt-0.5 size-3.5 shrink-0 text-[#EF4444]" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

// ─── Improvement Suggestions ─────────────────────────────────────────────────

function ImprovementSuggestions({ items }) {
  if (!items?.length) return <p className="text-caption text-text-secondary">No suggestions</p>
  // Sort high → medium → low
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  const sorted = [...items].sort(
    (a, b) => (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1),
  )
  return (
    <ul className="space-y-2">
      {sorted.map((item, i) => (
        <li key={i} className="rounded-lg bg-muted/30 px-3 py-2">
          <div className="mb-1 flex items-center gap-2">
            <Badge variant={priorityVariant(item.priority)} className="text-[10px]">
              {item.priority}
            </Badge>
            {item.section && (
              <span className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">
                {item.section}
              </span>
            )}
          </div>
          <p className="text-caption">{item.suggestion}</p>
        </li>
      ))}
    </ul>
  )
}

// ─── Keyword chips ────────────────────────────────────────────────────────────

function KeywordChips({ items, variant = 'secondary' }) {
  if (!items?.length) return <p className="text-caption text-text-secondary">None</p>
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((kw, i) => (
        <Badge key={i} variant={variant} className="text-[11px]">
          {kw}
        </Badge>
      ))}
    </div>
  )
}

// ─── Section Feedback ─────────────────────────────────────────────────────────

function SectionFeedbackGrid({ feedback }) {
  if (!feedback) return null
  const entries = Object.entries(feedback).filter(([, v]) => v)
  if (!entries.length) return null
  return (
    <div className="space-y-2">
      {entries.map(([section, text]) => (
        <div key={section} className="rounded-lg bg-muted/30 px-3 py-2">
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
            {section}
          </p>
          <p className="text-caption">{text}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ResumeAnalysisPanel({ resume }) {
  const ai = resume?.aiAnalysis
  const ats = resume?.atsResults

  if (!ai && !ats) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-8 text-center">
        <Sparkles className="size-8 text-text-secondary" aria-hidden="true" />
        <p className="text-small font-medium">No analysis yet</p>
        <p className="text-caption text-text-secondary">
          Click "Analyze" to get AI-powered feedback.
        </p>
      </div>
    )
  }

  // Use ATS rule-based score as primary, fall back to AI score
  const displayScore = ats?.overallScore ?? ai?.atsScore ?? null

  return (
    <div className="space-y-5">
      {/* Score overview */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/20 px-4 py-3">
        <ScoreRing score={displayScore} />
        <div className="min-w-0 flex-1 space-y-1.5">
          {ai?.careerLevel && (
            <div className="flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-text-secondary" aria-hidden="true" />
              <span className="text-caption font-medium">{ai.careerLevel}</span>
            </div>
          )}
          {ai?.industryFit?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {ai.industryFit.map((ind, i) => (
                <Badge key={i} variant="secondary" className="text-[10px]">
                  {ind}
                </Badge>
              ))}
            </div>
          )}
          {ai?.summary && (
            <p className="line-clamp-3 text-caption text-text-secondary">{ai.summary}</p>
          )}
        </div>
      </div>

      {/* ATS category breakdown */}
      {ats?.categoryScores && (
        <>
          <CollapsibleSection
            title="ATS Score Breakdown"
            icon={<Target />}
          >
            <CategoryScores categoryScores={ats.categoryScores} />
          </CollapsibleSection>
          <Separator />
        </>
      )}

      {/* Missing sections & keywords from ATS */}
      {(ats?.missingSections?.length > 0 || ats?.missingKeywords?.length > 0) && (
        <>
          <div className="space-y-3">
            {ats.missingSections?.length > 0 && (
              <div className="space-y-2">
                <SectionHeader icon={AlertTriangle} title="Missing Sections" />
                <div className="flex flex-wrap gap-1.5">
                  {ats.missingSections.map((s, i) => (
                    <Badge key={i} variant="destructive" className="text-[11px]">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {ats.missingKeywords?.length > 0 && (
              <div className="space-y-2">
                <SectionHeader icon={Search} title="Missing Keywords" count={ats.missingKeywords.length} />
                <KeywordChips items={ats.missingKeywords.slice(0, 12)} variant="outline" />
              </div>
            )}
          </div>
          <Separator />
        </>
      )}

      {/* AI strengths & weaknesses */}
      {ai && (
        <>
          <div className="grid grid-cols-1 gap-4">
            {ai.strengths?.length > 0 && (
              <CollapsibleSection title="Strengths" icon={<CheckCircle2 />}>
                <StrengthsList items={ai.strengths} />
              </CollapsibleSection>
            )}
            {ai.weaknesses?.length > 0 && (
              <CollapsibleSection title="Weaknesses" icon={<XCircle />}>
                <WeaknessesList items={ai.weaknesses} />
              </CollapsibleSection>
            )}
          </div>
          <Separator />
        </>
      )}

      {/* Improvement suggestions */}
      {ai?.improvementSuggestions?.length > 0 && (
        <>
          <CollapsibleSection title="Improvement Suggestions" icon={<Lightbulb />} defaultOpen={true}>
            <ImprovementSuggestions items={ai.improvementSuggestions} />
          </CollapsibleSection>
          <Separator />
        </>
      )}

      {/* Missing skills */}
      {ai?.missingSkills?.length > 0 && (
        <>
          <div className="space-y-2">
            <SectionHeader icon={Tag} title="Missing Skills" count={ai.missingSkills.length} />
            <KeywordChips items={ai.missingSkills} variant="warning" />
          </div>
          <Separator />
        </>
      )}

      {/* Keyword optimization */}
      {ai?.keywordOptimization && (
        <>
          <div className="space-y-3">
            {ai.keywordOptimization.wellUsed?.length > 0 && (
              <div className="space-y-2">
                <SectionHeader icon={CheckCircle2} title="Well-Used Keywords" />
                <KeywordChips items={ai.keywordOptimization.wellUsed} variant="success" />
              </div>
            )}
            {ai.keywordOptimization.shouldAdd?.length > 0 && (
              <div className="space-y-2">
                <SectionHeader icon={TrendingUp} title="High-Impact Keywords to Add" />
                <KeywordChips items={ai.keywordOptimization.shouldAdd} variant="outline" />
              </div>
            )}
          </div>
          <Separator />
        </>
      )}

      {/* Section feedback */}
      {ai?.sectionFeedback && Object.values(ai.sectionFeedback).some(Boolean) && (
        <>
          <CollapsibleSection title="Section Feedback" icon={<Briefcase />} defaultOpen={false}>
            <SectionFeedbackGrid feedback={ai.sectionFeedback} />
          </CollapsibleSection>
          <Separator />
        </>
      )}

      {/* Recommended job roles */}
      {ai?.recommendedJobRoles?.length > 0 && (
        <div className="space-y-2">
          <SectionHeader icon={Award} title="Recommended Roles" />
          <div className="flex flex-wrap gap-1.5">
            {ai.recommendedJobRoles.map((role, i) => (
              <Badge key={i} variant="default" className="text-[11px]">
                {role}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* ATS recommendations */}
      {ats?.recommendations?.length > 0 && (
        <>
          <Separator />
          <CollapsibleSection title="ATS Recommendations" icon={<Target />} defaultOpen={false}>
            <ul className="space-y-1.5">
              {ats.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-2 text-caption">
                  <span className="mt-0.5 size-1.5 shrink-0 translate-y-1 rounded-full bg-primary" aria-hidden="true" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        </>
      )}
    </div>
  )
}
