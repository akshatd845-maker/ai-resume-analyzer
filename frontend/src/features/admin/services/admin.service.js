import { apiClient } from '@/services/api-client'

export async function fetchAdminDashboard() {
  const { data } = await apiClient.get('/dashboard/admin')
  return data.data
}
