import React from 'react'
import { AlertOctagon, ArrowLeft, RefreshCw, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/providers/auth-provider'
import { getAccessToken } from '@/services/auth-storage'

function ErrorBoundaryFallback({ error, onReset }) {
  let isAuthenticated = false
  try {
    const auth = useAuth()
    isAuthenticated = auth?.isAuthenticated ?? false
  } catch {
    isAuthenticated = !!getAccessToken()
  }

  const handleRetry = () => {
    if (onReset) onReset()
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = isAuthenticated ? '/dashboard' : '/'
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl text-center">
        {/* Glow and Icon */}
        <div className="relative mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
          <AlertOctagon className="size-8 text-destructive animate-pulse" aria-hidden="true" />
        </div>

        {/* Text content */}
        <h1 className="text-xl font-bold tracking-tight text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected rendering error occurred. Please try again or return to the application.
        </p>

        {/* Development Stack Trace */}
        {import.meta.env.DEV && error && (
          <div className="mt-4 max-h-48 overflow-auto rounded-xl border border-red-500/10 bg-red-500/5 p-4 text-left font-mono text-[10px] text-red-400">
            <p className="font-semibold mb-1">{error.toString()}</p>
            <pre className="whitespace-pre-wrap">{error.stack}</pre>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <Button
            onClick={handleRetry}
            className="w-full h-10 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <RefreshCw className="size-4" />
            <span>Retry</span>
          </Button>

          <Button
            onClick={handleGoHome}
            variant="secondary"
            className="w-full h-10 rounded-xl font-semibold border border-border flex items-center justify-center gap-2"
          >
            {isAuthenticated ? (
              <>
                <LayoutDashboard className="size-4" />
                <span>Go to Dashboard</span>
              </>
            ) : (
              <>
                <ArrowLeft className="size-4" />
                <span>Go to Home</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log errors only in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryFallback
          error={this.state.error}
          onReset={this.handleReset}
        />
      )
    }

    return this.props.children
  }
}
