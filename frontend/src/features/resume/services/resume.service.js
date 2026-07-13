import { apiClient } from '@/services/api-client'

export const MAX_RESUME_SIZE = 5 * 1024 * 1024
export const ACCEPTED_RESUME_TYPE = 'application/pdf'

export async function fetchResumes() {
  const { data } = await apiClient.get('/resumes')
  return data.data.resumes
}

export async function fetchResumeById(id) {
  const { data } = await apiClient.get(`/resumes/${id}`)
  return data.data.resume
}

export async function fetchAnalysis(resumeId) {
  try {
    const { data } = await apiClient.get(`/analysis/${resumeId}`)
    return data.data.analysis
  } catch (error) {
    if (error.response?.status === 404) return null
    throw error
  }
}

export async function analyzeResume(resumeId) {
  const { data } = await apiClient.post(`/analysis/${resumeId}`)
  return data.data.analysis
}

export async function uploadResume(file, onProgress) {
  const formData = new FormData()
  formData.append('resume', file)

  const { data } = await apiClient.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress,
  })

  return data.data.resume
}

export async function deleteResume(id) {
  await apiClient.delete(`/resumes/${id}`)
}

export function isProtectedResumeUrl(url) {
  return typeof url === 'string' && url.includes('/resumes/') && url.includes('/file')
}

export async function fetchResumeFileBlob(resumeId) {
  const { data } = await apiClient.get(`/resumes/${resumeId}/file`, {
    responseType: 'blob',
  })
  return URL.createObjectURL(data)
}

export async function replaceResume(oldId, file, onProgress) {
  const resume = await uploadResume(file, onProgress)
  await deleteResume(oldId)
  return resume
}

export function validateResumeFile(file) {
  if (!file) return 'No file selected.'
  if (file.type !== ACCEPTED_RESUME_TYPE) return 'Only PDF files are supported.'
  if (file.size > MAX_RESUME_SIZE) return 'File exceeds the 5 MB size limit.'
  return null
}

export function enrichResume(resume, analysis) {
  const atsScore =
    analysis?.atsResults?.overallScore ?? analysis?.aiAnalysis?.atsScore ?? null

  return {
    ...resume,
    id: resume._id,
    atsScore,
    analysisStatus: analysis?.analysisStatus ?? 'none',
    parsingStatus: analysis?.parsingStatus ?? null,
    analyzedAt: analysis?.analyzedAt ?? null,
    parsedAt: analysis?.parsedAt ?? null,
    // Full analysis data for the preview panel
    aiAnalysis: analysis?.aiAnalysis ?? null,
    atsResults: analysis?.atsResults ?? null,
    extractedData: analysis?.extractedData ?? null,
  }
}

export function computeResumeStats(resumes, enriched) {
  const total = resumes.length
  const storageUsed = resumes.reduce((sum, r) => sum + (r.fileSize ?? 0), 0)
  const latest = resumes.length
    ? [...resumes].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0]
    : null

  const scores = enriched
    .map((r) => r.atsScore)
    .filter((s) => s != null && !Number.isNaN(s))

  const averageAts =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null

  return { total, storageUsed, latest, averageAts }
}

export function filterAndSortResumes(resumes, { search, sort, statusFilter }) {
  let result = [...resumes]

  if (search.trim()) {
    const query = search.trim().toLowerCase()
    result = result.filter((r) =>
      r.originalFileName?.toLowerCase().includes(query),
    )
  }

  if (statusFilter && statusFilter !== 'all') {
    result = result.filter((r) => {
      const status = r.analysisStatus ?? 'none'
      return status === statusFilter
    })
  }

  switch (sort) {
    case 'oldest':
      result.sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt))
      break
    case 'ats':
      result.sort((a, b) => {
        const aScore = a.atsScore ?? -1
        const bScore = b.atsScore ?? -1
        return bScore - aScore
      })
      break
    case 'newest':
    default:
      result.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      break
  }

  return result
}

export function getAnalysisStatusLabel(status) {
  const map = {
    none: 'Not analyzed',
    pending: 'Pending',
    completed: 'Analyzed',
    failed: 'Failed',
  }
  return map[status] ?? 'Unknown'
}

export function getAnalysisStatusVariant(status) {
  const map = {
    none: 'info',
    pending: 'pending',
    completed: 'success',
    failed: 'danger',
  }
  return map[status] ?? 'default'
}
