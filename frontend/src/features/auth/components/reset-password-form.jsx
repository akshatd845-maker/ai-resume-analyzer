import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

import {
  AuthCard,
  PasswordInput,
  PasswordMatch,
  PasswordStrength,
} from '@/components/auth'
import { resetPasswordSchema } from '@/lib/auth-schemas'
import { authService } from '@/services/auth.service'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

export function ResetPasswordForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  useEffect(() => {
    if (!token || !email) {
      setError('Invalid reset link. Please request a new password reset.')
    }
  }, [token, email])

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onTouched',
  })

  const password = form.watch('password')
  const confirmPassword = form.watch('confirmPassword')

  const onSubmit = async (values) => {
    if (!token || !email) {
      toast.error('Invalid reset link')
      return
    }

    try {
      await authService.resetPassword(email, token, values.password)
      setSubmitted(true)
      toast.success('Password reset successfully!')
      setTimeout(() => navigate('/login', { replace: true }), 1200)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password')
    }
  }

  if (error) {
    return (
      <AuthCard
        title="Reset password"
        description="Unable to reset password"
        footer={
          <p className="text-center text-small text-muted-foreground">
            <Link to="/forgot-password" className="font-medium text-foreground hover:underline">
              Request new reset link
            </Link>
          </p>
        }
      >
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Reset password"
      description="Choose a strong new password for your account"
      footer={
        <p className="text-center text-small text-muted-foreground">
          <Link to="/login" className="font-medium text-foreground hover:underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      <Form {...form}>
        <motion.form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {submitted ? (
            <Alert>
              <AlertDescription>
                Password reset successfully! Redirecting to sign in...
              </AlertDescription>
            </Alert>
          ) : null}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} />
                </FormControl>
                <PasswordStrength password={password} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} />
                </FormControl>
                <PasswordMatch password={password} confirmPassword={confirmPassword} />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting || submitted}
          >
            {submitted ? 'Password updated' : 'Update password'}
          </Button>
        </motion.form>
      </Form>
    </AuthCard>
  )
}
