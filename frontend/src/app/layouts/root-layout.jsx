import { Outlet } from 'react-router-dom'

import { AuthProvider } from '@/app/providers/auth-provider'
import { ErrorBoundary } from '@/components/common'

export function RootLayout() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </AuthProvider>
  )
}

