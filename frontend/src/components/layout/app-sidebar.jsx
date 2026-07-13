import { memo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { PanelLeft, Sparkles, Zap, ArrowUpRight, HelpCircle, LifeBuoy, Mail, MessageSquare } from 'lucide-react'

import { useAuth, useAuthActions } from '@/app/providers/auth-provider'
import { useSidebar } from '@/app/providers/sidebar-provider'
import { useNavigation } from '@/hooks/use-navigation'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

function getInitials(name = '') {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
}

/* ── Nav item ─────────────────────────────────────────────────── */
function NavItem({ item, collapsed, isActive }) {
  const Icon = item.icon

  const baseClass = cn(
    'group relative flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[13px] font-medium',
    'transition-all duration-150 select-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
    isActive
      ? 'text-white'
      : 'text-text-secondary hover:bg-white/[0.06] hover:text-white',
    collapsed && 'justify-center px-2',
  )

  const inner = (
    <>
      {isActive ? (
        <motion.span
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-[12px] bg-primary/15 border border-primary/20 shadow-[0_0_12px_rgba(139,92,246,0.15)]"
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />
      ) : null}
      {/* Active left-bar indicator */}
      {isActive && !collapsed ? (
        <span
          className="absolute left-0 top-1/2 h-[60%] w-0.5 -translate-y-1/2 rounded-full bg-[#A78BFA]"
          aria-hidden="true"
        />
      ) : null}
      <Icon
        className={cn(
          'relative z-10 size-4 shrink-0 transition-colors',
          isActive ? 'text-[#A78BFA]' : 'text-text-secondary group-hover:text-white',
        )}
        aria-hidden="true"
      />
      {!collapsed ? (
        <span className="relative z-10 truncate">{item.label}</span>
      ) : null}
    </>
  )

  const element = item.path ? (
    <Link to={item.path} className={baseClass} aria-current={isActive ? 'page' : undefined}>
      {inner}
    </Link>
  ) : (
    <button type="button" className={cn(baseClass, 'w-full text-left')}>
      {inner}
    </button>
  )

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{element}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs">{item.label}</TooltipContent>
      </Tooltip>
    )
  }

  return element
}

/* ── Section label ────────────────────────────────────────────── */
function SectionLabel({ label, collapsed }) {
  if (collapsed) {
    return <div className="my-2 mx-3 h-px bg-white/[0.08]" aria-hidden="true" />
  }
  return (
    <p className="mb-1 mt-4 px-3 text-[10px] font-semibold uppercase tracking-widest text-text-secondary">
      {label}
    </p>
  )
}

