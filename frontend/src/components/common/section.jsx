import { cn } from '@/lib/utils'

export function Section({ children, className, ...props }) {
  return (
    <section className={cn('space-y-6', className)} {...props}>
      {children}
    </section>
  )
}
