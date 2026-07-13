import { ResumePreviewPanel } from '@/features/resume/components/resume-preview-panel'

export function AnalysisPreviewPanel({ resume, onAnalyzeAgain, isAnalyzing }) {
  return (
    <ResumePreviewPanel resume={resume} onAnalyze={onAnalyzeAgain} isAnalyzing={isAnalyzing} />
  )
}

