import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { getNavItemByPath } from '@/config/navigation'

export function usePageMeta() {
  const { pathname } = useLocation()

  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    const current = getNavItemByPath(pathname)

    const breadcrumbs = [{ label: 'Home', path: '/dashboard' }]

    if (current?.path && current.path !== '/dashboard') {
      breadcrumbs.push({ label: current.label, path: current.path })
    }

    return {
      title: current?.label ?? 'Page',
      breadcrumbs,
      segments,
    }
  }, [pathname])
}
