import { memo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { SidebarProvider } from '@/app/providers/sidebar-provider'
import { AppSidebar, MobileSidebar } from '@/components/layout/app-sidebar'
import { TopNav } from '@/components/layout/top-nav'

const pageTransition = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.2, ease: 'easeOut' },
}

function PageContent() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} {...pageTransition} className="min-h-full">
        <Outlet />
      </motion.div>
    </AnimatePresence>
  )
}

export const AppLayout = memo(function AppLayout() {
  return (
    <SidebarProvider>
      <div
        className="flex min-h-screen w-full overflow-x-hidden bg-background"
      >
        <AppSidebar />
        <MobileSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav />
          <main className="flex-1 overflow-y-auto">
            <PageContent />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
})
