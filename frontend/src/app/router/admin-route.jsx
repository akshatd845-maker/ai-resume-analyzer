import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/app/providers/auth-provider'
import { LoadingState } from '@/components/common'

export function AdminRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingState />
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
