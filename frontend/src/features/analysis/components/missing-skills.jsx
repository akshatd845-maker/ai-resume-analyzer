import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function MissingSkills({ skills = [] }) {
  return (
    <Card className="shadow-elevation-sm">
      <CardHeader>
        <CardTitle className="text-h3">Missing Skills</CardTitle>
        <p className="text-caption text-text-secondary">Hover a badge to see why it matters</p>
      </CardHeader>
      <CardContent>
        {skills.length ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <Tooltip key={s.name ?? s.skill ?? Math.random()}>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="cursor-help">
                    {s.name ?? s.skill}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  {s.reason ?? s.description ?? 'Provided by the backend.'}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        ) : (
          <p className="text-caption text-text-secondary">No missing skills data returned.</p>
        )}
      </CardContent>
    </Card>
  )
}

