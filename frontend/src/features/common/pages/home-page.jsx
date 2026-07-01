import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  ChevronDown,
  GitBranch,
  Loader2,
  Sparkles,
  Star,
  Upload,
} from 'lucide-react'



import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function useAnchorScroll() {
  return (id) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow ? (
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-small text-muted">
          <Sparkles className="size-4" />
          <span>{eyebrow}</span>
        </div>
      ) : null}
      <h2 className="text-h2 mt-2">{title}</h2>
      {description ? <p className="text-body mt-3 text-muted">{description}</p> : null}
    </div>
  )
}

function LogoMark() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative size-9 rounded-xl border border-border/60 bg-gradient-to-b from-primary/15 to-transparent p-[2px]">
        <div className="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent opacity-80" />
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="size-4 rounded-md bg-primary/90 shadow-elevation-sm" />
        </div>
      </div>
      <div className="leading-tight">
        <div className="text-body font-semibold tracking-tight">ResumeAI</div>
        <div className="text-caption text-muted">Analyzer V2</div>
      </div>
    </div>
  )
}

function PricingPlaceholder() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="overflow-hidden p-6 shadow-elevation-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full">
                Coming soon
              </Badge>
              <Star className="size-4 text-muted" />
            </div>
            <h3 className="text-h3 mt-2">Starter</h3>
            <p className="text-body mt-2 text-muted">
              For personal projects and first-time optimization.
            </p>
          </div>
          <div className="text-right">
            <div className="text-display">—</div>
            <div className="text-caption text-muted">per month</div>
          </div>
        </div>
        <ul className="mt-5 grid gap-3 text-small text-muted">
          <li className="flex items-center gap-2">
            <Check className="size-4 text-success" />
            ATS scan + score
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-4 text-success" />
            AI resume suggestions
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-4 text-success" />
            Job match insights
          </li>
        </ul>
      </Card>

      <Card className="overflow-hidden p-6 shadow-elevation-md border-primary/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="rounded-full">Most popular</Badge>
            </div>
            <h3 className="text-h3 mt-2">Pro</h3>
            <p className="text-body mt-2 text-muted">
              More matches, deeper scoring signals, faster iteration.
            </p>
          </div>
          <div className="text-right">
            <div className="text-display">—</div>
            <div className="text-caption text-muted">per month</div>
          </div>
        </div>
        <ul className="mt-5 grid gap-3 text-small text-muted">
          <li className="flex items-center gap-2">
            <Check className="size-4 text-success" />
            Priority analysis
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-4 text-success" />
            Resume scoring trends
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-4 text-success" />
            Job matching for multiple roles
          </li>
        </ul>
      </Card>
    </div>
  )
}

function FAQItem({ q, a, open, onToggle }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card/60">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-body font-medium">{q}</span>
        <ChevronDown
          className={
            'size-5 shrink-0 transition-transform ' + (open ? 'rotate-180' : 'rotate-0')
          }
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-4 text-small text-muted">{a}</div>
      </motion.div>
    </div>
  )
}

