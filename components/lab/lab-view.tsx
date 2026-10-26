"use client"

import { useRef, useState, type ReactNode } from "react"
import { ArrowDown, Check, Sparkles, UserRound } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"
import { LAB_COPY } from "@/lib/lab/content"
import { DEFAULT_CONFIG, type PlaygroundConfig } from "@/lib/lab/playground"
import { STACKS_COPY } from "@/lib/lab/stacks-copy"
import { buttonClass, chipClass } from "@/lib/ui"
import { CornerMarks, SectionMarker } from "@/components/tech/annotations"
import { Playground } from "./playground"
import { StackSwitcher } from "./stack-switcher"
import { Workflow } from "./workflow"
import { Comparison } from "./comparison"
import { Process } from "./process"
import { Principles } from "./principles"

export function LabView() {
  const { language } = useLanguage()
  const c = LAB_COPY[language]
  const stacks = STACKS_COPY[language]
  // Shared by the playground and "One system, every stack", so a token change
  // in either one shows up in both.
  const [config, setConfig] = useState<PlaygroundConfig>(DEFAULT_CONFIG)
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".lab-hero-char", { yPercent: 110, duration: 0.8, stagger: 0.012 })
          .from(".lab-hero-fade", { opacity: 0, y: 14, duration: 0.6, stagger: 0.08 }, "-=0.45")
          .from(".lab-hero-card", { opacity: 0, y: 24, scale: 0.98, duration: 0.8 }, "<0.1")

        gsap.utils.toArray<HTMLElement>(".lab-section").forEach((section) => {
          gsap.from(section.querySelectorAll(".lab-reveal"), {
            opacity: 0,
            y: 24,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: { trigger: section, start: "top 78%" },
          })
        })
      })
      return () => mm.revert()
    },
    { scope: rootRef, dependencies: [language], revertOnUpdate: true },
  )

  return (
    <div ref={rootRef} className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-32 md:pt-44">
      {/* ── Hero ── */}
      <header className="grid gap-12 pb-20 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
        <div className="min-w-0">
          <p className="lab-hero-fade flex flex-wrap items-center gap-2">
            <span className={chipClass}>
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--lab-violet)]" />
              {c.meta.eyebrow}
            </span>
          </p>
          <h1 className="mt-6 font-display text-[2.6rem] leading-[1.02] sm:text-6xl md:text-7xl" aria-label={c.hero.title}>
            {c.hero.title.split(" ").map((word, w) => (
              <span key={`${language}-${w}`} aria-hidden="true" className="mr-[0.28em] inline-block overflow-hidden align-bottom">
                {word.split("").map((ch, i) => (
                  <span key={i} className="lab-hero-char inline-block">
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="lab-hero-fade mt-6 max-w-2xl text-lg leading-relaxed text-foreground/85">{c.hero.body}</p>
          <p className="lab-hero-fade mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{c.hero.intro}</p>
          <div className="lab-hero-fade mt-8 flex flex-wrap items-center gap-4">
            <a href="#playground" className={buttonClass("primary", "lg")}>
              {c.hero.cta}
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
            <p className="max-w-xs font-mono text-[11px] leading-relaxed text-muted-foreground">{c.hero.note}</p>
          </div>
        </div>

        <div className="lab-hero-card relative">
          <CornerMarks />
          <div className="grid gap-px overflow-hidden rounded-card border border-border bg-border">
            <SplitList
              icon={<Sparkles className="h-3.5 w-3.5 text-[var(--lab-violet)]" aria-hidden="true" />}
              title={c.hero.accelerates.title}
              items={c.hero.accelerates.items}
              tone="text-[var(--lab-violet)]"
            />
            <SplitList
              icon={<UserRound className="h-3.5 w-3.5 text-primary" aria-hidden="true" />}
              title={c.hero.human.title}
              items={c.hero.human.items}
              tone="text-primary"
            />
          </div>
        </div>
      </header>

      <Section id="playground" index="01" marker={c.playground.marker} title={c.playground.title} body={c.playground.body}>
        <Playground copy={c.playground} codeLabels={c.code} config={config} setConfig={setConfig} />
      </Section>

      <Section id="stacks" index="02" marker={stacks.marker} title={stacks.title} body={stacks.body}>
        <StackSwitcher
          copy={stacks}
          codeLabels={c.code}
          config={config}
          onPrimaryChange={(accent) => setConfig((prev) => ({ ...prev, accent }))}
        />
      </Section>

      <Section id="workflow" index="03" marker={c.workflow.marker} title={c.workflow.title} body={c.workflow.body}>
        <Workflow copy={c.workflow} />
      </Section>

      <Section id="comparison" index="04" marker={c.comparison.marker} title={c.comparison.title} body={c.comparison.body}>
        <Comparison copy={c.comparison} codeLabels={c.code} />
      </Section>

      <Section id="process" index="05" marker={c.process.marker} title={c.process.title} body={c.process.body}>
        <Process copy={c.process} />
      </Section>

      <Section id="principles" index="06" marker={c.principles.marker} title={c.principles.title}>
        <Principles copy={c.principles} />
      </Section>
    </div>
  )
}

function Section({
  id,
  index,
  marker,
  title,
  body,
  children,
}: {
  id: string
  index: string
  marker: string
  title: string
  body?: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="lab-section scroll-mt-28 py-16 md:py-20">
      <SectionMarker index={index} label={marker} />
      <div className="mt-8 mb-8 grid gap-4 md:mb-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:gap-10">
        <h2 id={`${id}-title`} className="lab-reveal font-display text-3xl leading-[1.05] md:text-[2.75rem]">
          {title}
        </h2>
        {body && <p className="lab-reveal max-w-xl text-base leading-relaxed text-muted-foreground">{body}</p>}
      </div>
      <div className="lab-reveal min-w-0">{children}</div>
    </section>
  )
}

function SplitList({ icon, title, items, tone }: { icon: ReactNode; title: string; items: string[]; tone: string }) {
  return (
    <div className="bg-card p-5">
      <p className={`flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] ${tone}`}>
        {icon}
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85">
            <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
