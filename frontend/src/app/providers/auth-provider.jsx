import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { authService } from '@/services/auth.service'
import {
  clearRememberedEmail,
  removeAccessToken,
  getAccessToken,
  setRememberedEmail,
  setAccessToken,
} from '@/services/auth-storage'
import { setUnauthorizedHandler } from '@/services/api-client'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = useCallback(() => {
    removeAccessToken()
    setUser(null)
  }, [])

  const getCurrentUser = useCallback(async () => {
    const token = getAccessToken()
    if (!token) {
      setUser(null)
      return null
    }

    const currentUser = await authService.getCurrentUser()
    setUser(currentUser)
    return currentUser
  }, [])

  const login = useCallback(async ({ email, password, rememberMe }) => {
    const { user: loggedInUser, accessToken } = await authService.login({
      email,
      password,
    })

    setAccessToken(accessToken)

    if (rememberMe) {
      setRememberedEmail(email)
    } else {
      clearRememberedEmail()
    }

    setUser(loggedInUser)
    return loggedInUser
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout()
    })
  }, [logout])

  useEffect(() => {
    let mounted = true

    async function restoreSession() {
      try {
        if (!getAccessToken()) {
          if (mounted) setUser(null)
          return
        }

        await getCurrentUser()
      } catch {
        removeAccessToken()
        if (mounted) setUser(null)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    restoreSession()

    return () => {
      mounted = false
    }
  }, [getCurrentUser])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      getCurrentUser,
    }),
    [user, isLoading, login, logout, getCurrentUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

export function useAuthActions() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = useCallback(() => {
    logout()
    toast.success('Signed out successfully')
    navigate('/login', { replace: true })
  }, [logout, navigate])

  return { handleLogout }
}