export function HomePage() {
  const scrollTo = useAnchorScroll()
  const reducedMotion = useReducedMotion()
  const [openFAQ, setOpenFAQ] = useState('faq-1')

  const navbarItems = useMemo(
    () => [
      { label: 'Home', id: 'top' },
      { label: 'Features', id: 'features' },
      { label: 'Pricing', id: 'pricing', placeholder: true },
    ],
    [],
  )

  const trustedFeatures = useMemo(
    () => [
      {
        title: 'ATS Analysis',
        description: 'Detect missing keywords, formatting risks, and ATS-unfriendly structure.',
        icon: Upload,
      },
      {
        title: 'AI Suggestions',
        description: 'Rewrite bullets to be clearer, stronger, and more role-aligned.',
        icon: Sparkles,
      },
      {
        title: 'Resume Scoring',
        description: 'A transparent score that highlights what to improve next.',
        icon: Star,
      },
      {
        title: 'Job Matching',
        description: 'See how well your resume matches the job you care about.',
        icon: Check,
      },
      {
        title: 'Fast Analysis',
        description: 'From upload to ATS score in seconds—ready for iteration.',
        icon: Loader2,
      },
    ],
    [],
  )

  const whyChooseUs = useMemo(
    () => [
      {
        title: 'Modern, premium UX',
        description: 'Clean hierarchy, readable typography, and frictionless flows.',
      },
      {
        title: 'Actionable insights',
        description: 'Not just feedback—clear next steps you can apply immediately.',
      },
      {
        title: 'Built for dark mode',
        description: 'Legible contrast and polished surfaces across themes.',
      },
      {
        title: 'Designed for speed',
        description: 'Quick scans that help you move from resume to interviews faster.',
      },
    ],
    [],
  )

  const faq = useMemo(
    () => [
      {
        id: 'faq-1',
        q: 'Is my resume uploaded to a server?',
        a: 'This landing page does not implement any backend. In the full product, uploads are processed by the server according to privacy policies.',
      },
      {
        id: 'faq-2',
        q: 'Will this replace human resume review?',
        a: 'No—think of it as an ATS-focused co-pilot. You get structured improvements plus guidance for making your resume stronger.',
      },
      {
        id: 'faq-3',
        q: 'Does it work for different job titles?',
        a: 'Yes. The analysis is role-aware and focuses on keyword coverage, structure, and match signals.',
      },
      {
        id: 'faq-4',
        q: 'Is there a free tier?',
        a: 'Start Free is a placeholder CTA on this landing page. Pricing details will be published during product launch.',
      },
    ],
    [],
  )

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4 sm:max-w-4xl sm:px-6 lg:max-w-6xl">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              scrollTo('top')
            }}
            className="flex items-center gap-2"
          >
            <LogoMark />
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {navbarItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="h-9 px-3 text-muted hover:text-foreground"
                onClick={() => scrollTo(item.id)}
              >
                {item.label}
                {item.placeholder ? (
                  <span className="ml-2 text-caption text-muted">•</span>
                ) : null}
              </Button>
            ))}
          </nav>

              <div className="flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden text-muted hover:text-foreground md:block"
              aria-label="GitHub"
            >
              <GitBranch className="size-5" />
            </a>


            <Button
              variant="ghost"
              className="hidden md:inline-flex"
              onClick={() => {
                // Placeholder for Login route
                scrollTo('cta')
              }}
            >
              Login
            </Button>

            <Button
              className="hidden md:inline-flex"
              onClick={() => scrollTo('cta')}
            >
              Get Started <ArrowRight className="size-4" />
            </Button>

            <Button
              variant="outline"
              className="md:hidden"
              onClick={() => scrollTo('features')}
              aria-label="Open navigation"
            >
              <span className="sr-only">Navigate</span>
              <span className="text-body">Menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute top-36 right-0 h-72 w-72 rounded-full bg-success/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-2xl px-4 py-14 sm:max-w-4xl sm:px-6 sm:py-20 lg:max-w-6xl">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-2 text-small text-muted">
                  <Sparkles className="size-4" />
                  ATS-ready resumes—without the guesswork
                </div>

                <h1 className="text-display mt-5">
                  Turn your resume into an ATS-winning story.
                </h1>

                <p className="text-body mt-4 text-muted">
                  Upload once. Get an ATS score, AI suggestions, and job matching signals in seconds.
                  Built to help you iterate fast and apply with confidence.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button className="h-11 px-5" onClick={() => scrollTo('cta')}>
                    Upload Resume <ArrowRight className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 px-5 border-border/70"
                    onClick={() => scrollTo('how-it-works')}
                  >
                    How it works
                  </Button>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {["ATS score", "AI suggestions", "Job matching"].map((t) => (
                    <div key={t} className="rounded-xl border border-border/60 bg-card/40 px-4 py-3">
                      <div className="text-small text-muted">{t}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="lg:justify-self-end"
              >
                <Card className="relative overflow-hidden rounded-2xl border-border/70 bg-card/60 p-6 shadow-elevation-lg">
                  <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="rounded-full">Live preview</Badge>
                      <span className="text-caption text-muted">Illustration placeholder</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-success/80" />
                      <div className="text-caption text-muted">Ready</div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4">
                    <div className="h-40 rounded-xl border border-border/60 bg-background/40 p-4">
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-primary/70" />
                        <div className="size-10 rounded-lg bg-primary/20" />
                      </div>
                      <div className="mt-4 grid grid-cols-12 gap-3">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div
                            key={i}
                            className={
                              'col-span-12 h-3 rounded bg-muted/70 opacity-' +
                              (i % 3 === 0 ? '80' : '60')
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-border/60 bg-background/30 p-4">
                        <div className="text-small text-muted">ATS score</div>
                        <div className="text-h2 mt-2">92</div>
                        <div className="text-caption text-muted mt-1">High match</div>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-background/30 p-4">
                        <div className="text-small text-muted">Top improvement</div>
                        <div className="text-h3 mt-2">Keyword coverage</div>
                        <div className="text-caption text-muted mt-1">Add 6 missing terms</div>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.12 }}
                    className="mt-6 flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 px-4 py-3"
                  >
                    <Upload className="size-5 text-primary" />
                    <div>
                      <div className="text-small text-muted">Next step</div>
                      <div className="text-body font-medium">Upload your resume</div>
                    </div>
                  </motion.div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trusted Features */}
        <section id="features" className="border-t border-border/60">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Trusted by job seekers"
              title="Everything you need to improve in one pass"
              description="ATS analysis, AI suggestions, scoring, and job matching—designed for clarity and speed."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              {trustedFeatures.map((f, idx) => {
                const Icon = f.icon
                return (
                  <motion.div
                    key={f.title}
                    initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20% 0px' }}
                    transition={{ duration: 0.45, delay: idx * 0.03 }}
                    className="h-full"
                  >
                    <Card className="h-full rounded-2xl border-border/70 bg-card/50 p-6 shadow-elevation-md transition-transform hover:-translate-y-1 hover:shadow-elevation-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10">
                            <Icon className="size-5 text-primary" />
                          </span>
                          <h3 className="text-h3">{f.title}</h3>
                        </div>
                      </div>
                      <p className="text-body mt-3 text-muted">{f.description}</p>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t border-border/60">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="How it works"
              title="A clean pipeline from upload to match"
              description="Upload resume → AI analysis → ATS score → job matching."
            />

            <div className="mt-12 grid gap-6 lg:grid-cols-4 lg:items-start">
              {[
                {
                  step: '01',
                  title: 'Upload Resume',
                  description: 'Drag & drop and let the system parse your content.',
                  icon: Upload,
                },
                {
                  step: '02',
                  title: 'AI Analysis',
                  description: 'Keyword signals, clarity improvements, and suggestions.',
                  icon: Sparkles,
                },
                {
                  step: '03',
                  title: 'ATS Score',
                  description: 'A transparent score that points to what matters most.',
                  icon: Star,
                },
                {
                  step: '04',
                  title: 'Job Matching',
                  description: 'See how your resume lines up with target roles.',
                  icon: Check,
                },
              ].map((s, i) => {
                const Icon = s.icon
                return (
                  <div key={s.step} className="relative">
                    {i < 3 ? (
                      <div className="hidden lg:block absolute -right-6 top-10">
                        <div className="h-0 w-0 border-l-[14px] border-l-primary/20 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent" />
                      </div>
                    ) : null}
                    <Card className="rounded-2xl border-border/70 bg-card/50 p-6 shadow-elevation-md">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-caption text-muted">Step {s.step}</div>
                          <h3 className="text-h3 mt-2">{s.title}</h3>
                        </div>
                        <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                          <Icon className="size-5 text-primary" />
                        </span>
                      </div>
                      <p className="text-body mt-3 text-muted">{s.description}</p>
                    </Card>
                    {i === 0 ? (
                      <div className="lg:hidden mt-4">
                        <div className="flex items-center justify-center gap-3 text-muted">
                          <span className="text-small">↓</span>
                        </div>
                      </div>
                    ) : null}
                    {i > 0 && i < 3 ? (
                      <div className="lg:hidden mt-4">
                        <div className="flex items-center justify-center gap-3 text-muted">
                          <span className="text-small">↓</span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section id="why" className="border-t border-border/60">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Why choose us"
              title="Premium signals for a better job search"
              description="Modern cards, subtle motion, and insights you can act on right away."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {whyChooseUs.map((c, idx) => (
                <motion.div
                  key={c.title}
                  initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20% 0px' }}
                  transition={{ duration: 0.45, delay: idx * 0.04 }}
                  className="h-full"
                >
                  <Card className="h-full rounded-2xl border-border/70 bg-card/50 p-6 shadow-elevation-md transition-transform hover:-translate-y-1 hover:shadow-elevation-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-h3">{c.title}</h3>
                        <p className="text-body mt-3 text-muted">{c.description}</p>
                      </div>
                      <div className="hidden size-10 items-center justify-center rounded-2xl bg-primary/10 sm:flex" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing (placeholder) */}
        <section id="pricing" className="border-t border-border/60">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Pricing"
              title="Simple plans. Premium results."
              description="This is a placeholder pricing section for Phase 2."
            />
            <div className="mt-10">
              <PricingPlaceholder />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-border/60">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <SectionHeader
              eyebrow="FAQ"
              title="Answers, without the fluff"
              description="Quick questions about how this co-pilot works."
            />

            <div className="mt-10 grid gap-4">
              {faq.map((item) => (
                <FAQItem
                  key={item.id}
                  q={item.q}
                  a={item.a}
                  open={openFAQ === item.id}
                  onToggle={() => setOpenFAQ((prev) => (prev === item.id ? '' : item.id))}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="border-t border-border/60">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/60 p-8 shadow-elevation-lg sm:p-10">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
              <div className="grid items-center gap-8 lg:grid-cols-2">
                <div>
                  <h2 className="text-display">Start Free. Improve today.</h2>
                  <p className="text-body mt-4 text-muted">
                    Upload your resume and get an ATS score with AI suggestions—ready for your next application.
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button className="h-11 px-6" onClick={() => scrollTo('top')}>
                      Start Free <ArrowRight className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-11 px-6 border-border/70"
                      onClick={() => scrollTo('how-it-works')}
                    >
                      Upload Resume
                    </Button>
                  </div>

                  <div className="mt-6 text-caption text-muted">
                    No authentication or backend is used in this landing page build.
                  </div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/30 p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-small text-muted">Preview</div>
                    <Badge className="rounded-full">Fast</Badge>
                  </div>
                  <div className="mt-4 grid gap-3">
                    {[
                      { label: 'ATS scan', value: 'Complete' },
                      { label: 'Suggestions', value: 'Ready' },
                      { label: 'Job match', value: 'Scored' },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/50 px-4 py-3">
                        <div className="text-small text-muted">{row.label}</div>
                        <div className="text-small font-medium">{row.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-3">
                    <Check className="size-5 text-success" />
                    <div>
                      <div className="text-small text-muted">Result highlight</div>
                      <div className="text-body font-medium">Highest leverage improvements</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl border border-border/60 bg-card/50" />
              <div>
                <div className="text-body font-semibold">ResumeAI</div>
                <div className="text-caption text-muted">Premium ATS analysis</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-small text-muted">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground">
                GitHub
              </a>
              <a href="#" className="hover:text-foreground">
                Documentation
              </a>
              <a href="#" className="hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground">
                Terms
              </a>
              <a href="#" className="hover:text-foreground">
                Contact
              </a>
            </div>
          </div>

          <div className="mt-8 text-caption text-muted">© {new Date().getFullYear()} ResumeAI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

