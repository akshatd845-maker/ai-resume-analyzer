import { memo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Bookmark,
  Briefcase,
  ChevronDown,
  FileText,
  Sparkles,
  Upload,
  Zap,
} from 'lucide-react'

import { useAuth } from '@/app/providers/auth-provider'
import { cn } from '@/lib/utils'

/* ═══════════════════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════════════════ */

function useAnchorScroll() {
  return (id) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

/* ATS Score circular progress ring */
function AtsRing({ score }) {
  const size = 88
  const strokeWidth = 11
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const gradientId = 'atsGreenGrad'

  return (
    <div className="relative mt-1.5 flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.45))' }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-bold leading-none text-white">{score}</span>
        <span className="text-[10px] text-text-secondary">/100</span>
      </div>
    </div>
  )
}

/* Fade-up on viewport enter */
function FadeUp({ children, delay = 0, className }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px 0px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* Section wrapper */
const Section = memo(function Section({ id, children, className }) {
  return (
    <section
      id={id}
      className={cn('relative mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8', className)}
    >
      {children}
    </section>
  )
})

/* Section heading block */
function SectionLabel({ label, title, description, center = true }) {
  return (
    <div className={cn('max-w-2xl', center && 'mx-auto text-center')}>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/25 bg-violet-500/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-violet-400">
        <Sparkles className="size-3" aria-hidden="true" />
        {label}
      </span>
      <h2 className="mt-4 text-[28px] font-bold leading-tight tracking-tight text-white sm:text-[34px]">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">{description}</p>
      ) : null}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: 'Features', id: 'features' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'FAQ', id: 'faq' },
]

function Navbar({ activeSection, onScroll, onLogin }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-background/95 shadow-[0_1px_16px_rgba(0,0,0,0.4)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent backdrop-blur-sm',
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); onScroll('top') }}
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          aria-label="AI Resume Analyzer home"
        >
          <div className="flex size-8 items-center justify-center rounded-[10px] bg-primary shadow-[0_0_14px_rgba(124,58,237,0.5)]">
            <Sparkles className="size-4 text-white" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-white">AI Resume Analyzer</p>
            <p className="text-[10px] text-text-secondary tracking-wider">Analyzer V2</p>
          </div>
        </a>

        {/* Center nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((item) => {
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onScroll(item.id)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-white/[0.05] hover:text-white',
                )}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Right */}
        <button
          type="button"
          onClick={onLogin}
          className="rounded-[10px] border border-border bg-card px-4 py-1.5 text-[13px] font-semibold text-white transition-all duration-150 hover:border-primary/40 hover:bg-primary/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Sign In
        </button>
      </div>
    </header>
  )
}

/* ═══════════════════════════════════════════════════════════════
   HERO — DASHBOARD PREVIEW CARD
═══════════════════════════════════════════════════════════════ */

const PROGRESS_BARS = [
  { label: 'Content', value: 88, color: 'bg-primary' },
  { label: 'Formatting', value: 76, color: 'bg-blue-500' },
  { label: 'Skills', value: 92, color: 'bg-success' },
  { label: 'Experience', value: 70, color: 'bg-warning' },
]

