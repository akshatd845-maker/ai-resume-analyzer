import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function AnalysisTimeline({ events = [] }) {
  return (
    <Card className="shadow-elevation-sm">
      <CardHeader>
        <CardTitle className="text-h3">Analysis Timeline</CardTitle>
        <p className="text-caption text-text-secondary">Server events only</p>
      </CardHeader>
      <CardContent>
        {events.length ? (
          <ul className="space-y-3">
            {events.map((e, i) => (
              <li key={e.id ?? e.event ?? i} className="flex gap-3">
                <div className="mt-1 size-2 rounded-full bg-primary" aria-hidden="true" />
                <div className="space-y-0.5">
                  <p className="text-small font-semibold">{e.event ?? e.type ?? 'Update'}</p>
                  {e.message ? <p className="text-caption text-text-secondary">{e.message}</p> : null}
                  {e.timestamp ? <p className="text-caption text-text-secondary">{e.timestamp}</p> : null}
                </div>
              </li>
            ))}
            {events.length > 0 ? <Separator className="my-1" /> : null}
          </ul>
        ) : (
          <p className="text-caption text-text-secondary">No timeline events returned.</p>
        )}
      </CardContent>
    </Card>
  )
}

