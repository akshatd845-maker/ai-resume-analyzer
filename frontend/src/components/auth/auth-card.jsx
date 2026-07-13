import { cn } from '@/lib/utils'

export function AuthCard({ title, description, children, className, footer }) {
  return (
    <div
      className={cn(
        'w-full rounded-2xl border border-border bg-card',
        'shadow-[0_24px_64px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.06)]',
        className,
      )}
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <h1 className="text-xl font-semibold tracking-tight text-white">{title}</h1>
        {description ? (
          <p className="mt-1.5 text-sm text-text-secondary">{description}</p>
        ) : null}
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Body */}
      <div className="px-8 py-6">{children}</div>

      {/* Footer */}
      {footer ? (
        <>
          <div className="h-px bg-border" />
          <div className="px-8 py-4">{footer}</div>
        </>
      ) : null}
    </div>
  )
}
