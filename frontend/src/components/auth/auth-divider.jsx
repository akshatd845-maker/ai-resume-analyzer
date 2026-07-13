export function AuthDivider({ label = 'or continue with' }) {
  return (
    <div className="relative flex items-center gap-3 py-1" role="separator" aria-label={label}>
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground whitespace-nowrap">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}
