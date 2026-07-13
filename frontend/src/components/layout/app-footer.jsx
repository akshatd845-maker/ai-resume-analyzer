import { memo } from 'react'

import { APP_NAME } from '@/constants/app'

export const AppFooter = memo(function AppFooter() {
  return (
    <footer className="border-t border-border px-4 py-3 sm:px-6">
      <p className="text-caption text-muted-foreground">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </p>
    </footer>
  )
})