/* ── Sidebar content ──────────────────────────────────────────── */
function SidebarContent({ collapsed, onNavigate }) {
  const location = useLocation()
  const { user } = useAuth()
  const { handleLogout } = useAuthActions()
  const items = useNavigation()
  const [helpOpen, setHelpOpen] = useState(false)

  const mainItems = items.filter((i) => i.group === 'main')
  const aiItems = items.filter((i) => i.group === 'ai')
  const accountItems = items.filter((i) => i.group === 'account')

  const isActive = (item) =>
    item.path &&
    (location.pathname === item.path || location.pathname.startsWith(`${item.path}/`))

  const handleClick = (item) => {
    if (item.action === 'logout') { handleLogout(); onNavigate?.(); return }
    if (item.action === 'help') { setHelpOpen(true); return }
    onNavigate?.()
  }

  return (
    <div className="flex h-full flex-col bg-sidebar overflow-hidden">
      {/* Logo */}
      <div className={cn(
        'flex h-14 shrink-0 items-center border-b border-sidebar-border px-4',
        collapsed && 'justify-center px-2',
      )}>
        <Link
          to="/dashboard"
          className={cn('flex items-center gap-2.5', collapsed && 'justify-center')}
          onClick={onNavigate}
          aria-label="Dashboard home"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary shadow-[0_0_16px_rgba(139,92,246,0.5)]">
            <Sparkles className="size-4 text-white" aria-hidden="true" />
          </div>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-white leading-tight">
                AI Resume Analyzer
              </p>
              <p className="truncate text-[11px] text-text-secondary leading-tight">
                AI Resume Intelligence
              </p>
            </div>
          ) : null}
        </Link>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 py-2">
        <nav aria-label="Main navigation" onClick={onNavigate}>
          {/* MAIN */}
          <div className="px-2">
            <SectionLabel label="Main" collapsed={collapsed} />
            <div className="space-y-0.5">
              {mainItems.map((item) => (
                <div key={item.id} onClick={() => handleClick(item)}>
                  <NavItem item={item} collapsed={collapsed} isActive={isActive(item)} />
                </div>
              ))}
            </div>
          </div>

          {/* AI TOOLS */}
          <div className="px-2">
            <SectionLabel label="AI Tools" collapsed={collapsed} />
            <div className="space-y-0.5">
              {aiItems.map((item) => (
                <div key={item.id} onClick={() => handleClick(item)}>
                  <NavItem item={item} collapsed={collapsed} isActive={isActive(item)} />
                </div>
              ))}
            </div>
          </div>

          {/* ACCOUNT */}
          <div className="px-2">
            <SectionLabel label="Account" collapsed={collapsed} />
            <div className="space-y-0.5">
              {accountItems
                .filter((i) => i.action !== 'logout')
                .map((item) => (
                  <div key={item.id} onClick={() => handleClick(item)}>
                    <NavItem item={item} collapsed={collapsed} isActive={isActive(item)} />
                  </div>
                ))}
            </div>
          </div>
        </nav>
      </ScrollArea>

      {/* Upgrade card */}
      {!collapsed ? (
        <div className="px-3 pb-3">
          <div className="rounded-[12px] border border-primary/20 bg-primary/10 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="size-3 text-accent" aria-hidden="true" />
              <p className="text-[11px] font-semibold text-white">Upgrade to Pro</p>
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed mb-2">
              Unlimited analysis, advanced AI, and priority matching.
            </p>
            <Button
              type="button"
              size="sm"
              className="w-full text-[11px]"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      ) : null}

      {/* User + logout */}
      <div className={cn(
        'shrink-0 border-t border-sidebar-border p-2',
        collapsed ? 'flex flex-col items-center gap-1' : 'space-y-1',
      )}>
        {user ? (
          collapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="flex size-8 items-center justify-center">
                  <Avatar className="size-7">
                    <AvatarFallback className="text-[10px] bg-primary/25 text-accent">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                <p className="font-medium">{user.name}</p>
                <p className="text-text-secondary">{user.email}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-2.5 rounded-[10px] px-2 py-2 hover:bg-white/[0.05] transition-colors">
              <Avatar className="size-7 shrink-0">
                <AvatarFallback className="text-[10px] bg-primary/25 text-accent">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium text-white">{user.name}</p>
                <p className="truncate text-[11px] text-text-secondary">{user.email}</p>
              </div>
            </div>
          )
        ) : null}

        {/* Logout */}
        {(() => {
          const logoutItem = accountItems.find((i) => i.action === 'logout')
          if (!logoutItem) return null
          return (
            <div onClick={() => handleClick(logoutItem)}>
              <NavItem item={logoutItem} collapsed={collapsed} isActive={false} />
            </div>
          )
        })()}
      </div>

      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  )
}

