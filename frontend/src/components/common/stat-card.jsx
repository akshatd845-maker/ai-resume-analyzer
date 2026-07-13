import { cn } from '@/lib/utils'

export function StatCard({ label, value, description, icon: Icon, trend, className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-4',
        'shadow-elevation-sm',
        'transition-all duration-200 hover:border-border-hover hover:-translate-y-0.5',
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between pb-1.5">
        <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">
          {label}
        </p>
        {Icon ? <Icon className="size-4 text-text-secondary/60" aria-hidden="true" /> : null}
      </div>
      <p className="mt-1 text-2xl font-bold leading-tight text-white tabular-nums">{value}</p>
      {description ? (
        <p className="mt-1 truncate text-xs text-text-secondary" title={description}>
          {description}
        </p>
      ) : null}
      {trend ? <p className="mt-1 text-xs text-text-secondary">{trend}</p> : null}
    </div>
  )
}
