import { useQuery } from '@tanstack/react-query'

import { fetchAdminDashboard } from '@/features/admin/services/admin.service'

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: fetchAdminDashboard,
  })
}
