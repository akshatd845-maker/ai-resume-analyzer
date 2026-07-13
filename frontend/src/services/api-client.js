import axios from 'axios'

import { getAccessToken } from '@/services/auth-storage'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let onUnauthorized = null
let isRefreshing = false

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

export async function refreshToken() {
  // Placeholder for future refresh-token flow. Backend currently uses a single JWT.
  if (isRefreshing) return null
  isRefreshing = true
  try {
    return null
  } finally {
    isRefreshing = false
  }
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const originalRequest = error.config

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshed = await refreshToken()

      if (refreshed) {
        originalRequest.headers.Authorization = `Bearer ${refreshed}`
        return apiClient(originalRequest)
      }

      // Clear local auth state and redirect to login, preserving current path
      onUnauthorized?.()
      const currentPath = window.location.pathname + window.location.search
      const loginUrl =
        currentPath && currentPath !== '/login'
          ? `/login?redirect=${encodeURIComponent(currentPath)}`
          : '/login'
      window.location.replace(loginUrl)
    }

    return Promise.reject(error)
  },
)
