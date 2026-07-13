import { AnimatePresence, motion } from 'framer-motion'

import { JobCard } from '@/features/jobs/components/job-card'

export function JobGrid({ matches, selectedJobId, onSelectJob }) {
  return (
    <section aria-label="Job recommendations">
      <AnimatePresence mode="popLayout">
        <motion.div
          className="grid gap-3 sm:grid-cols-2"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {matches.map((m) => (
            <div key={m.job.id}>
              <JobCard
                job={m.job}
                matchPercentage={m.matchPercentage}
                isSelected={selectedJobId === m.job.id}
                onSelect={() => onSelectJob(m.job.id)}
              />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
