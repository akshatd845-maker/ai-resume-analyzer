import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDashboard } from '@/features/dashboard/hooks/use-dashboard'
import { DashboardAiSummary } from '@/features/dashboard/components/dashboard-ai-summary'
import { DashboardHero } from '@/features/dashboard/components/dashboard-hero'
import { DashboardJobMatches } from '@/features/dashboard/components/dashboard-job-matches'
import { DashboardKpiCards } from '@/features/dashboard/components/dashboard-kpi-cards'
import { DashboardQuickActions } from '@/features/dashboard/components/dashboard-quick-actions'
import { DashboardRecentResumes } from '@/features/dashboard/components/dashboard-recent-resumes'
import {
  DashboardEmptyState,
  DashboardError,
  DashboardSkeleton,
} from '@/features/dashboard/components/dashboard-states'

export const DashboardPage = memo(function DashboardPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, error, refetch } = useDashboard()

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        <DashboardSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        <DashboardError
          onRetry={() => refetch()}
          message={error?.response?.data?.message}
        />
      </div>
    )
  }

  const hasResume = (data?.resume?.total ?? 0) > 0

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
      {!hasResume ? (
        <DashboardEmptyState onUpload={() => navigate('/resumes')} />
      ) : (
        <div className="space-y-6">
          {/* Welcome */}
          <DashboardHero profile={data.profile} />

          {/* KPI row */}
          <DashboardKpiCards data={data} />

          {/* Resumes + AI summary */}
          <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <DashboardRecentResumes data={data} />
            <DashboardAiSummary data={data} />
          </div>

          {/* Job matches + Quick actions */}
          <div className="grid gap-4 lg:grid-cols-2">
            <DashboardJobMatches data={data} />
            <DashboardQuickActions />
          </div>
        </div>
      )}
    </div>
  )
})
