import { cn } from '@/lib/utils'

export function PageActions({ children, className, ...props }) {
  return (
    <div
      className={cn('flex flex-wrap items-center justify-end gap-2', className)}
      {...props}
    >
      {children}
    </div>
  )
}
