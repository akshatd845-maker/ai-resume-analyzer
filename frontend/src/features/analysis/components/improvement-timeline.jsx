import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ImprovementTimeline({ items = [] }) {
  return (
    <Card className="shadow-elevation-sm">
      <CardHeader>
        <CardTitle className="text-h3">Improvement Suggestions</CardTitle>
        <p className="text-caption text-text-secondary">Use server-provided priorities and estimates</p>
      </CardHeader>
      <CardContent>
        {items.length ? (
          <ol className="relative space-y-4">
            {items.map((it, idx) => (
              <li key={it.id ?? it.title ?? idx} className="flex gap-3">
                <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 border border-primary/20 text-caption font-bold text-accent tabular-nums">
                  {idx + 1}
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-small font-semibold text-white">{it.title ?? it.suggestion ?? 'Suggestion'}</p>
                    {it.priority ? (
                      <span className="text-[10px] rounded-md border border-border bg-card-elevated px-2 py-0.5 text-text-secondary">
                        Priority: {it.priority}
                      </span>
                    ) : null}
                    {it.estimatedImpact ? (
                      <span className="text-[10px] rounded-md border border-border bg-card-elevated px-2 py-0.5 text-text-secondary">
                        Impact: {it.estimatedImpact}
                      </span>
                    ) : null}
                    {it.difficulty ? (
                      <span className="text-[10px] rounded-md border border-border bg-card-elevated px-2 py-0.5 text-text-secondary">
                        Difficulty: {it.difficulty}
                      </span>
                    ) : null}
                  </div>
                  {it.description ? <p className="text-caption text-text-secondary leading-relaxed">{it.description}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-caption text-text-secondary">No improvement suggestions returned.</p>
        )}
      </CardContent>
    </Card>
  )
}

