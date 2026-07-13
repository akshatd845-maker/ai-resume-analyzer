import { cn } from '@/lib/utils'

export function SectionHeader({ title, description, action, className, ...props }) {
  return (
    <div
      className={cn('flex items-start justify-between gap-4', className)}
      {...props}
    >
      <div className="space-y-1">
        {title ? (
          <h2 className="text-base font-semibold text-[rgba(255,255,255,0.95)]">{title}</h2>
        ) : null}
        {description ? (
          <p className="text-sm text-[rgba(255,255,255,0.55)]">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
