import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

export function RememberMe({ id = 'remember-me', checked, onCheckedChange, label = 'Remember me' }) {
  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange?.(event.target.checked)}
        className={cn(
          'size-4 rounded border border-input accent-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
      />
      <Label htmlFor={id} className="cursor-pointer text-small font-normal">
        {label}
      </Label>
    </div>
  )
}
