import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle, GraduationCap, Briefcase, Award } from 'lucide-react'

/**
 * Badge displaying detected profession and seniority
 */
export function DetectedFieldBadge({ detectedField }) {
  if (!detectedField?.profession) return null

  const { profession, seniority, fieldCategory, criticalCredential } = detectedField

  const seniorityVariant = {
    entry: 'secondary',
    mid: 'outline',
    senior: 'default',
    executive: 'warning',
  }[seniority] || 'secondary'

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2"
    >
      <Badge variant="default" className="text-sm px-3 py-1">
        {profession}
      </Badge>
      <Badge variant={seniorityVariant} className="text-sm px-3 py-1">
        {seniority}
      </Badge>
      {fieldCategory && (
        <Badge variant="outline" className="text-sm px-3 py-1 bg-card">
          {fieldCategory}
        </Badge>
      )}
      {criticalCredential && (
        <Badge variant="destructive" className="text-sm px-3 py-1">
          <Award className="size-3 mr-1" />
          {criticalCredential}
        </Badge>
      )}
    </motion.div>
  )
}

/**
 * Card displaying the honest verdict
 */
export function HonestVerdictCard({ verdict, atsScore }) {
  if (!verdict) return null

  const { text, isRecommended, criticalIssues = [] } = verdict

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-lg border p-4 ${
        isRecommended
          ? 'border-success/30 bg-success/5'
          : 'border-destructive/30 bg-destructive/5'
      }`}
    >
      <div className="flex items-start gap-3">
        {isRecommended ? (
          <CheckCircle className="size-6 text-success shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="size-6 text-destructive shrink-0 mt-0.5" />
        )}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${isRecommended ? 'text-success' : 'text-destructive'}`}>
              {isRecommended ? 'Likely to Pass' : 'May Be Filtered'}
            </h3>
            {atsScore != null && (
              <Badge variant={atsScore >= 60 ? 'success' : 'destructive'}>
                ATS: {Math.round(atsScore)}%
              </Badge>
            )}
          </div>
          <p className="text-body">{text}</p>
          {criticalIssues.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-destructive">Critical Issues:</p>
              <ul className="mt-1 list-inside list-disc text-sm text-destructive">
                {criticalIssues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Warning banner for hard gate failure
 */
export function HardGateWarning({ hardGateCheck }) {
  if (!hardGateCheck || hardGateCheck.passed === null || hardGateCheck.passed === true) {
    return null
  }

  const { missingRequirements = [] } = hardGateCheck

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-destructive bg-destructive/10 p-4"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
        <div className="space-y-2">
          <h3 className="font-semibold text-destructive">ATS Auto-Filter Warning</h3>
          <p className="text-sm text-foreground">
            This resume may be automatically filtered out by ATS systems due to missing requirements.
          </p>
          {missingRequirements.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium">Missing Requirements:</p>
              <ul className="mt-1 list-inside list-disc text-sm">
                {missingRequirements.map((req, idx) => (
                  <li key={idx} className={req.severity === 'critical' ? 'text-destructive font-medium' : 'text-foreground'}>
                    {req.requirement}
                    {req.severity === 'critical' && ' (Critical)'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Section showing what's expected for this field but missing
 */
export function MissingForFieldCard({ missingForField }) {
  if (!missingForField || missingForField.length === 0) return null

  return (
    <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <GraduationCap className="size-5 text-warning" />
        <h3 className="font-semibold text-warning">Expected for This Field</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        These items are typically expected for this profession but were not detected in your resume:
      </p>
      <div className="space-y-3">
        {missingForField.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <div className="mt-1.5 size-2 rounded-full bg-warning shrink-0" />
            <div>
              <p className="font-medium text-foreground">{item.item}</p>
              <p className="text-sm text-muted-foreground">{item.whyItMatters}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Card for displaying strengths/weaknesses with evidence
 */
export function EvidenceInsightCard({ title, items, tone = 'neutral' }) {
  const toneClasses = {
    neutral: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
    danger: 'border-destructive/30 bg-destructive/5',
  }[tone]

  if (!items || items.length === 0) return null

  return (
    <div className={`rounded-lg border p-4 ${toneClasses}`}>
      <div className="flex items-center gap-2 mb-3">
        <Briefcase className={`size-5 ${tone === 'neutral' ? 'text-success' : tone === 'warning' ? 'text-warning' : 'text-destructive'}`} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="text-sm">
            <p className="font-medium">{item.title || item.name}</p>
            <p className="text-muted-foreground">{item.description || item.reason}</p>
            {item.evidence && (
              <blockquote className="mt-2 border-l-2 border-border pl-3 italic text-muted-foreground">
                "{item.evidence}"
              </blockquote>
            )}
            {item.location && (
              <p className="text-xs text-muted-foreground mt-1">Location: {item.location}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}