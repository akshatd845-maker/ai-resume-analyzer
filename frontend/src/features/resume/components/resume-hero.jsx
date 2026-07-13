import { motion } from 'framer-motion'
import { HardDrive, RefreshCw, Star, Upload } from 'lucide-react'

import { computeResumeStats } from '@/features/resume/services/resume.service'
import { formatBytes, formatDate } from '@/lib/utils'
import { StatCard } from '@/components/common'
import { Button } from '@/components/ui/button'

export function ResumeHero({ resumes, enriched, onUpload, onRefresh, isRefreshing }) {
  const stats = computeResumeStats(resumes, enriched)

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl border border-border bg-card p-6 shadow-elevation-sm sm:p-8"
      aria-labelledby="resume-hero-title"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 id="resume-hero-title" className="text-h1">
            Resume Management
          </h1>
          <p className="text-body text-text-secondary max-w-2xl">
            Upload, organize, and preview your resumes. Track ATS scores and analysis
            status across your document library.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={onUpload}>
            <Upload className="size-4" />
            Upload resume
          </Button>
          <Button variant="outline" onClick={onRefresh} disabled={isRefreshing}>
            <RefreshCw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total resumes" value={stats.total} icon={Upload} />
        <StatCard
          label="Latest upload"
          value={stats.latest ? formatDate(stats.latest.uploadedAt) : '—'}
          description={stats.latest?.originalFileName}
        />
        <StatCard
          label="Average ATS score"
          value={stats.averageAts != null ? `${stats.averageAts}%` : '—'}
          icon={Star}
        />
        <StatCard
          label="Storage used"
          value={formatBytes(stats.storageUsed)}
          icon={HardDrive}
        />
      </div>
    </motion.section>
  )
}

export function ResumeQuickStats({ resumes, enriched }) {
  const stats = computeResumeStats(resumes, enriched)
  const analyzed = enriched.filter((r) => r.analysisStatus === 'completed').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-elevation-sm"
      aria-label="Quick stats"
    >
      <h2 className="text-small font-semibold">Quick stats</h2>
      <dl className="space-y-2 text-caption">
        <div className="flex justify-between">
          <dt className="text-text-secondary">Documents</dt>
          <dd className="font-medium tabular-nums">{stats.total}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-secondary">Analyzed</dt>
          <dd className="font-medium tabular-nums">{analyzed}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-secondary">Avg. ATS</dt>
          <dd className="font-medium tabular-nums">
            {stats.averageAts != null ? `${stats.averageAts}%` : '—'}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-secondary">Storage</dt>
          <dd className="font-medium">{formatBytes(stats.storageUsed)}</dd>
        </div>
      </dl>
    </motion.div>
  )
}
