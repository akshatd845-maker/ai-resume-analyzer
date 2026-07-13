import { motion } from 'framer-motion'
import { Lock, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'

/* ── floating Resume + AI illustration (shapes only, no fake data) ── */
function ResumeAIIllustration() {
  return (
    <div className="relative flex h-64 w-full items-center justify-center" aria-hidden="true">
      {/* Outer orbit ring */}
      <div className="absolute size-52 rounded-full border border-violet-500/10" />
      <div className="absolute size-36 rounded-full border border-violet-500/15" />

      {/* Blurred ambient glow */}
      <div className="absolute size-40 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="absolute -right-4 top-8 size-20 rounded-full bg-violet-400/8 blur-2xl" />

      {/* Resume card — floats */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/2 top-1/2 -translate-x-[calc(50%+28px)] -translate-y-[calc(50%+8px)]"
      >
        <div className="w-28 rounded-xl border border-violet-500/20 bg-zinc-900/80 p-3 shadow-2xl backdrop-blur-sm">
          {/* Doc header */}
          <div className="mb-2 flex items-center gap-1.5">
            <div className="size-4 rounded bg-violet-500/20 flex items-center justify-center">
              <div className="size-2 rounded-sm bg-violet-400/70" />
            </div>
            <div className="h-1.5 w-12 rounded-full bg-zinc-700" />
          </div>
          {/* Content lines */}
          <div className="space-y-1.5">
            <div className="h-1 w-full rounded-full bg-zinc-700/80" />
            <div className="h-1 w-4/5 rounded-full bg-zinc-700/60" />
            <div className="h-1 w-3/5 rounded-full bg-zinc-700/60" />
          </div>
          <div className="mt-2.5 space-y-1">
            <div className="h-1 w-full rounded-full bg-zinc-800" />
            <div className="h-1 w-full rounded-full bg-zinc-800" />
            <div className="h-1 w-2/3 rounded-full bg-zinc-800" />
          </div>
        </div>
      </motion.div>

      {/* AI orb — counter-floats */}
      <motion.div
        animate={{ y: [0, 8, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute left-1/2 top-1/2 translate-x-[18px] translate-y-[-4px]"
      >
        <div className="relative flex size-14 items-center justify-center rounded-2xl border border-violet-500/30 bg-zinc-900/90 shadow-[0_0_30px_rgba(124,58,237,0.25)] backdrop-blur-sm">
          <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top_left,_rgba(124,58,237,0.2),transparent_60%)]" />
          <Sparkles className="relative z-10 size-6 text-violet-400" />
        </div>
      </motion.div>

      {/* Connector dot trail */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
          className="absolute left-1/2 top-1/2 size-1 rounded-full bg-violet-400/50"
          style={{
            transform: `translate(calc(-50% + ${(i - 1) * 10}px), calc(-50% + 16px))`,
          }}
        />
      ))}
    </div>
  )
}

export function BrandPanel({ className, compact = false }) {
  if (compact) {
    return (
      <div className={cn('flex items-center gap-2.5', className)}>
        <div className="flex size-7 items-center justify-center rounded-lg bg-violet-600 shadow">
          <Sparkles className="size-3.5 text-white" />
        </div>
        <span className="text-small font-semibold text-foreground">ResumeAI</span>
      </div>
    )
  }

  return (
    <aside
      className={cn(
        'relative flex flex-col justify-between overflow-hidden',
        'bg-background border-r border-border',
        className,
      )}
      aria-label="Product information"
    >
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Purple radial glow */}
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/12 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-violet-500/8 blur-3xl" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Thin abstract curved lines */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.04]"
          viewBox="0 0 400 700"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <path d="M-40 200 Q200 100 440 300 Q200 500 -40 400 Z" stroke="rgba(167,139,250,0.6)" strokeWidth="1" fill="none" />
          <path d="M-40 350 Q200 250 440 450 Q200 600 -40 550 Z" stroke="rgba(167,139,250,0.4)" strokeWidth="0.5" fill="none" />
          <ellipse cx="200" cy="350" rx="180" ry="100" stroke="rgba(124,58,237,0.15)" strokeWidth="0.5" fill="none" />
        </svg>
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(167,139,250,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-10 py-10">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-600/20 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
            <Sparkles className="size-4 text-violet-300" />
          </div>
          <div>
            <p className="text-small font-semibold text-foreground">ResumeAI</p>
            <p className="mt-1 text-[10px] text-text-secondary tracking-wide uppercase">AI Resume Analyzer</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="mt-12">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[2rem] font-bold leading-tight tracking-tight text-foreground"
          >
            Welcome back.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-1 text-[2rem] font-bold leading-tight tracking-tight text-accent"
          >
            Let&apos;s improve your resume.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26 }}
            className="mt-4 max-w-xs text-small leading-relaxed text-text-secondary"
          >
            Sign in to continue your journey toward better opportunities.
          </motion.p>
        </div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex-1 flex items-center justify-center"
        >
          <ResumeAIIllustration />
        </motion.div>

        {/* Bottom trust badge */}
        <div className="flex items-center gap-2 text-text-muted-alt">
          <Lock className="size-3 text-text-muted-alt" />
          <span className="text-[11px]">Your data is encrypted and securely stored.</span>
        </div>
      </div>
    </aside>
  )
}
