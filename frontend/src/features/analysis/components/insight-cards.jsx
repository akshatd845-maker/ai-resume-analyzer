import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function InsightCard({ title, icon: Icon, tone = 'neutral', children }) {
  const toneClasses =
    tone === 'warning'
      ? 'border-warning/30 bg-warning/5'
      : tone === 'danger'
        ? 'border-destructive/30 bg-destructive/5'
        : 'border-border bg-card'

  return (
    <Card className={`shadow-elevation-sm ${toneClasses}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-h3">
          {Icon ? <Icon className="size-5" aria-hidden="true" /> : null}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-body">{children}</div>
      </CardContent>
    </Card>
  )
}

