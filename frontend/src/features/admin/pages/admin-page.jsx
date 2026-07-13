import { Database, ShieldAlert, Sparkles, Users } from 'lucide-react'

import { useAdminDashboard } from '@/features/admin/hooks/use-admin-dashboard'
import { PageContainer, PageHeader, LoadingState } from '@/components/common'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function AdminPage() {
  const { data, isLoading, isError, error } = useAdminDashboard()

  if (isLoading) {
    return (
      <PageContainer size="xl">
        <LoadingState />
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer size="xl">
        <Card className="p-6">
          <p className="text-h3">Unable to load admin dashboard</p>
          <p className="text-caption text-muted-foreground mt-2">
            {error?.response?.data?.message ?? 'Please try again later.'}
          </p>
        </Card>
      </PageContainer>
    )
  }

  const analysisRate =
    data.totalAnalyses > 0
      ? Math.round((data.completedAnalyses / data.totalAnalyses) * 100)
      : 0

  return (
    <PageContainer size="xl">
      <PageHeader
        title="Admin Control Center"
        description="Platform analytics and system overview from live API data."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="shadow-elevation-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-caption text-muted-foreground font-medium">Total Users</span>
              <p className="text-h2 font-bold tabular-nums">{data.totalUsers}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elevation-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-caption text-muted-foreground font-medium">Resumes Uploaded</span>
              <p className="text-h2 font-bold tabular-nums">{data.totalResumes}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Sparkles className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elevation-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-caption text-muted-foreground font-medium">Active Jobs</span>
              <p className="text-h2 font-bold tabular-nums">{data.activeJobs}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-success/10 text-success">
              <Database className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elevation-sm">
          <CardContent className="p-5 flex flex-col gap-2 justify-center">
            <div className="flex justify-between items-center text-caption text-muted-foreground font-medium">
              <span>Analysis Completion</span>
              <span>{analysisRate}%</span>
            </div>
            <Progress value={analysisRate} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-elevation-md">
          <CardHeader>
            <CardTitle className="text-h3 font-bold">Platform Stats</CardTitle>
            <CardDescription>Aggregated metrics from the database.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-small">
            <div className="flex justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground">Total analyses</span>
              <span className="font-medium">{data.totalAnalyses}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground">Completed analyses</span>
              <span className="font-medium">{data.completedAnalyses}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground">Total job matches</span>
              <span className="font-medium">{data.totalMatches}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground">Average ATS score</span>
              <span className="font-medium">{data.averageAtsScore ?? '—'}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground">New users this month</span>
              <span className="font-medium">{data.newUsersThisMonth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active users (30 days)</span>
              <span className="font-medium">{data.activeUsers}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elevation-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-h3 font-bold">
              <ShieldAlert className="size-5 text-primary" />
              Skills Insights
            </CardTitle>
            <CardDescription>Most common and most missing skills across users.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-caption font-semibold text-muted-foreground mb-2">Most common skills</p>
              {data.mostCommonSkills?.length ? (
                <ul className="space-y-1 text-small">
                  {data.mostCommonSkills.map((item) => (
                    <li key={item.skill} className="flex justify-between">
                      <span className="capitalize">{item.skill}</span>
                      <span className="text-muted-foreground tabular-nums">{item.count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-caption text-muted-foreground">No skill data yet.</p>
              )}
            </div>
            <div>
              <p className="text-caption font-semibold text-muted-foreground mb-2">Most missing skills</p>
              {data.mostMissingSkills?.length ? (
                <ul className="space-y-1 text-small">
                  {data.mostMissingSkills.map((item) => (
                    <li key={item.skill} className="flex justify-between">
                      <span className="capitalize">{item.skill}</span>
                      <span className="text-muted-foreground tabular-nums">{item.count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-caption text-muted-foreground">No missing-skill data yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
