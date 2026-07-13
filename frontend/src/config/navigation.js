import {
  BarChart3,
  Bookmark,
  Briefcase,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Sparkles,
  Upload,
  User,
} from 'lucide-react'

export const navigationItems = [
  // ── MAIN ──────────────────────────────────────────────────────
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    requiresAuth: true,
    allowedRoles: ['user', 'admin'],
    group: 'main',
  },
  {
    id: 'resume',
    label: 'My Resumes',
    icon: FileText,
    path: '/resumes',
    requiresAuth: true,
    allowedRoles: ['user', 'admin'],
    group: 'main',
  },
  {
    id: 'upload',
    label: 'Upload Resume',
    icon: Upload,
    path: '/resumes',
    requiresAuth: true,
    allowedRoles: ['user', 'admin'],
    group: 'main',
    highlight: true,
  },

  // ── AI TOOLS ──────────────────────────────────────────────────
  {
    id: 'analysis',
    label: 'Resume Analysis',
    icon: BarChart3,
    path: '/analysis',
    requiresAuth: true,
    allowedRoles: ['user', 'admin'],
    group: 'ai',
  },
  {
    id: 'ai-suggestions',
    label: 'AI Suggestions',
    icon: Sparkles,
    path: '/analysis',
    requiresAuth: true,
    allowedRoles: ['user', 'admin'],
    group: 'ai',
  },
  {
    id: 'jobs',
    label: 'Job Matching',
    icon: Briefcase,
    path: '/jobs',
    requiresAuth: true,
    allowedRoles: ['user', 'admin'],
    group: 'ai',
  },
  {
    id: 'saved-jobs',
    label: 'Saved Jobs',
    icon: Bookmark,
    path: '/jobs',
    requiresAuth: true,
    allowedRoles: ['user', 'admin'],
    group: 'ai',
  },

  // ── ACCOUNT ───────────────────────────────────────────────────
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    path: '/profile',
    requiresAuth: true,
    allowedRoles: ['user', 'admin'],
    group: 'account',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    requiresAuth: true,
    allowedRoles: ['user', 'admin'],
    group: 'account',
  },
  {
    id: 'help',
    label: 'Help & Support',
    icon: HelpCircle,
    path: null,
    action: 'help',
    requiresAuth: true,
    allowedRoles: ['user', 'admin'],
    group: 'account',
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: Shield,
    path: '/admin',
    requiresAuth: true,
    allowedRoles: ['admin'],
    group: 'account',
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: LogOut,
    path: null,
    action: 'logout',
    requiresAuth: true,
    allowedRoles: ['user', 'admin'],
    group: 'account',
  },
]

export const publicRoutes = ['/', '/login', '/register']

export function getNavItemByPath(pathname) {
  return navigationItems.find(
    (item) => item.path && (pathname === item.path || pathname.startsWith(`${item.path}/`)),
  )
}
