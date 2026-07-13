import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, Briefcase, Sparkles, Upload } from 'lucide-react'
import { Card } from '@/components/ui/card'

const ACTIONS = [
  {
    id: 'upload',
    title: 'Upload Resume',
    description: 'Add or replace your latest resume.',
    href: '/resumes',
    icon: Upload,
    color: 'text-accent',
    bg: 'bg-primary/15',
  },
  {
    id: 'analyze',
    title: 'Resume Analysis',
    description: 'Run AI analysis for improvements.',
    href: '/analysis',
    icon: BarChart3,
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
  },
  {
    id: 'suggestions',
    title: 'AI Suggestions',
    description: 'Get targeted resume rewrites.',
    href: '/analysis',
    icon: Sparkles,
    color: 'text-amber-400',
    bg: 'bg-warning/15',
  },
  {
    id: 'jobs',
    title: 'Job Matching',
    description: 'Discover roles that fit your profile.',
    href: '/jobs',
    icon: Briefcase,
    color: 'text-emerald-400',
    bg: 'bg-success/15',
  },
]

export function DashboardQuickActions() {
  return (
    <section aria-labelledby="quick-actions-title">
      <h2 id="quick-actions-title" className="mb-4 text-[15px] font-semibold text-white">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.08 + i * 0.05 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className="h-full"
            >
              <Card className="h-full p-4 hover:bg-card-elevated hover:border-border-hover cursor-pointer transition-all duration-200">
                <Link
                  to={action.href}
                  className="flex h-full flex-col gap-3 focus-visible:outline-none rounded-xl"
                >
                  <span
                    className={`inline-flex size-9 items-center justify-center rounded-[12px] ${action.bg}`}
                  >
                    <Icon className={`size-4 ${action.color}`} aria-hidden="true" />
                  </span>
                  <div>
                    {/* Action title — full white */}
                    <p className="text-[13px] font-semibold text-white">{action.title}</p>
                    {/* Description — readable secondary */}
                    <p className="mt-0.5 text-[11px] leading-relaxed text-text-secondary">
                      {action.description}
                    </p>
                  </div>
                </Link>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
