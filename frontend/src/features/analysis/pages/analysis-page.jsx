import { useMemo, useState } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'

import { useResumeAnalyses, useResumes, useResumeMutations } from '@/features/resume/hooks/use-resumes'
import { AnalysisEmptyState, AnalysisError, AnalysisSkeleton, AnalysisShell, AnalysisPendingState } from '@/features/analysis/components'
import {
  AnalysisHeader,
  AnalysisCategoryGrid,
  AISummaryCard,
  ATSScoreCard,
  InsightCard,
  MissingSkills,
  ImprovementTimeline,
  AnalysisTimeline,
} from '@/features/analysis/components'
import { AnalysisPreviewPanel } from '@/features/analysis/components/analysis-preview'
import { formatCategoryScores } from '@/features/analysis/utils/category-scores'

export function AnalysisPage() {
  const { resumeId } = useParams()
  const navigate = useNavigate()

  const { data: resumes = [], isLoading: resumesLoading, isError: resumesError, error, refetch } = useResumes()
  const { analysisMap, isLoading: analysesLoading } = useResumeAnalyses(resumes)
  const { analyze } = useResumeMutations()

  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const resume = useMemo(() => {
    const r = resumes.find((x) => x._id === resumeId) ?? null
    if (!r) return null
    const analysis = analysisMap[r._id]

    const atsScore = analysis?.atsResults?.overallScore ?? analysis?.aiAnalysis?.atsScore ?? null

    return {
      ...r,
      id: r._id,
      atsScore,
      analysisStatus: analysis?.analysisStatus ?? 'none',
      analyzedAt: analysis?.analyzedAt ?? null,
      secureUrl: r.secureUrl,
      originalFileName: r.originalFileName,
    }
  }, [analysisMap, resumes, resumeId])

  // Redirect to latest resume analysis if no specific resumeId in route (placed after hook declarations)
  if (!resumeId && resumes.length > 0) {
    return <Navigate to={`/analysis/${resumes[0]._id}`} replace />
  }

  const analysis = resume?.analysisStatus ? analysisMap[resumeId] : null

  const handleAnalyzeAgain = async () => {
    if (!resume) return
    setIsAnalyzing(true)
    try {
      await analyze.mutateAsync(resume._id)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const disableDownload = true

  const categories = formatCategoryScores(
    analysis?.atsResults?.categoryScores ?? analysis?.categoryScores,
  )

  const strengths = analysis?.aiAnalysis?.strengths ?? analysis?.strengths ?? []
  const weaknesses = analysis?.aiAnalysis?.weaknesses ?? analysis?.weaknesses ?? []

  const missingSkills = analysis?.aiAnalysis?.missingSkills ?? analysis?.missingSkills ?? []

  const improvements =
    analysis?.aiAnalysis?.improvementSuggestions ??
    analysis?.improvementSuggestions ??
    analysis?.suggestions ??
    []

  const timeline = analysis?.timeline ?? analysis?.analysisTimeline ?? []

  if (resumesLoading || analysesLoading) {
    return (
      <AnalysisShell>
        <AnalysisSkeleton />
      </AnalysisShell>
    )
  }

  if (resumesError) {
    return (
      <AnalysisShell>
        <AnalysisError message={error?.response?.data?.message} onRetry={() => refetch()} />
      </AnalysisShell>
    )
  }

  if (!resume) {
    return (
      <AnalysisShell>
        <AnalysisEmptyState
          onAnalyze={() => navigate('/resumes')}
        />
      </AnalysisShell>
    )
  }

  // Analysis has not run yet — show pending state instead of empty dashboard
  const analysisComplete = resume.analysisStatus === 'completed'

  if (!analysisComplete) {
    return (
      <AnalysisShell>
        <AnalysisHeader
          resume={resume}
          onAnalyzeAgain={handleAnalyzeAgain}
          isAnalyzing={isAnalyzing}
          disableDownload={disableDownload}
          onDownloadReport={() => {}}
        />
        <AnalysisPendingState
          onAnalyze={handleAnalyzeAgain}
          onBack={() => navigate('/resumes')}
          isAnalyzing={isAnalyzing}
        />
      </AnalysisShell>
    )
  }

  const strengthCards = (Array.isArray(strengths) ? strengths : []).slice(0, 4)
  const weaknessCards = (Array.isArray(weaknesses) ? weaknesses : []).slice(0, 4)

  return (
    <AnalysisShell>
      <div className="space-y-8">
        <AnalysisHeader
          resume={resume}
          onAnalyzeAgain={handleAnalyzeAgain}
          isAnalyzing={isAnalyzing}
          disableDownload={disableDownload}
          onDownloadReport={() => {}}
        />

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <ATSScoreCard atsScore={resume.atsScore} previousScore={analysis?.previousAtsScore ?? null} />

            <section aria-label="Resume score breakdown">
              <h2 className="text-h3 mb-3">Resume Score Breakdown</h2>
              <AnalysisCategoryGrid categories={categories} />
            </section>

            <AISummaryCard analysis={analysis} />

            <section className="grid gap-4 sm:grid-cols-2" aria-label="Strengths">
              {strengthCards.length ? (
                strengthCards.map((s, idx) => (
                  <InsightCard
                    key={s.id ?? idx}
                    title={s.title ?? `Strength ${idx + 1}`}
                    tone="neutral"
                    icon={null}
                  >
                    <div>{s.description ?? s.text ?? s}</div>
                  </InsightCard>
                ))
              ) : (
                <InsightCard title="Strengths" tone="neutral">
                  <div className="text-caption text-text-secondary">No strengths returned by the server.</div>
                </InsightCard>
              )}
            </section>

            <section className="grid gap-4 sm:grid-cols-2" aria-label="Weaknesses">
              {weaknessCards.length ? (
                weaknessCards.map((w, idx) => (
                  <InsightCard
                    key={w.id ?? idx}
                    title={w.title ?? `Weakness ${idx + 1}`}
                    tone="warning"
                    icon={null}
                  >
                    <div>{w.description ?? w.text ?? w}</div>
                  </InsightCard>
                ))
              ) : (
                <InsightCard title="Weaknesses" tone="warning">
                  <div className="text-caption text-text-secondary">No weaknesses returned by the server.</div>
                </InsightCard>
              )}
            </section>

            <MissingSkills skills={missingSkills} />

            <ImprovementTimeline items={improvements} />
          </div>

          <aside className="space-y-4" aria-label="Resume preview and timeline">
            <AnalysisPreviewPanel resume={resume} onAnalyzeAgain={handleAnalyzeAgain} isAnalyzing={isAnalyzing} />
            <AnalysisTimeline events={timeline} />
          </aside>
        </div>
      </div>
    </AnalysisShell>
  )
}

