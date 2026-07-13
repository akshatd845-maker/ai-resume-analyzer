import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Briefcase,
  Clock3,
  FileUp,
  Sparkles,
  User,
} from 'lucide-react'

import { buildActivityTimeline } from '@/features/dashboard/services/dashboard.service'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const activityIcons = {
  upload: FileUp,
  analysis: Sparkles,
  ats: BarChart3,
  jobs: Briefcase,
  profile: User,
}

export function DashboardBottom({ data }) {
  const bestMatch = data?.jobMatching?.bestMatches?.[0]
  const topRole =
    data?.jobMatching?.recommendedRoles?.[0] ??
    data?.analysis?.latest?.aiAnalysis?.recommendedJobRoles?.[0]
  const missingSkills =
    data?.analysis?.latest?.aiAnalysis?.missingSkills?.slice(0, 4) ?? []
  const activities = buildActivityTimeline(data)

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.16 }}
        aria-labelledby="job-overview-title"
      >
        <Card className="h-full shadow-elevation-md">
          <CardHeader>
            <CardTitle id="job-overview-title" className="text-h3">
              Job match overview
            </CardTitle>
            <p className="text-small text-muted-foreground">
              How closely your resume aligns with open opportunities.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-card-elevated p-4">
                <p className="text-caption text-text-secondary">Best match</p>
                <p className="text-h2 font-bold tabular-nums text-primary">
                  {bestMatch?.matchPercentage != null ? `${bestMatch.matchPercentage}%` : '—'}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card-elevated p-4 sm:col-span-2">
                <p className="text-caption text-text-secondary">Top recommended role</p>
                <p className="text-small font-semibold">{topRole ?? 'Run job matching to discover roles'}</p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card-elevated p-4">
              <p className="text-caption text-text-secondary">Total matching jobs</p>
              <p className="text-h3 font-semibold tabular-nums">{data?.jobMatching?.totalMatches ?? 0}</p>
            </div>

            <div className="space-y-2">
              <p className="text-small font-medium">Missing skills</p>
              <div className="flex flex-wrap gap-2">
                {missingSkills.length ? (
                  missingSkills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-caption text-muted-foreground">No skill gaps identified yet.</p>
                )}
              </div>
            </div>

            <Button asChild className="w-full sm:w-auto">
              <Link to="/jobs">Explore matches</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        aria-labelledby="activity-title"
      >
        <Card className="h-full shadow-elevation-md">
          <CardHeader>
            <CardTitle id="activity-title" className="text-h3">
              Recent activity
            </CardTitle>
            <p className="text-small text-muted-foreground">A timeline of your latest career actions.</p>
          </CardHeader>
          <CardContent>
            {activities.length ? (
              <ol className="space-y-4">
                {activities.map((item, index) => {
                  const Icon = activityIcons[item.type] ?? Clock3
                  return (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: 0.22 + index * 0.05 }}
                      className="relative flex gap-3 pl-1"
                    >
                      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/15">
                        <Icon className="size-4 text-accent" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1 border-b border-border pb-4 last:border-b-0 last:pb-0">
                        <p className="text-small font-medium">{item.title}</p>
                        <p className="text-caption text-muted-foreground">{item.description}</p>
                        <p className="mt-1 text-caption text-muted-foreground">{formatDate(item.date)}</p>
                      </div>
                    </motion.li>
                  )
                })}
              </ol>
            ) : (
              <p className="text-small text-muted-foreground">Activity will appear here as you use the platform.</p>
            )}
          </CardContent>
        </Card>
      </motion.section>
    </div>
  )
}
