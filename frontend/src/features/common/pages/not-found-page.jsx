import { Link } from 'react-router-dom'
import { FileQuestion, Home } from 'lucide-react'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mb-6 flex size-24 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 shadow-[0_0_32px_rgba(139,92,246,0.2)]"
      >
        <FileQuestion className="size-12" />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_rgba(124,58,237,0.12)_0%,_transparent_70%)]" />
      </motion.div>

      <h1 className="text-h1 font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
        404
      </h1>
      <h2 className="mt-3 text-h2 font-bold text-white">
        Page Not Found
      </h2>
      <p className="mt-2 text-body text-text-secondary max-w-md">
        The page you are looking for does not exist, has been removed, or has changed address.
      </p>

      <div className="mt-8">
        <Button asChild className="gap-2 shadow-elevation-md">
          <Link to="/">
            <Home className="size-4" />
            Back to Safety
          </Link>
        </Button>
      </div>
    </div>
  )
}
