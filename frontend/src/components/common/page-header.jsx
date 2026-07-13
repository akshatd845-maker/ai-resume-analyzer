import { cn } from '@/lib/utils'

export function PageHeader({ title, description, actions, className, ...props }) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
      {...props}
    >
      <div className="space-y-1">
        {title ? (
          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        ) : null}
        {description ? (
          <p className="text-sm text-text-secondary">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  )
}
