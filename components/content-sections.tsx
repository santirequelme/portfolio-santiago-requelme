"use client"

import React, { useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"
import { Magnetic } from "./motion/magnetic"
import { buttonClass } from "@/lib/ui"
import { SectionMarker } from "./tech/annotations"
import { SkillsMarquee } from "./skills-marquee"
import { SKILLS } from "@/lib/cv"

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoryCardProps {
  title: string
  content: string
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
    <div className="tech-stack space-y-12">
      <SectionMarker index="02" label={coreStrengthLabel} meta={`${String(SKILLS.length).padStart(2, "0")} skills`} />
      <h2 className="tech-title font-display text-4xl md:text-5xl font-bold">{coreStrengthLabel}</h2>
      {/* Full-bleed: the rows run edge to edge past the content column */}
      <SkillsMarquee skills={SKILLS} className="relative left-1/2 w-screen -translate-x-1/2" />
    </div>
  )
}

function AboutMe({
  marker,
  title,
  intro,
  sections,
}: {
  marker: string
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
          { opacity: 0.35 },
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
      <SectionMarker index="03" label={marker} />
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
        // Tech stack title wipes in; the marquee animates itself.
        gsap.from(".tech-title", {
          clipPath: "inset(0% 100% 0% 0%)",
          duration: 1,
          ease: "power4.inOut",
          scrollTrigger: { trigger: ".tech-stack", start: "top 80%" },
        })

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
    <section ref={sectionRef} id="about" className="relative overflow-x-clip py-24 px-4">


      <div className="mx-auto max-w-6xl space-y-24">
        <TechStack coreStrengthLabel={t("about.coreStrength")} />
        <AboutMe
          marker={t("nav.about")}
          title={t("about.title")}
          intro={t("about.intro")}
          sections={sections}
        />
        <CTAButton label={t("about.workWithMe")} />
      </div>
    </section>
  )
}
