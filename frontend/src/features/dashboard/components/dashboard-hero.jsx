import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

import {
  formatCurrentTime,
  getGreeting,
} from '@/features/dashboard/services/dashboard.service'

export function DashboardHero({ profile }) {
  const firstName = profile?.name?.split(' ')[0] ?? 'there'

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-1"
    >
      {/* Timestamp + status pill */}
      <div className="flex items-center gap-2.5">
        <p className="text-[12px] font-medium text-text-secondary">{formatCurrentTime()}</p>
        <span className="inline-flex items-center gap-1 rounded-full border border-success/25 bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
          <span className="size-1.5 rounded-full bg-success animate-pulse" aria-hidden="true" />
          Active
        </span>
      </div>

      {/* Greeting */}
      <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-white">
        {getGreeting()}, {firstName}{' '}
        <motion.span
          initial={{ rotate: -20, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
          className="inline-block"
          aria-hidden="true"
        >
          👋
        </motion.span>
      </h1>

      {/* Subtitle */}
      <p className="mt-0.5 text-[14px] leading-relaxed text-text-secondary">
        Let&apos;s continue improving your resume and land your dream job.
      </p>

      {/* Decorative accent line */}
      <div
        className="mt-4 h-px w-24"
        style={{ background: 'linear-gradient(90deg, var(--primary), transparent)' }}
        aria-hidden="true"
      />
    </motion.div>
  )
}
