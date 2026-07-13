import { memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

import { usePageMeta } from '@/hooks/use-page-meta'
import { cn } from '@/lib/utils'

export const BreadcrumbNav = memo(function BreadcrumbNav({ className }) {
  const { breadcrumbs } = usePageMeta()

  if (breadcrumbs.length <= 1) return null

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1', className)}>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <div key={crumb.path} className="flex items-center gap-1">
            {index > 0 ? (
              <ChevronRight
                className="size-3.5 text-[rgba(255,255,255,0.60)]"
                aria-hidden="true"
              />
            ) : null}

            {isLast ? (
              <span className="text-caption text-[rgba(255,255,255,0.60)]" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="text-caption text-[rgba(255,255,255,0.60)] transition-colors hover:text-white"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
})

export const PageTitle = memo(function PageTitle({ className }) {
  const { title } = usePageMeta()
  const location = useLocation()

  return (
    <h1 className={cn('text-h3 truncate', className)} key={location.pathname}>
      {title}
    </h1>
  )
})

