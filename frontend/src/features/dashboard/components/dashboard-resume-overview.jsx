import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, RefreshCw, Upload } from 'lucide-react'

import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function DashboardResumeOverview({ resume, analysis }) {
  const latest = resume?.latest
  const extracted = analysis?.latest?.extractedData

  if (!latest) return null

  const summaryItems = [
    { label: 'Skills', value: extracted?.skills?.length ?? 0 },
    { label: 'Experience', value: extracted?.experience?.length ?? 0 },
    { label: 'Education', value: extracted?.education?.length ?? 0 },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.12 }}
      aria-labelledby="resume-summary-title"
    >
      <Card className="shadow-elevation-md">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle id="resume-summary-title" className="text-h3">
              Recent resume
            </CardTitle>
            <p className="text-small text-muted-foreground">Your latest uploaded document and parsed highlights.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/resume">View</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/resume">
                <Upload className="size-4" />
                Replace
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/analysis">
                <RefreshCw className="size-4" />
                Analyze again
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[1fr_auto]">
          <div className="flex items-start gap-4 rounded-xl border border-border bg-card-elevated p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>
            <div className="min-w-0 space-y-2">
              <p className="truncate text-small font-semibold text-white">{latest.fileName}</p>
              <p className="text-caption text-text-secondary">
                Uploaded {formatDate(latest.uploadedAt)}
              </p>
              <Badge variant="secondary">1 document</Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {summaryItems.map((item) => (
              <div key={item.label} className="rounded-lg border border-border p-4 text-center">
                <p className="text-h3 tabular-nums">{item.value}</p>
                <p className="text-caption text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.section>
  )
}
