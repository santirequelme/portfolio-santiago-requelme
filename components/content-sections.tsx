"use client"

import React, { useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"
import { Magnetic } from "./motion/magnetic"
import { buttonClass } from "@/lib/ui"
import { SectionMarker } from "./tech/annotations"

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoryCardProps {
  title: string
  content: string
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
  const iconClasses = "w-5 h-5 text-foreground/55 flex-shrink-0 group-hover:text-primary transition-colors duration-200"

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

function StoryCard({ title, content }: StoryCardProps) {
  return (
    <article className="story-card relative rounded-card bg-card/60 border border-border overflow-hidden group transition-colors duration-300 hover:border-primary/30">
      {/* Progress rail — grows with scroll, highlighted on hover */}
      <div className="story-rail absolute left-0 top-0 bottom-0 w-[2px] origin-top bg-primary opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

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
    </article>
  )
}

function TechStack({ coreStrengthLabel }: { coreStrengthLabel: string }) {
  return (
    <div className="tech-stack space-y-8">
      <SectionMarker index="02" label={coreStrengthLabel} meta={`${String(SKILLS.length).padStart(2, "0")} skills`} />
      <h2 className="tech-title font-display text-4xl md:text-5xl font-bold">
        {coreStrengthLabel}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SKILLS.map((skill) => (
          <div
            key={skill.name}
            className="skill-item flex items-center gap-3 px-4 py-4 rounded-control bg-card/70 border border-border transition-[border-color,background-color] duration-300 hover:border-foreground/25 hover:bg-card group cursor-default"
          >
            <span className="skill-icon inline-flex">
              <SkillIcon type={skill.icon} />
            </span>
            <span className="text-sm md:text-base font-medium text-foreground">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </div>
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
  const introRef = useRef<HTMLParagraphElement>(null)

  // Intro words light up one by one as the paragraph scrolls through the
  // viewport. Rebuilt when the language (and therefore the words) changes.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".intro-word",
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: introRef.current,
              start: "top 85%",
              end: "bottom 45%",
              scrub: true,
            },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: introRef, dependencies: [intro], revertOnUpdate: true },
  )

  return (
    <div className="space-y-12">
      <SectionMarker index="03" label={title} />
      <div>
        <h2 className="about-title font-display text-4xl md:text-5xl font-bold mb-6" aria-label={title}>
          {title.split(" ").map((word, i) => (
            <span key={`${word}-${i}`} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-1 -mb-1">
              <span className="about-word inline-block">{word}</span>
              {"\u00A0"}
            </span>
          ))}
        </h2>
        <p ref={introRef} className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
          {intro.split(" ").map((word, i) => (
            <span key={`${word}-${i}`} className="intro-word">
              {word}{" "}
            </span>
          ))}
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <StoryCard key={section.title} title={section.title} content={section.content} />
        ))}
      </div>
    </div>
  )
}

function CTAButton({ label }: { label: string }) {
  return (
    <div className="cta-wrap flex justify-center pt-8">
      <Magnetic strength={0.4}>
        <motion.a
          href="https://www.linkedin.com/in/santiago-requelme/"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("primary", "lg", "px-8")}
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
      </Magnetic>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function ContentSections() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // Core strengths: title wipes in, skills pop in as a grid wave.
        gsap
          .timeline({ scrollTrigger: { trigger: ".tech-stack", start: "top 80%" } })
          .from(".tech-title", { clipPath: "inset(0% 100% 0% 0%)", duration: 1, ease: "power4.inOut" })
          .from(
            ".skill-item",
            {
              opacity: 0,
              y: 30,
              scale: 0.9,
              duration: 0.6,
              ease: "back.out(1.7)",
              stagger: { each: 0.06, grid: "auto", from: "start" },
              clearProps: "transform",
            },
            "-=0.5",
          )

        // About: title words rise out of their masks.
        gsap.from(".about-word", {
          yPercent: 110,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".about-title", start: "top 85%" },
        })

        // Story cards slide in, and their rail fills while scrolling past.
        gsap.utils.toArray<HTMLElement>(".story-card").forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            x: -60,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%" },
          })
          gsap.fromTo(
            card.querySelector(".story-rail"),
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top 80%", end: "bottom 50%", scrub: true },
            },
          )
        })

        gsap.from(".cta-wrap", {
          opacity: 0,
          y: 40,
          scale: 0.9,
          duration: 0.8,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: ".cta-wrap", start: "top 90%" },
        })
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  const sections = [
    { title: t("about.problemSolver.title"), content: t("about.problemSolver.content") },
    { title: t("about.changeMaker.title"), content: t("about.changeMaker.content") },
    { title: t("about.designChampion.title"), content: t("about.designChampion.content") },
  ]

  return (
    <section ref={sectionRef} id="about" className="relative py-24 px-4">


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
