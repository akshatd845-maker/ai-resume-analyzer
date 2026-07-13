import { cn } from '@/lib/utils'

/* Standalone status badge — no dependency on the Badge UI primitive
   so it never picks up the wrong variant styles. */

const statusStyles = {
  success:  'border-[#22C55E]/30 bg-[#22C55E]/15 text-[#22C55E]',
  warning:  'border-[#F59E0B]/30 bg-[#F59E0B]/15 text-[#F59E0B]',
  danger:   'border-[#EF4444]/30 bg-[#EF4444]/15 text-[#EF4444]',
  info:     'border-[#8B5CF6]/30 bg-[#8B5CF6]/15 text-[#A78BFA]',
  pending:  'border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.07)] text-[rgba(255,255,255,0.65)]',
  default:  'border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.07)] text-[rgba(255,255,255,0.75)]',
}

export function StatusBadge({ status = 'default', label, className, ...props }) {
  const style = statusStyles[status] ?? statusStyles.default
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center justify-center rounded-full border',
        'px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        style,
        className,
      )}
      {...props}
    >
      {label ?? status}
    </span>
  )
}
