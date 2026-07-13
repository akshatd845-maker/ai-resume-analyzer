import { cn } from '@/lib/utils'

const columnMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export function PageGrid({ children, className, cols = 3, ...props }) {
  return (
    <div
      className={cn('grid gap-4 sm:gap-6', columnMap[cols] ?? columnMap[3], className)}
      {...props}
    >
      {children}
    </div>
  )
}
