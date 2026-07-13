import { Check, X } from 'lucide-react'

import { cn } from '@/lib/utils'

export function PasswordMatch({ password, confirmPassword }) {
  if (!confirmPassword) return null

  const matches = password === confirmPassword

  return (
    <p
      className={cn(
        'flex items-center gap-1.5 text-caption',
        matches ? 'text-success' : 'text-destructive',
      )}
      aria-live="polite"
    >
      {matches ? <Check className="size-3.5" /> : <X className="size-3.5" />}
      {matches ? 'Passwords match' : 'Passwords do not match'}
    </p>
  )
}
