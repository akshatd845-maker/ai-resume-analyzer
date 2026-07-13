import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  analyzeResume,
  deleteResume,
  enrichResume,
  fetchAnalysis,
  fetchResumes,
  replaceResume,
  uploadResume,
} from '@/features/resume/services/resume.service'

export const RESUMES_QUERY_KEY = ['resumes']

export function useResumes() {
  return useQuery({
    queryKey: RESUMES_QUERY_KEY,
    queryFn: fetchResumes,
  })
}

export function useResumeAnalyses(resumes = []) {
  const queries = useQueries({
    queries: resumes.map((resume) => ({
      queryKey: ['resume-analysis', resume._id],
      queryFn: () => fetchAnalysis(resume._id),
      staleTime: 30_000,
    })),
  })

  const analysisMap = {}
  resumes.forEach((resume, index) => {
    analysisMap[resume._id] = queries[index]?.data ?? null
  })

  const isLoading = queries.some((q) => q.isLoading)

  return { analysisMap, isLoading, queries }
}

export function useEnrichedResumes() {
  const { data: resumes = [], ...rest } = useResumes()
  const { analysisMap, isLoading: analysesLoading } = useResumeAnalyses(resumes)

  const enriched = resumes.map((resume) => enrichResume(resume, analysisMap[resume._id]))

  return {
    resumes,
    enriched,
    analysesLoading,
    ...rest,
  }
}

export function useResumeMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: RESUMES_QUERY_KEY })
    queryClient.invalidateQueries({ queryKey: ['resume-analysis'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }

  const upload = useMutation({
    mutationFn: ({ file, onProgress }) => uploadResume(file, onProgress),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: deleteResume,
    onSuccess: invalidate,
  })

  const replace = useMutation({
    mutationFn: ({ oldId, file, onProgress }) => replaceResume(oldId, file, onProgress),
    onSuccess: invalidate,
  })

  const analyze = useMutation({
    mutationFn: analyzeResume,
    onSuccess: (_, resumeId) => {
      queryClient.invalidateQueries({ queryKey: ['resume-analysis', resumeId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  return { upload, remove, replace, analyze, invalidate }
}
