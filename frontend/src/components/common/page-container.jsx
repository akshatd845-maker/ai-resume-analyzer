import { cn } from '@/lib/utils'

const maxWidthMap = {
  sm: 'max-w-[var(--container-sm)]',
  md: 'max-w-[var(--container-md)]',
  lg: 'max-w-[var(--container-lg)]',
  xl: 'max-w-[var(--container-xl)]',
  '2xl': 'max-w-[var(--container-2xl)]',
  full: 'max-w-full',
}

export function PageContainer({
  children,
  className,
  size = '2xl',
  ...props
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 py-8 sm:px-6 lg:px-8',
        maxWidthMap[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
