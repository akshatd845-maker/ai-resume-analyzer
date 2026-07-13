import { useMemo } from 'react'
import { Search, MapPin, Briefcase, Star, Building2, ArrowUpDown, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const selectBase =
  'h-10 w-full appearance-none rounded-xl border border-border bg-card pl-9 pr-3 ' +
  'text-[13px] text-white transition-all duration-150 ' +
  'focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 ' +
  'hover:border-border-hover cursor-pointer'

function FilterField({ icon: Icon, children, className }) {
  return (
    <div className={cn('relative', className)}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
        <Icon className="size-3.5" aria-hidden="true" />
      </span>
      {children}
    </div>
  )
}

export function JobFilters({
  search,
  onSearchChange,
  location,
  onLocationChange,
  experienceLevel,
  onExperienceLevelChange,
  matchScore,
  onMatchScoreChange,
  company,
  onCompanyChange,
  sort,
  onSortChange,
  onReset,
}) {
  const isAnyFilterSet =
    Boolean(search) ||
    Boolean(location) ||
    Boolean(experienceLevel) ||
    Boolean(matchScore) ||
    Boolean(company) ||
    sort !== 'newest'

  const matchScoreOptions = useMemo(
    () => [
      { value: '', label: 'Any score' },
      { value: 'high', label: '80%+ High' },
      { value: 'medium', label: '60–79% Medium' },
      { value: 'low', label: '<60% Low' },
    ],
    [],
  )

  const sortOptions = useMemo(
    () => [
      { value: 'newest', label: 'Newest' },
      { value: 'highest', label: 'Highest Match' },
      { value: 'alphabetical', label: 'Alphabetical' },
    ],
    [],
  )

  return (
    <Card
      className="p-4 shadow-sm"
      aria-label="Job filters"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search — widest */}
        <div className="relative flex-1 min-w-0">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            <Search className="size-3.5" aria-hidden="true" />
          </span>
          <Input
            className="pl-9 h-10 text-[13px] rounded-xl"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search job titles…"
            aria-label="Search jobs"
          />
        </div>

        {/* Secondary filters row */}
        <div className="flex flex-wrap gap-2 md:flex-nowrap md:shrink-0">
          {/* Location */}
          <FilterField icon={MapPin} className="w-full sm:w-36 md:w-32">
            <Input
              className="pl-9 h-10 text-[13px] rounded-xl"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="Location"
              aria-label="Location filter"
            />
          </FilterField>

          {/* Experience */}
          <FilterField icon={Briefcase} className="w-full sm:w-36 md:w-36">
            <select
              className={selectBase}
              value={experienceLevel}
              onChange={(e) => onExperienceLevelChange(e.target.value)}
              aria-label="Experience level filter"
            >
              <option value="">Experience</option>
              <option value="entry">Entry</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
              <option value="executive">Executive</option>
            </select>
          </FilterField>

          {/* Match Score */}
          <FilterField icon={Star} className="w-full sm:w-36 md:w-36">
            <select
              className={selectBase}
              value={matchScore}
              onChange={(e) => onMatchScoreChange(e.target.value)}
              aria-label="Match score filter"
            >
              {matchScoreOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FilterField>

          {/* Company */}
          <FilterField icon={Building2} className="w-full sm:w-36 md:w-32">
            <Input
              className="pl-9 h-10 text-[13px] rounded-xl"
              value={company}
              onChange={(e) => onCompanyChange(e.target.value)}
              placeholder="Company"
              aria-label="Company filter"
            />
          </FilterField>

          {/* Sort */}
          <FilterField icon={ArrowUpDown} className="w-full sm:w-36 md:w-36">
            <select
              className={selectBase}
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort order"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FilterField>

          {/* Reset */}
          {isAnyFilterSet ? (
            <Button
              variant="ghost"
              onClick={onReset}
              className="h-10 text-[12px] rounded-xl border border-border text-text-secondary hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive flex items-center gap-1.5 px-3 select-none"
              aria-label="Reset all filters"
            >
              <X className="size-3" aria-hidden="true" />
              Reset
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
