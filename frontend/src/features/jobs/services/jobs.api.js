import { apiClient } from '@/services/api-client'

export const jobsApi = {
  async getJobs({ category, experienceLevel, _search, _sort } = {}) {
    // Backend-supported filters (do not invent). Only pass known ones.
    const params = {}
    if (category) params.category = category
    if (experienceLevel) params.experienceLevel = experienceLevel

    // Frontend-only filtering/sorting should not be sent to backend
    // if the backend does not support it.
    const { data } = await apiClient.get('/jobs', { params })
    return data
  },

  async getJobById(id) {
    const { data } = await apiClient.get(`/jobs/${id}`)
    return data
  },

  async matchResumeToJobs(resumeId) {
    const { data } = await apiClient.post(`/jobs/match/${resumeId}`)
    return data
  },
}

