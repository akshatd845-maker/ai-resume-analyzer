import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Eye,
  FileSearch,
  FileText,
  LayoutGrid,
  List,
  MoreHorizontal,
  Trash2,
  Upload,
} from 'lucide-react'

import {
  filterAndSortResumes,
  getAnalysisStatusLabel,
  getAnalysisStatusVariant,
} from '@/features/resume/services/resume.service'
import { formatBytes, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { SearchInput, StatusBadge } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'ats', label: 'ATS score' },
]

const STATUS_FILTERS = [
  { value: 'all', label: 'All statuses' },
  { value: 'completed', label: 'Analyzed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'none', label: 'Not analyzed' },
]

export function ResumeFilters({
  search,
  onSearchChange,
  sort,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  resultCount,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <SearchInput
        placeholder="Search by filename…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search resumes"
        containerClassName="w-full sm:max-w-xs"
      />
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort resumes"
          className="h-9 rounded-md border border-border bg-card px-3 text-sm text-white shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:border-border-hover cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          aria-label="Filter by analysis status"
          className="h-9 rounded-md border border-border bg-card px-3 text-sm text-white shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:border-border-hover cursor-pointer"
        >
          {STATUS_FILTERS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="flex rounded-md border border-input" role="group" aria-label="View mode">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon-sm"
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon-sm"
            onClick={() => onViewModeChange('list')}
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
          >
            <List className="size-4" />
          </Button>
        </div>
        <span className="text-caption text-text-secondary tabular-nums">
          {resultCount} {resultCount === 1 ? 'resume' : 'resumes'}
        </span>
      </div>
    </div>
  )
}

function stopPropagation(fn) {
  return (e) => {
    e.stopPropagation()
    fn()
  }
}

function ResumeCardActions({ resume, onView, onPreview, onAnalyze, onReplace, onDelete, isAnalyzing }) {
  return (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={stopPropagation(() => onView(resume))}
        aria-label="View resume"
      >
        <Eye className="size-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="More actions">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={stopPropagation(() => onPreview(resume))}>
            <FileText className="size-4" />
            Preview
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={stopPropagation(() => onAnalyze(resume))}
            disabled={isAnalyzing}
          >
            <FileSearch className="size-4" />
            {isAnalyzing ? 'Analyzing…' : 'Analyze'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={stopPropagation(() => onReplace(resume))}>
            <Upload className="size-4" />
            Replace
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={stopPropagation(() => onDelete(resume))}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function getUploadStatusLabel(resume) {
  // Derive only from existing data we already rely on.
  // If we have an upload timestamp, treat it as uploaded.
  if (resume?.uploadedAt) return 'Uploaded'
  return 'Pending'
}

function getUploadStatusVariant(resume) {
  const label = getUploadStatusLabel(resume)
  if (label === 'Uploaded') return 'success'
  return 'pending'
}

function ResumeCard({
  resume,
  isSelected,
  onSelect,
  onView,
  onPreview,
  onAnalyze,
  onReplace,
  onDelete,
  isAnalyzing,
  viewMode,
}) {

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -2 }}
    >
      <Card
        className={cn(
          'cursor-pointer shadow-elevation-sm transition-all duration-300 hover:shadow-elevation-md hover:border-primary/40',
          isSelected ? 'border-primary shadow-[0_0_12px_rgba(124,58,237,0.3)] bg-primary/[0.02]' : 'border-border/60',
          viewMode === 'list' && 'flex-row',
        )}
        onClick={() => onSelect(resume)}
        role="button"
        tabIndex={0}
        aria-selected={isSelected}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect(resume)
          }
        }}
      >
        <CardContent
          className={cn(
            'flex gap-4 p-4',
            viewMode === 'list' ? 'flex-row items-center' : 'flex-col',
          )}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="truncate text-small font-semibold" title={resume.originalFileName}>
                {resume.originalFileName}
              </p>
              <ResumeCardActions
                resume={resume}
                onView={onView}
                onPreview={onPreview}
                onAnalyze={onAnalyze}
                onReplace={onReplace}
                onDelete={onDelete}
                isAnalyzing={isAnalyzing}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-caption text-text-secondary">
              <span>{formatDate(resume.uploadedAt)}</span>
              <span aria-hidden="true">·</span>
              <span>{formatBytes(resume.fileSize)}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge
                status={getUploadStatusVariant(resume)}
                label={`Upload: ${getUploadStatusLabel(resume)}`}
              />
              <StatusBadge
                status={getAnalysisStatusVariant(resume.analysisStatus)}
                label={getAnalysisStatusLabel(resume.analysisStatus)}
              />
              {resume.atsScore != null ? (
                <span className="rounded-md border border-border bg-card-elevated px-2 py-0.5 text-caption font-medium tabular-nums text-white">
                  ATS {resume.atsScore}%
                </span>
              ) : null}
            </div>

          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function ResumeGrid({
  enriched,
  search,
  sort,
  statusFilter,
  viewMode,
  selectedId,
  onSelect,
  onView,
  onPreview,
  onAnalyze,
  onReplace,
  onDelete,
  analyzingId,
}) {
  const filtered = useMemo(
    () => filterAndSortResumes(enriched, { search, sort, statusFilter }),
    [enriched, search, sort, statusFilter],
  )

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
        <span className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-white/[0.04]">
          <FileText className="size-5 text-text-secondary" aria-hidden="true" />
        </span>
        <p className="text-small font-medium text-white">No resumes match your filters</p>
        <p className="mt-1 text-caption text-text-secondary">Try adjusting the search or filter criteria.</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid gap-4',
        viewMode === 'grid' ? 'sm:grid-cols-2' : 'grid-cols-1',
      )}
      role="list"
      aria-label="Resume library"
    >
      <AnimatePresence mode="popLayout">
        {filtered.map((resume) => (
          <div key={resume.id} role="listitem">
            <ResumeCard
              resume={resume}
              isSelected={selectedId === resume.id}
              onSelect={onSelect}
              onView={onView}
              onPreview={onPreview}
              onAnalyze={onAnalyze}
              onReplace={onReplace}
              onDelete={onDelete}
              isAnalyzing={analyzingId === resume.id}
              viewMode={viewMode}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function ResumeList({
  resumes,
  enriched,
  search,
  sort,
  statusFilter,
  viewMode,
  onSearchChange,
  onSortChange,
  onStatusFilterChange,
  onViewModeChange,
  selectedId,
  onSelect,
  onView,
  onPreview,
  onAnalyze,
  onReplace,
  onDelete,
  analyzingId,
}) {
  const filtered = useMemo(
    () => filterAndSortResumes(enriched, { search, sort, statusFilter }),
    [enriched, search, sort, statusFilter],
  )

  return (
    <div className="space-y-4">
      <ResumeFilters
        search={search}
        onSearchChange={onSearchChange}
        sort={sort}
        onSortChange={onSortChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        resultCount={filtered.length}
      />
      <ResumeGrid
        resumes={resumes}
        enriched={enriched}
        search={search}
        sort={sort}
        statusFilter={statusFilter}
        viewMode={viewMode}
        selectedId={selectedId}
        onSelect={onSelect}
        onView={onView}
        onPreview={onPreview}
        onAnalyze={onAnalyze}
        onReplace={onReplace}
        onDelete={onDelete}
        analyzingId={analyzingId}
      />
    </div>
  )
}