/* ── Desktop sidebar ─────────────────────────────────────────── */
export const AppSidebar = memo(function AppSidebar() {
  const { collapsed, toggleCollapsed } = useSidebar()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 68 : 272 }}
      transition={{ type: 'spring', stiffness: 420, damping: 38 }}
      className="hidden h-screen shrink-0 flex-col md:flex bg-sidebar"
      style={{ borderRight: '1px solid var(--sidebar-border)' }}
      aria-label="Sidebar"
    >
      <SidebarContent collapsed={collapsed} />
      {/* Collapse toggle */}
      <button
        type="button"
        onClick={toggleCollapsed}
        className={cn(
          'absolute bottom-[60px] -right-3 z-50 hidden md:flex',
          'size-6 items-center justify-center rounded-full',
          'border border-sidebar-border bg-sidebar text-text-secondary',
          'transition-colors hover:border-primary/50 hover:text-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        )}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg viewBox="0 0 16 16" className="size-3 fill-current" aria-hidden="true">
          {collapsed ? <path d="M6 4l4 4-4 4" /> : <path d="M10 4L6 8l4 4" />}
        </svg>
      </button>
    </motion.aside>
  )
})

/* ── Mobile sidebar ──────────────────────────────────────────── */
export const MobileSidebar = memo(function MobileSidebar() {
  const { mobileOpen, closeMobile } = useSidebar()

  return (
    <AnimatePresence>
      {mobileOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm md:hidden"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 420, damping: 38 }}
            className="fixed inset-y-0 left-0 z-50 w-[272px] md:hidden bg-sidebar"
            style={{ borderRight: '1px solid var(--sidebar-border)' }}
            aria-label="Mobile navigation"
          >
            <SidebarContent collapsed={false} onNavigate={closeMobile} />
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
})

/* ── Mobile menu button ──────────────────────────────────────── */
export const SidebarMenuButton = memo(function SidebarMenuButton() {
  const { openMobile } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden text-text-secondary hover:text-white"
      onClick={openMobile}
      aria-label="Open navigation menu"
    >
      <PanelLeft className="size-4" />
    </Button>
  )
})

/* ── HelpDialog Modal implementation ────────────────────────── */
const HelpDialog = memo(function HelpDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border border-border bg-card p-6 shadow-elevation-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-h3 text-white">
            <HelpCircle className="size-5 text-primary" />
            Help & Support
          </DialogTitle>
          <DialogDescription className="text-text-secondary text-xs">
            Learn how to use AI Resume Intelligence or get in touch with our team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          {/* FAQ / Guidance Cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card-elevated p-3">
              <h4 className="text-[12px] font-semibold text-text-card flex items-center gap-1.5">
                <LifeBuoy className="size-3.5 text-primary" />
                Resume Analysis
              </h4>
              <p className="mt-1 text-[11px] leading-relaxed text-text-body">
                Upload your resume in PDF format. Run AI Analysis to generate key ATS scores and identify skills gaps.
              </p>
            </div>
            
            <div className="rounded-xl border border-border bg-card-elevated p-3">
              <h4 className="text-[12px] font-semibold text-text-card flex items-center gap-1.5">
                <MessageSquare className="size-3.5 text-primary" />
                Job Matching
              </h4>
              <p className="mt-1 text-[11px] leading-relaxed text-text-body">
                AI scans active roles to calculate compatibility scores. Adjust filters to refine mid, senior, or entry roles.
              </p>
            </div>
          </div>

          {/* Useful Links */}
          <div className="space-y-2.5 rounded-xl border border-border bg-card-elevated p-3">
            <h4 className="text-[12px] font-semibold text-text-card">Support Links</h4>
            <div className="grid gap-2 text-caption">
              <a
                href="https://example.com/docs"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-primary hover:underline group"
              >
                <span className="flex items-center gap-2 text-text-body font-medium group-hover:text-primary">
                  Platform Documentation
                </span>
                <ArrowUpRight className="size-3.5" />
              </a>
              <a
                href="mailto:support@example.com"
                className="flex items-center justify-between text-primary hover:underline group"
              >
                <span className="flex items-center gap-2 text-text-body font-medium group-hover:text-primary">
                  Email Support Desk
                </span>
                <Mail className="size-3.5 text-text-secondary group-hover:text-primary" />
              </a>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-2 pt-2 border-t border-border">
          <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="default" size="sm" asChild>
            <a href="mailto:support@example.com">
              Contact Support
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
