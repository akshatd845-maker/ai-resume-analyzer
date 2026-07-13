import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/app/providers/auth-provider'
import { AuthCard, AuthDivider, RememberMe, SocialButton } from '@/components/auth'
import { loginSchema } from '@/lib/auth-schemas'
import { getRememberedEmail } from '@/services/auth-storage'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

/* ── Inline styled input with leading icon ── */
function IconInput({ icon: Icon, type = 'text', placeholder, autoComplete, className, ...props }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-secondary" aria-hidden="true" />
      <Input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          'pl-10 h-10 rounded-xl',
          className
        )}
        {...props}
      />
    </div>
  )
}

/* ── Password input with leading icon + visibility toggle ── */
function PasswordIconInput({ autoComplete = 'current-password', ...props }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-secondary" aria-hidden="true" />
      <Input
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        placeholder="••••••••"
        className="pl-10 pr-10 h-10 rounded-xl"
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [error, setError] = useState('')

  const params = new URLSearchParams(location.search)
  const redirectTo = params.get('redirect')
  const destination = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/dashboard'

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: getRememberedEmail(),
      password: '',
      rememberMe: Boolean(getRememberedEmail()),
    },
    mode: 'onTouched',
  })

  const onSubmit = async (values) => {
    setError('')
    try {
      await login(values)
      toast.success('Welcome back!')
      navigate(destination, { replace: true })
    } catch (err) {
      const message = err.response?.data?.message ?? 'Unable to sign in. Please try again.'
      setError(message)
      toast.error(message)
    }
  }

  const { isSubmitting } = form.formState

  return (
    <AuthCard
      title="Sign in to your account"
      description="Enter your credentials to access your account."
      footer={
        <p className="text-center text-xs text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link
            to={redirectTo ? `/register?redirect=${encodeURIComponent(redirectTo)}` : '/register'}
            className="font-medium text-violet-400 transition-colors hover:text-violet-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            Create account
          </Link>
        </p>
      }
    >
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
        animate={error ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Error alert */}
        {error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-2.5">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        ) : null}

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="block text-xs font-medium text-text-secondary">
            Email
          </label>
          <IconInput
            id="login-email"
            icon={Mail}
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            aria-describedby={form.formState.errors.email ? 'login-email-error' : undefined}
            {...form.register('email')}
          />
          {form.formState.errors.email ? (
            <p id="login-email-error" className="text-xs text-red-400">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="block text-xs font-medium text-text-secondary">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-text-secondary transition-colors hover:text-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordIconInput
            id="login-password"
            autoComplete="current-password"
            aria-describedby={form.formState.errors.password ? 'login-password-error' : undefined}
            {...form.register('password')}
          />
          {form.formState.errors.password ? (
            <p id="login-password-error" className="text-xs text-red-400">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>

        {/* Remember me */}
        <RememberMe
          checked={form.watch('rememberMe')}
          onCheckedChange={(val) => form.setValue('rememberMe', val)}
        />

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 rounded-xl font-semibold flex items-center justify-center gap-2"
          aria-label="Sign in"
        >
          <span>
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </span>
          {!isSubmitting ? <ArrowRight className="size-4" aria-hidden="true" /> : null}
        </Button>

        {/* Divider + Google */}
        <AuthDivider />
        <SocialButton
          onClick={() => {
            const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
            window.location.href = `${apiBase}/auth/google`
          }}
        />
      </motion.form>
    </AuthCard>
  )
}
