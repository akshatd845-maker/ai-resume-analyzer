import { useMemo } from 'react'

import { useAuth } from '@/app/providers/auth-provider'
import { navigationItems } from '@/config/navigation'

export function useNavigation() {
  const { user, isAuthenticated } = useAuth()

  const items = useMemo(
    () =>
      navigationItems.filter((item) => {
        if (item.requiresAuth && !isAuthenticated) return false
        if (!item.allowedRoles?.length) return true
        return item.allowedRoles.includes(user?.role)
      }),
    [user, isAuthenticated],
  )

  return items
}
