import { cn } from '@/lib/utils'
import { getPasswordStrength } from '@/lib/auth-schemas'
import { Progress } from '@/components/ui/progress'

const strengthBarClasses = [
  '[&>div]:bg-destructive',
  '[&>div]:bg-warning',
  '[&>div]:bg-warning',
  '[&>div]:bg-success',
  '[&>div]:bg-success',
]

export function PasswordStrength({ password }) {
  const { score, label } = getPasswordStrength(password)

  if (!password) return null

  return (
    <div className="space-y-2" aria-live="polite">
      <div className="flex items-center justify-between">
        <p className="text-caption text-muted-foreground">Password strength</p>
        <p className="text-caption font-medium">{label}</p>
      </div>
      <Progress
        value={(score + 1) * 20}
        className={cn('h-1.5', strengthBarClasses[score])}
      />
    </div>
  )
}
