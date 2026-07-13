import { useState } from 'react'
import { Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

import { AuthCard } from '@/components/auth'
import { forgotPasswordSchema } from '@/lib/auth-schemas'
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
import { Input } from '@/components/ui/input'

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false)

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onTouched',
  })

  const onSubmit = async (values) => {
    try {
      await authService.forgotPassword(values.email)
      setSubmitted(true)
      toast.success('If an account exists, a reset link has been sent.')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email')
    }
  }

  return (
    <AuthCard
      title="Forgot password"
      description="Enter your email and we'll send you a reset link"
      footer={
        <p className="text-center text-small text-muted-foreground">
          Remember your password?{' '}
          <Link to="/login" className="font-medium text-foreground hover:underline">
            Sign in
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
                Check your email for the password reset link.
              </AlertDescription>
            </Alert>
          ) : null}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting || submitted}
          >
            {submitted ? 'Email sent' : 'Send reset link'}
          </Button>
        </motion.form>
      </Form>
    </AuthCard>
  )
}
