import { motion } from 'framer-motion'

import { ContentContainer, PageContainer } from '@/components/common'

export function JobsShell({ children }) {
  return (
    <PageContainer>
      <ContentContainer>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-8"
        >
          {children}
        </motion.div>
      </ContentContainer>
    </PageContainer>
  )
}

