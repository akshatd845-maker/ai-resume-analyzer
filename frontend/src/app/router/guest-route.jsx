import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/app/providers/auth-provider'
import { LoadingState } from '@/components/common'

export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingState />
  }

  if (isAuthenticated) {
    const params = new URLSearchParams(location.search)
    const redirectTo = params.get('redirect')
    const destination =
      redirectTo && redirectTo.startsWith('/') ? redirectTo : '/dashboard'
    return <Navigate to={destination} replace />
  }

  return <Outlet />
}
