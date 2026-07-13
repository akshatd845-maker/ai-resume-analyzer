import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SearchInput({ className, containerClassName, ...props }) {
  return (
    <div className={cn('relative', containerClassName)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-text-placeholder"
        aria-hidden="true"
      />
      <input
        type="search"
        className={cn(
          'h-9 w-full rounded-lg pl-9 pr-3',
          'border border-border bg-card',
          'text-sm text-white placeholder:text-text-placeholder',
          'transition-all duration-150 outline-none',
          'focus:border-primary/60 focus:ring-2 focus:ring-primary/20',
          'hover:border-border-hover',
          className,
        )}
        {...props}
      />
    </div>
  )
}
