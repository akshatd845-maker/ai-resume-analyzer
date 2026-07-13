import { apiClient } from '@/services/api-client'

export async function fetchDashboard() {
  const { data } = await apiClient.get('/dashboard')
  return data.data
}

export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function formatCurrentTime() {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date())
}

export function computeCompletion(extracted) {
  if (!extracted) return 0

  const checks = [
    Boolean(extracted.name),
    Boolean(extracted.email),
    Boolean(extracted.phone),
    Boolean(extracted.skills?.length),
    Boolean(extracted.education?.length),
    Boolean(extracted.experience?.length),
    Boolean(extracted.projects?.length),
    Boolean(extracted.certifications?.length),
  ]

  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function computeHealthScore({ atsScore, completion, analysisStatus }) {
  if (!analysisStatus || analysisStatus === 'pending') {
    return Math.max(completion - 10, 0)
  }

  if (analysisStatus === 'failed') {
    return Math.round(completion * 0.5)
  }

  const score = atsScore ?? 0
  return Math.round(score * 0.7 + completion * 0.3)
}

export function getResumeStatusLabel(status) {
  const map = {
    pending: 'Processing',
    completed: 'Ready',
    failed: 'Needs attention',
  }
  return map[status] ?? 'Not uploaded'
}

export function buildActivityTimeline(data) {
  const items = []

  data?.resume?.history?.forEach((resume) => {
    items.push({
      id: `upload-${resume.id}`,
      title: 'Resume uploaded',
      description: resume.originalFileName,
      date: resume.uploadedAt,
      type: 'upload',
    })
  })

  if (data?.analysis?.latest?.analyzedAt) {
    items.push({
      id: 'analysis-complete',
      title: 'Analysis completed',
      description: 'AI insights are ready to review',
      date: data.analysis.latest.analyzedAt,
      type: 'analysis',
    })
  }

  if (data?.ats?.result) {
    items.push({
      id: 'ats-updated',
      title: 'ATS score updated',
      description: `Score: ${data.ats.latestScore ?? data.ats.result.overallScore}`,
      date: data.analysis?.latest?.analyzedAt ?? data.resume?.latest?.uploadedAt,
      type: 'ats',
    })
  }

  if (data?.jobMatching?.bestMatches?.length) {
    items.push({
      id: 'job-match',
      title: 'Job matches generated',
      description: `${data.jobMatching.totalMatches} roles evaluated`,
      date: data.jobMatching.bestMatches[0]?.matchedAt,
      type: 'jobs',
    })
  }

  if (data?.profile?.lastLogin) {
    items.push({
      id: 'profile-login',
      title: 'Profile activity',
      description: 'You signed in to your workspace',
      date: data.profile.lastLogin,
      type: 'profile',
    })
  }

  return items
    .filter((item) => item.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)
}
