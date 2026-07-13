import { useMemo, useState, useCallback } from 'react'

import { jobsApi } from '@/features/jobs/services/jobs.api'

export function useJobsMatching() {
  const [isMatching, setIsMatching] = useState(false)
  const [error, setError] = useState(null)

  const [matches, setMatches] = useState({
    totalJobs: 0,
    bestMatches: [],
  })

  const totals = useMemo(() => {
    const bestMatches = matches?.bestMatches ?? []
    const matchScores = bestMatches.map((m) => m.matchPercentage ?? 0)
    const avg = matchScores.length
      ? Math.round(matchScores.reduce((a, b) => a + b, 0) / matchScores.length)
      : 0

    const high = matchScores.filter((s) => s >= 80).length
    const medium = matchScores.filter((s) => s >= 60 && s < 80).length
    const low = matchScores.filter((s) => s < 60).length

    return {
      avgMatch: avg,
      highMatchCount: high,
      mediumMatchCount: medium,
      lowMatchCount: low,
      bestMatch: matchScores.length ? Math.max(...matchScores) : 0,
    }
  }, [matches])

  const refresh = useCallback(async (resumeId) => {
    if (!resumeId) return
    setIsMatching(true)
    setError(null)
    try {
      const res = await jobsApi.matchResumeToJobs(resumeId)
      // Do not invent shape: backend match controller returns `result` from service.
      const payload = res?.data ?? res
      // Axios usually sets res.data. ApiResponse wrapper might contain { data: { ... } }
      // We'll safely unwrap.
      const data = payload?.data ?? payload

      setMatches({
        totalJobs: data?.totalJobs ?? 0,
        bestMatches: data?.bestMatches ?? [],
      })
    } catch (e) {
      setError(e)
    } finally {
      setIsMatching(false)
    }
  }, [])

  return {
    matches,
    totals,
    isMatching,
    error,
    refresh,
  }
}

