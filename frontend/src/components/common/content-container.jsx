import { cn } from '@/lib/utils'

export function ContentContainer({ children, className, ...props }) {
  return (
    <div className={cn('w-full min-w-0 space-y-6', className)} {...props}>
      {children}
    </div>
  )
}
