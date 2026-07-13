import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Search, Upload } from 'lucide-react'

import { SidebarMenuButton } from '@/components/layout/app-sidebar'
import { UserMenu } from '@/components/layout/user-menu'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export const TopNav = memo(function TopNav() {
  return (
    <header
      className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-sm sm:px-6"
    >
      {/* Mobile menu toggle */}
      <SidebarMenuButton />

      {/* Centered search */}
      <div className="hidden flex-1 items-center justify-center md:flex">
        <div className="relative w-full max-w-sm">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-text-secondary"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search resumes, jobs, skills…"
            aria-label="Search"
            className={cn(
              'h-9 w-full rounded-[14px] border border-border bg-card',
              'pl-9 pr-4 text-[13px] text-white placeholder:text-text-placeholder',
              'transition-all duration-200',
              'focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20',
              'hover:border-border-hover',
            )}
          />
        </div>
      </div>

      {/* Mobile spacer */}
      <div className="flex-1 md:hidden" />

      {/* Right actions */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Notification bell */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative size-9 rounded-[10px] text-[#A8A8B3] hover:bg-white/[0.06] hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              {/* Pulse ring + dot */}
              <span className="absolute right-1.5 top-1.5 flex size-2 items-center justify-center" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-50" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>

        <UserMenu />

        {/* Divider */}
        <div className="h-5 w-px bg-white/[0.10]" aria-hidden="true" />

        {/* Upload CTA */}
        <Button
          asChild
          size="sm"
          className="hidden h-8 rounded-[10px] bg-[#8B5CF6] px-4 text-[13px] font-semibold text-white
                     hover:bg-[#7C3AED] hover:shadow-[0_4px_12px_rgba(139,92,246,0.4)] sm:flex"
        >
          <Link to="/resumes" aria-label="Upload resume">
            <Upload className="size-3.5" />
            Upload Resume
          </Link>
        </Button>
      </div>
    </header>
  )
})