function DashboardPreview() {
  const reduced = useReducedMotion()

  return (
    <motion.div
      animate={reduced ? {} : { y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-full"
    >
      {/* Glow backdrop */}
      <div
        className="pointer-events-none absolute -inset-6 rounded-[36px] blur-3xl"
        style={{ background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.20) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative rounded-[24px] border border-border bg-card p-7 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        {/* Bottom bar / control simulation */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-destructive" />
            <div className="size-2 rounded-full bg-warning" />
            <div className="size-2 rounded-full bg-success" />
          </div>
          <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-accent">
            Live Analysis
          </span>
        </div>

        {/* Score row */}
        <div className="grid grid-cols-3 gap-4">
          {/* ATS Score */}
          <div className="col-span-1 flex flex-col items-center justify-center rounded-[16px] border border-border bg-background py-6">
            <p className="text-[10px] font-medium text-text-secondary">ATS Score</p>
            <AtsRing score={92} />
            <span className="mt-2.5 rounded-full bg-success/10 px-2 py-0.5 text-[9px] font-semibold text-success">
              Excellent
            </span>
          </div>

          {/* Right mini stats */}
          <div className="col-span-2 grid grid-rows-2 gap-4">
            <div className="rounded-[16px] border border-border bg-background px-5 py-4">
              <p className="text-[10px] text-text-secondary">Keyword Match</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                  />
                </div>
                <span className="text-[12px] font-bold text-accent">85%</span>
              </div>
            </div>
            <div className="rounded-[16px] border border-border bg-background px-5 py-4">
              <p className="text-[10px] text-text-secondary">AI Suggestions</p>
              <p className="mt-1 text-[24px] font-bold leading-none text-white">24</p>
            </div>
          </div>
        </div>

        {/* Resume report card */}
        <div className="mt-5 rounded-[16px] border border-border bg-background p-5">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="size-3.5 text-accent" aria-hidden="true" />
            <p className="text-[11px] font-semibold text-white/90">Resume Preview</p>
            <span className="ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-accent">
              Report
            </span>
          </div>
          <div className="space-y-3.5">
            {PROGRESS_BARS.map((bar) => (
              <div key={bar.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-secondary">{bar.label}</span>
                  <span className="font-medium text-white">{bar.value}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                  <motion.div
                    className={cn('h-full rounded-full', bar.color)}
                    initial={{ width: 0 }}
                    animate={{ width: `${bar.value}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════ */

function HeroSection({ onCTA, onDemo }) {
  const reduced = useReducedMotion()

  return (
    <Section id="top" className="pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/4 top-0 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-violet-500/8 blur-[120px]" />
        <div className="absolute right-1/4 top-32 h-64 w-64 rounded-full bg-violet-400/5 blur-[80px]" />
        {/* Animated subtle gradient orb */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-16 h-[600px] w-[600px] -translate-x-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,1) 0%, transparent 70%)' }}
        />
      </div>

      <div className="grid items-center gap-12 lg:grid-cols-[5fr_7fr] lg:gap-12">
        {/* Left */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/25 bg-violet-500/8 px-3 py-1 text-[11px] font-semibold text-violet-400">
            <Sparkles className="size-3" aria-hidden="true" />
            ✨ AI-Powered Resume Analysis
          </span>

          {/* Heading */}
          <h1 className="mt-5 text-[40px] font-extrabold leading-[1.1] tracking-tight text-white sm:text-[52px]">
            Turn Your Resume Into{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #A855F7 0%, #8B5CF6 60%, #6D28D9 100%)' }}
            >
              An ATS&#8209;Winning
            </span>{' '}
            Story.
          </h1>

          {/* Subheading */}
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-text-secondary">
            Upload your resume once. Receive ATS score, AI suggestions, and job
            matching insights within seconds.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onCTA}
              className="group inline-flex h-11 items-center gap-2 rounded-[12px] bg-primary px-6 text-[14px] font-semibold text-white shadow-[0_4px_20px_rgba(139,92,246,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary hover:shadow-[0_8px_28px_rgba(139,92,246,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Analyze your resume"
            >
              Analyze My Resume
              <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onDemo}
              className="inline-flex h-11 items-center gap-2 rounded-[12px] border border-border bg-card px-6 text-[14px] font-medium text-white transition-all duration-200 hover:border-border-hover hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              View Demo
            </button>
          </div>
        </motion.div>

        {/* Right — dashboard preview */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </Section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TAGLINE STRIP
═══════════════════════════════════════════════════════════════ */

function TaglineStrip() {
  return (
    <div className="border-y border-border bg-background/80 py-8">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-8">
          {[
            '⚡ Instant ATS scoring',
            '🎯 AI-powered suggestions',
            '🔒 Secure & private',
            '🚀 Job matching built-in',
          ].map((item) => (
            <span key={item} className="text-[13px] font-medium text-text-secondary">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FEATURES
═══════════════════════════════════════════════════════════════ */

const FEATURES = [
  {
    id: 'ats',
    icon: BarChart3,
    title: 'ATS Optimization',
    description:
      'Detect missing keywords, formatting risks, and ATS-unfriendly patterns before your application reaches a recruiter.',
    color: 'text-accent',
    bg: 'bg-primary/10',
    glow: 'hover:shadow-[0_8px_32px_rgba(139,92,246,0.15)]',
  },
  {
    id: 'ai',
    icon: Sparkles,
    title: 'AI Suggestions',
    description:
      'Receive targeted bullet rewrites, tone improvements, and role-specific clarity suggestions powered by AI.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    glow: 'hover:shadow-[0_8px_32px_rgba(59,130,246,0.12)]',
  },
  {
    id: 'keyword',
    icon: Zap,
    title: 'Keyword Matching',
    description:
      'See exactly which keywords your resume is missing and how to add them naturally without sounding robotic.',
    color: 'text-warning',
    bg: 'bg-warning/10',
    glow: 'hover:shadow-[0_8px_32px_rgba(245,158,11,0.10)]',
  },
  {
    id: 'report',
    icon: Bookmark,
    title: 'Detailed Reports',
    description:
      'Get a full breakdown of your resume score with actionable next steps categorized by priority.',
    color: 'text-success',
    bg: 'bg-success/10',
    glow: 'hover:shadow-[0_8px_32px_rgba(34,197,94,0.10)]',
  },
]

function FeaturesSection() {
  return (
    <Section id="features" className="py-24">
      <FadeUp>
        <SectionLabel
          label="Features"
          title="Everything you need to improve your resume"
          description="AI-powered optimization designed for modern hiring."
        />
      </FadeUp>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => {
          const Icon = f.icon
          return (
            <FadeUp key={f.id} delay={i * 0.07}>
              <div
                className={cn(
                  'group h-full rounded-[20px] border border-border bg-card p-6',
                  'transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(255,255,255,0.14)]',
                  f.glow,
                )}
              >
                <span
                  className={cn(
                    'inline-flex size-10 items-center justify-center rounded-[12px] transition-transform duration-200 group-hover:scale-110',
                    f.bg,
                  )}
                >
                  <Icon className={cn('size-5', f.color)} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{f.description}</p>
              </div>
            </FadeUp>
          )
        })}
      </div>
    </Section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   HOW IT WORKS
═══════════════════════════════════════════════════════════════ */

const STEPS = [
  { n: '01', icon: Upload, title: 'Upload Resume', description: 'Drop your PDF and let the parser extract your content instantly.' },
  { n: '02', icon: Sparkles, title: 'AI Analysis', description: 'Our AI scans for keyword gaps, clarity issues, and role alignment signals.' },
  { n: '03', icon: BarChart3, title: 'Receive Suggestions', description: 'Get a full ATS score plus prioritized, actionable improvement steps.' },
  { n: '04', icon: Briefcase, title: 'Apply With Confidence', description: 'Match your resume to target roles and apply knowing you stand out.' },
]

function HowItWorksSection() {
  return (
    <Section id="how-it-works" className="py-24">
      {/* Subtle border-top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.08)] to-transparent" aria-hidden="true" />

      <FadeUp>
        <SectionLabel
          label="How It Works"
          title="From upload to interview-ready in minutes"
          description="A clean four-step pipeline designed for speed."
        />
      </FadeUp>

      <div className="relative mt-16 grid gap-6 lg:grid-cols-4">
        {/* Animated connector line (desktop) */}
        <div className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px overflow-hidden lg:block" aria-hidden="true">
          <motion.div
            className="h-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.4) 20%, rgba(168,85,247,0.6) 50%, rgba(124,58,237,0.4) 80%, transparent 100%)',
            }}
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {STEPS.map((s, i) => {
          const Icon = s.icon
          return (
            <FadeUp key={s.n} delay={i * 0.1}>
              <div className="relative flex flex-col gap-4">
                {/* Mobile vertical connector */}
                {i < STEPS.length - 1 ? (
                  <div className="absolute left-5 top-full h-6 w-px bg-gradient-to-b from-primary/40 to-transparent lg:hidden" aria-hidden="true" />
                ) : null}

                <div className="rounded-[20px] border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_8px_32px_rgba(139,92,246,0.12)]">
                  {/* Step number */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-accent">
                      Step {s.n}
                    </span>
                    <span className="inline-flex size-9 items-center justify-center rounded-[10px] bg-primary/10">
                      <Icon className="size-4 text-accent" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{s.description}</p>
                </div>
              </div>
            </FadeUp>
          )
        })}
      </div>
    </Section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FAQ
═══════════════════════════════════════════════════════════════ */

const FAQ_ITEMS = [
  {
    id: 'f1',
    q: 'How secure is my resume?',
    a: 'Your resume is processed securely and never shared with third parties. Files are encrypted in transit and at rest. You can delete your uploaded files at any time from your profile settings.',
  },
  {
    id: 'f2',
    q: 'Which file formats are supported?',
    a: 'We support PDF uploads only. For the most accurate parsing, use a PDF exported from a standard word processor without embedded tables or complex graphics.',
  },
  {
    id: 'f3',
    q: 'How does the ATS scoring work?',
    a: 'The ATS engine analyzes keyword coverage, formatting compatibility, and structural completeness against common applicant tracking system patterns. Scores reflect how well your resume is likely to parse and rank — not a guarantee of any specific outcome.',
  },
  {
    id: 'f4',
    q: 'What do the AI suggestions actually do?',
    a: 'After parsing your resume, the AI identifies keyword gaps, clarity issues, and role alignment signals. It returns prioritized suggestions you can apply directly to your document.',
  },
  {
    id: 'f5',
    q: 'Can I upload multiple resumes?',
    a: 'Yes. You can upload and manage multiple resume versions from your dashboard, track their ATS scores, and compare analysis results across files.',
  },
]

function FaqItem({ item, open, onToggle }) {
  return (
    <div
      className={cn(
        'rounded-[16px] border transition-colors duration-200',
        open ? 'border-primary/30 bg-primary/[0.04]' : 'border-border bg-card hover:border-border-hover',
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[16px]"
      >
        <span className="text-[14px] font-medium text-white">{item.q}</span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-text-secondary transition-transform duration-200',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        >
        </ChevronDown>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-4 text-[13px] leading-relaxed text-text-secondary">{item.a}</p>
      </motion.div>
    </div>
  )
}

function FaqSection() {
  const [open, setOpen] = useState('f1')
  return (
    <Section id="faq" className="py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.08)] to-transparent" aria-hidden="true" />
      <FadeUp>
        <SectionLabel
          label="FAQ"
          title="Common questions"
          description="Everything you need to know before getting started."
        />
      </FadeUp>
      <div className="mx-auto mt-10 max-w-2xl space-y-2">
        {FAQ_ITEMS.map((item) => (
          <FadeUp key={item.id} delay={0.05}>
            <FaqItem
              item={item}
              open={open === item.id}
              onToggle={() => setOpen((p) => (p === item.id ? '' : item.id))}
            />
          </FadeUp>
        ))}
      </div>
    </Section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FINAL CTA
═══════════════════════════════════════════════════════════════ */

function CtaSection({ onLogin }) {
  return (
    <Section className="py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.08)] to-transparent" aria-hidden="true" />
      <FadeUp>
        <div className="relative overflow-hidden rounded-[24px] border border-primary/20 bg-card px-8 py-16 text-center sm:px-16">
          {/* Glow */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.14) 0%, transparent 60%)',
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)',
            }}
            aria-hidden="true"
          />

          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-accent">
            <Sparkles className="size-3" aria-hidden="true" />
            Get started free
          </span>

          <h2 className="mx-auto mt-5 max-w-2xl text-[32px] font-extrabold leading-tight tracking-tight text-white sm:text-[40px]">
            Ready to build a resume that gets interviews?
          </h2>

          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-text-secondary">
            Create your account and start improving your resume with AI.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={onLogin}
              className="group inline-flex h-12 items-center gap-2 rounded-[12px] bg-primary px-8 text-[15px] font-semibold text-white shadow-[0_4px_20px_rgba(139,92,246,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary hover:shadow-[0_8px_32px_rgba(139,92,246,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Sign in to get started"
            >
              Sign In
              <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </FadeUp>
    </Section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════ */

function Footer({ onScroll }) {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        {/* Brand + tagline */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-[10px] bg-primary shadow-[0_0_14px_rgba(124,58,237,0.4)]">
              <Sparkles className="size-4 text-white" aria-hidden="true" />
            </div>
            <p className="text-[13px] font-semibold text-white">AI Resume Analyzer</p>
          </div>
          <p className="text-[13px] text-text-secondary">
            AI-powered resume analysis platform.
          </p>
        </div>

        {/* Links */}
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3" aria-label="Footer navigation">
          <button
            type="button"
            onClick={() => onScroll('features')}
            className="text-[13px] text-text-secondary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            Features
          </button>
          <button
            type="button"
            onClick={() => onScroll('how-it-works')}
            className="text-[13px] text-text-secondary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => onScroll('faq')}
            className="text-[13px] text-text-secondary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            FAQ
          </button>
          <a
            href="/privacy"
            className="text-[13px] text-text-secondary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-[13px] text-text-secondary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            Terms of Service
          </a>
          <a
            href="/contact"
            className="text-[13px] text-text-secondary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            Contact
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-[13px] text-text-secondary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            GitHub
          </a>
        </nav>

        {/* Copyright */}
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-[12px] text-text-secondary">
            © {new Date().getFullYear()} AI Resume Analyzer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ROOT PAGE
═══════════════════════════════════════════════════════════════ */

export function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const scrollTo = useAnchorScroll()

  const [activeSection, setActiveSection] = useState('top')

  // Intersection observer — track active nav section
  useEffect(() => {
    const ids = ['top', 'features', 'how-it-works', 'faq']
    const observers = ids.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.2, rootMargin: '-64px 0px -50% 0px' },
      )
      obs.observe(el)
      return { obs, el }
    })
    return () => observers.forEach((o) => o?.obs.unobserve(o.el))
  }, [])

  // Auth-aware CTA — authenticated → /resumes, guest → /login?redirect
  const handleCTA = () => {
    if (isAuthenticated) {
      navigate('/resumes')
    } else {
      navigate('/login?redirect=%2Fresumes')
    }
  }

  const handleLogin = () => navigate('/login')
  const handleDemo = () => scrollTo('how-it-works')

  return (
    <div
      id="top"
      className="min-h-screen overflow-x-hidden bg-background text-foreground"
    >
      {/* Subtle animated background gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        {/* Radial glow 1 — top-left */}
        <div
          className="absolute -top-40 -left-32 h-[700px] w-[700px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 65%)' }}
        />
        {/* Radial glow 2 — bottom-right */}
        <div
          className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 65%)' }}
        />
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
          }}
          aria-hidden="true"
        />
        {/* Animated center orb */}
        <motion.div
          animate={{ opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }}
        />
      </div>

      <Navbar
        activeSection={activeSection}
        onScroll={scrollTo}
        onLogin={handleLogin}
      />

      <main>
        <HeroSection onCTA={handleCTA} onDemo={handleDemo} />
        <TaglineStrip />
        <FeaturesSection />
        <HowItWorksSection />
        <FaqSection />
        <CtaSection onLogin={handleLogin} />
      </main>

      <Footer onScroll={scrollTo} />
    </div>
  )
}
