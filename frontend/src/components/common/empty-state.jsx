import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl text-center',
        'border border-dashed border-border',
        'bg-card px-6 py-16',
        'transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.02]',
        className,
      )}
      {...props}
    >
      {Icon ? (
        <div
          className={cn(
            'mb-5 flex size-14 items-center justify-center rounded-xl',
            'bg-primary/15 border border-primary/25',
            'shadow-[0_0_24px_rgba(139,92,246,0.10)]',
            'transition-transform duration-200 hover:scale-105',
          )}
        >
          <Icon className="size-6 text-primary" aria-hidden="true" />
        </div>
      ) : null}

      {title ? (
        <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
      ) : null}

      {description ? (
        <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
      ) : null}

      {action ? action : actionLabel ? (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}

