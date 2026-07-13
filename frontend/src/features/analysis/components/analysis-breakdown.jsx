import { motion } from 'framer-motion'

import { CategoryScoreCard } from './ats-score-card'

export function AnalysisCategoryGrid({ categories = [] }) {
  if (!categories.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {categories.slice(0, 7).map((c) => (
        <CategoryScoreCard
          key={c.key ?? c.title}
          title={c.title}
          icon={c.icon}
          percent={c.percent}
          insight={c.insight}
        />
      ))}
    </motion.div>
  )
}

