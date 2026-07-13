import { useEffect, useState, useMemo, useCallback } from 'react'

import { jobsApi } from '@/features/jobs/services/jobs.api'

export function useJobsList({ category, experienceLevel } = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState(null)
  const [jobs, setJobs] = useState([])

  const paramsKey = useMemo(
    () => JSON.stringify({ category: category ?? '', experienceLevel: experienceLevel ?? '' }),
    [category, experienceLevel],
  )

  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)
    setError(null)
    try {
      const res = await jobsApi.getJobs({ category, experienceLevel })
      const payload = res?.data ?? res
      const data = payload?.data ?? payload
      setJobs(data?.jobs ?? [])
    } catch (e) {
      setIsError(true)
      setError(e)
    } finally {
      setIsLoading(false)
    }
  }, [category, experienceLevel])

  useEffect(() => {
    fetchJobs()
  }, [paramsKey, fetchJobs])

  return { jobs, isLoading, isError, error, refetch: fetchJobs }
}

