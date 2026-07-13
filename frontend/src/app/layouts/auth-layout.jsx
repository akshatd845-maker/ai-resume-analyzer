import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

import { BrandPanel } from '@/components/auth/brand-panel'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left branding panel — 45% on desktop, hidden on mobile */}
      <div className="hidden lg:flex lg:w-[45%] lg:min-h-screen">
        <BrandPanel className="w-full" />
      </div>

      {/* Right auth panel — 55% on desktop, full width on mobile */}
      <div className="flex flex-1 flex-col min-h-screen">
        {/* Mobile-only logo header */}
        <div className="flex items-center border-b border-white/[0.06] px-6 py-4 lg:hidden">
          <BrandPanel compact />
        </div>

        {/* Centered card area */}
        <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-[420px]"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
