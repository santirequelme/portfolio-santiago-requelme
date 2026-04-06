"use client"

import { useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoryCardProps {
  title: string
  content: string
  index: number
}

interface SkillItem {
  name: string
  icon: string
}

// ─── Module-level constants — defined once, never recreated ───────────────────

const SKILLS: SkillItem[] = [
  { name: "Angular · React · Next.js", icon: "code" },
  { name: "TypeScript", icon: "code" },
  { name: "CSS Architecture · Tailwind · Bootstrap", icon: "palette" },
  { name: "Prototyping · Figma-to-Code", icon: "figma" },
  { name: "Framer Motion", icon: "palette" },
  { name: "Performance & Accessibility", icon: "zap" },
  { name: "Frontend Architecture", icon: "layout" },
  { name: "Design Systems", icon: "lightbulb" },
  { name: "AI Agents", icon: "bot" },
]

function SkillIcon({ type }: { type: string }) {
  const iconClasses = "w-5 h-5 text-primary flex-shrink-0 group-hover:text-accent transition-colors duration-200 rounded"

  const icons: Record<string, React.ReactElement> = {
    code: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClasses}>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    palette: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClasses}>
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
      </svg>
    ),
    figma: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={iconClasses}>
        <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.147c-2.476 0-4.49-2.014-4.49-4.49S5.671 0 8.147 0h4.588v8.981zm-4.588-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.147zm4.588 15.019H8.147c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.147 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.147zM8.147 24c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98H8.147z" />
      </svg>
    ),
    zap: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClasses}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    layout: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClasses}>
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <line x1="3" x2="21" y1="9" y2="9" />
        <line x1="9" x2="9" y1="21" y2="9" />
      </svg>
    ),
    lightbulb: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClasses}>
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    ),
    bot: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClasses}>
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
    ),
  }

  return icons[type] || icons.code
}

// ─── Sub-components at module level — never recreated on parent render ─────────

function StoryCard({ title, content, index }: StoryCardProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, x: -32 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -32 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="relative rounded-2xl bg-card/40 border border-border/40 overflow-hidden group"
    >
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="px-6 md:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.h3
            key={title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="text-xl md:text-2xl font-semibold mb-4 text-foreground"
          >
            {title}
          </motion.h3>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={content}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="text-muted-foreground text-base md:text-lg leading-relaxed"
          >
            {content}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.article>
  )
}

function TechStack({ coreStrengthLabel }: { coreStrengthLabel: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      <h2 className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        {coreStrengthLabel}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SKILLS.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
            className="flex items-center gap-3 px-4 py-4 rounded-xl bg-card/50 border border-border/40 transition-colors duration-200 hover:border-primary/40 group cursor-default"
          >
            <SkillIcon type={skill.icon} />
            <span className="text-sm md:text-base font-medium text-foreground">
              {skill.name}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function AboutMe({
  title,
  intro,
  sections,
}: {
  title: string
  intro: string
  sections: { title: string; content: string }[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <div className="space-y-12">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">{title}</h2>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
          {intro}
        </p>
      </motion.div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <StoryCard
            key={section.title}
            title={section.title}
            content={section.content}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}

function CTAButton({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex justify-center pt-8"
    >
      <motion.a
        href="https://www.linkedin.com/in/santiago-requelme/"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent py-4 px-12 text-sm font-semibold text-primary-foreground transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/30"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </motion.a>
    </motion.div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function ContentSections() {
  const { t } = useLanguage()

  const sections = [
    { title: t("about.problemSolver.title"), content: t("about.problemSolver.content") },
    { title: t("about.changeMaker.title"), content: t("about.changeMaker.content") },
    { title: t("about.designChampion.title"), content: t("about.designChampion.content") },
  ]

  return (
    <section id="about" className="relative py-24 px-4">
      {/* Static ambient — no animation */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-32 left-1/4 w-96 h-96 rounded-full bg-primary/4 blur-3xl" />
        <div className="absolute bottom-32 right-1/4 w-80 h-80 rounded-full bg-accent/4 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl space-y-24">
        <TechStack coreStrengthLabel={t("about.coreStrength")} />
        <AboutMe
          title={t("about.title")}
          intro={t("about.intro")}
          sections={sections}
        />
        <CTAButton label={t("about.workWithMe")} />
      </div>
    </section>
  )
}
