import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AISummaryCard({ analysis }) {
  const atsInsight = analysis?.aiAnalysis?.atsInsights
  const aiText =
    analysis?.aiAnalysis?.summary ??
    analysis?.aiAnalysis?.aiSummary ??
    atsInsight ??
    null

  return (
    <Card className="shadow-elevation-sm">
      <CardHeader>
        <CardTitle className="text-h3">AI Summary</CardTitle>
        <p className="text-caption text-muted-foreground">Backend response only (no fabrication)</p>
      </CardHeader>
      <CardContent>
        {aiText ? (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {typeof aiText === 'string' ? (
              <div className="whitespace-pre-wrap break-words text-body">{aiText}</div>
            ) : (
              <pre className="whitespace-pre-wrap break-words text-caption">{JSON.stringify(aiText, null, 2)}</pre>
            )}
          </div>
        ) : (
          <p className="text-caption text-muted-foreground">No AI summary returned by the server.</p>
        )}
      </CardContent>
    </Card>
  )
}

