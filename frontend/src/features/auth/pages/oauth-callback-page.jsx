import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { useAuth } from '@/app/providers/auth-provider'
import { authService } from '@/services/auth.service'
import { setAccessToken } from '@/services/auth-storage'

/**
 * OAuthCallbackPage
 *
 * Backend redirects here with a one-time code after Google OAuth:
 *   /auth/callback?code=<one-time-code>
 *
 * This page exchanges the code for a JWT via POST /api/auth/oauth/exchange.
 */
export function OAuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { getCurrentUser } = useAuth()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    async function handleCallback() {
      const code = searchParams.get('code')
      const error = searchParams.get('error')

      if (error || !code) {
        toast.error('Google sign-in failed. Please try again.')
        navigate('/login?error=google_auth_failed', { replace: true })
        return
      }

      try {
        const accessToken = await authService.exchangeOAuthCode(code)
        setAccessToken(accessToken)
        await getCurrentUser()
        toast.success('Signed in with Google!')
        navigate('/dashboard', { replace: true })
      } catch {
        toast.error('Unable to complete sign-in. Please try again.')
        navigate('/login?error=session_error', { replace: true })
      }
    }

    handleCallback()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <svg
          className="size-8 animate-spin text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <p className="text-sm text-text-secondary">Completing sign-in…</p>
      </div>
    </div>
  )
}
