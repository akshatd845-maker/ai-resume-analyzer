import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, MoreHorizontal } from 'lucide-react'

import { formatDate } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

function AtsScorePill({ score }) {
  if (!score && score !== 0) return <span className="text-[12px] text-text-secondary">—</span>
  const variant = score >= 80 ? 'success' : score >= 60 ? 'warning' : 'destructive'
  return (
    <Badge variant={variant} className="px-2.5 py-0.5 text-[11px] font-semibold tabular-nums">
      {score}
    </Badge>
  )
}

function ResumeRow({ resume, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: 0.1 + index * 0.05 }}
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5
                 transition-colors hover:bg-white/[0.04]"
    >
      {/* File icon */}
      <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-primary/15">
        <FileText className="size-4 text-accent" aria-hidden="true" />
      </span>

      {/* Name + date */}
      <div className="min-w-0 flex-1">
        <Link
          to="/resumes"
          className="block truncate text-[13px] font-medium text-white
                     hover:text-primary focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-primary rounded transition-colors"
        >
          {resume.fileName ?? resume.originalFileName ?? 'Untitled Resume'}
        </Link>
        <p className="text-[11px] text-text-secondary">
          {resume.uploadedAt ? formatDate(resume.uploadedAt) : 'Unknown date'}
        </p>
      </div>

      {/* ATS Score */}
      <AtsScorePill score={resume.atsScore} />

      {/* Three-dot menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="ml-1 rounded-[8px] p-1 text-text-secondary opacity-0 transition-opacity
                       group-hover:opacity-100 hover:bg-white/[0.07] hover:text-white
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                       focus-visible:opacity-100"
            aria-label="Resume options"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem asChild>
            <Link to="/resumes">View</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/analysis">Analyze</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  )
}

export function DashboardRecentResumes({ data }) {
  const history = data?.resume?.history ?? []
  const latest = data?.resume?.latest
  const atsScore = data?.ats?.latestScore ?? data?.ats?.result?.overallScore

  const rows = (history.length ? history : latest ? [latest] : [])
    .slice(0, 5)
    .map((r, i) => ({ ...r, atsScore: i === 0 ? atsScore : undefined }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="h-full"
    >
      <Card className="p-5 h-full hover:border-border-hover cursor-default">
        <section aria-labelledby="recent-resumes-title" className="h-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 id="recent-resumes-title" className="text-[15px] font-semibold text-white">
              Recent Resumes
            </h2>
            <Link
              to="/resumes"
              className="text-[12px] font-medium text-primary transition-colors
                         hover:text-primary/80 focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              View All
            </Link>
          </div>

          {/* Column headers */}
          <div className="mt-3 flex items-center gap-3 px-3 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
            <span className="size-8 shrink-0" aria-hidden="true" />
            <span className="flex-1">Name</span>
            <span className="w-16 text-center">ATS</span>
            <span className="w-5" aria-hidden="true" />
          </div>

          {/* Rows */}
          <div className="mt-1 space-y-0.5">
            {rows.length ? (
              rows.map((resume, i) => (
                <ResumeRow key={resume.id ?? resume._id ?? i} resume={resume} index={i} />
              ))
            ) : (
              <p className="px-3 py-4 text-[13px] text-text-secondary">No resumes uploaded yet.</p>
            )}
          </div>
        </section>
      </Card>
    </motion.div>
  )
}
