import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/app/providers/auth-provider'
import {
  AuthCard,
  AuthDivider,
  PasswordMatch,
  PasswordStrength,
  RememberMe,
  SocialButton,
} from '@/components/auth'
import { registerSchema } from '@/lib/auth-schemas'
import { authService } from '@/services/auth.service'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

/* ── Inline icon input (same pattern as login) ── */
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

/* ── Password icon input ── */
function PasswordIconInput({ autoComplete = 'new-password', placeholder = '••••••••', ...props }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-secondary" aria-hidden="true" />
      <Input
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        placeholder={placeholder}
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

export function RegisterForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [error, setError] = useState('')

  const params = new URLSearchParams(location.search)
  const redirectTo = params.get('redirect')
  const destination = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/dashboard'

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    mode: 'onTouched',
  })

  const password = form.watch('password')
  const confirmPassword = form.watch('confirmPassword')
  const { isSubmitting } = form.formState

  const onSubmit = async (values) => {
    setError('')
    try {
      await authService.register(values)
      await login({ email: values.email, password: values.password })
      toast.success('Account created successfully')
      navigate(destination, { replace: true })
    } catch (err) {
      const message = err.response?.data?.message ?? 'Unable to create account. Please try again.'
      setError(message)
      toast.error(message)
    }
  }

  return (
    <AuthCard
      title="Create your account"
      description="Start building ATS-friendly resumes today."
      footer={
        <p className="text-center text-xs text-text-secondary">
          Already have an account?{' '}
          <Link
            to={redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login'}
            className="font-medium text-violet-400 transition-colors hover:text-violet-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            Sign in
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

        {/* Full name */}
        <div className="space-y-1.5">
          <label htmlFor="reg-name" className="block text-xs font-medium text-text-secondary">
            Full name
          </label>
          <IconInput
            id="reg-name"
            icon={User}
            type="text"
            placeholder="Alex Johnson"
            autoComplete="name"
            aria-describedby={form.formState.errors.name ? 'reg-name-error' : undefined}
            {...form.register('name')}
          />
          {form.formState.errors.name ? (
            <p id="reg-name-error" className="text-xs text-red-400">
              {form.formState.errors.name.message}
            </p>
          ) : null}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="reg-email" className="block text-xs font-medium text-text-secondary">
            Email
          </label>
          <IconInput
            id="reg-email"
            icon={Mail}
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            aria-describedby={form.formState.errors.email ? 'reg-email-error' : undefined}
            {...form.register('email')}
          />
          {form.formState.errors.email ? (
            <p id="reg-email-error" className="text-xs text-red-400">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="reg-password" className="block text-xs font-medium text-text-secondary">
            Password
          </label>
          <PasswordIconInput
            id="reg-password"
            autoComplete="new-password"
            aria-describedby={form.formState.errors.password ? 'reg-password-error' : undefined}
            {...form.register('password')}
          />
          <PasswordStrength password={password} />
          {form.formState.errors.password ? (
            <p id="reg-password-error" className="text-xs text-red-400">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <label htmlFor="reg-confirm" className="block text-xs font-medium text-text-secondary">
            Confirm password
          </label>
          <PasswordIconInput
            id="reg-confirm"
            autoComplete="new-password"
            aria-describedby={form.formState.errors.confirmPassword ? 'reg-confirm-error' : undefined}
            {...form.register('confirmPassword')}
          />
          <PasswordMatch password={password} confirmPassword={confirmPassword} />
          {form.formState.errors.confirmPassword ? (
            <p id="reg-confirm-error" className="text-xs text-red-400">
              {form.formState.errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        {/* Accept terms */}
        <RememberMe
          id="accept-terms"
          checked={form.watch('acceptTerms')}
          onCheckedChange={(val) => form.setValue('acceptTerms', val, { shouldValidate: true })}
          label="I accept the terms and conditions"
        />
        {form.formState.errors.acceptTerms ? (
          <p className="text-xs text-red-400">{form.formState.errors.acceptTerms.message}</p>
        ) : null}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 rounded-xl font-semibold flex items-center justify-center gap-2"
          aria-label="Create account"
        >
          <span>
            {isSubmitting ? 'Creating account…' : 'Create Account'}
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
