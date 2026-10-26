"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"
import { LAB_COPY } from "@/lib/lab/content"
import { DEFAULT_CONFIG, SAMPLE, resolveTokens } from "@/lib/lab/playground"
import { buttonClass, chipClass } from "@/lib/ui"
import { CornerMarks } from "@/components/tech/annotations"
import { CodeLines } from "./code-block"
import { Button } from "./demo-components"

const SNIPPET = `<Button variant="primary" size="md">
  ${SAMPLE.button.label}
</Button>`

// Home-page entry point to /lab: a small graphite panel previewing the
// playground (same component and tokens) next to its code.
export function LabTeaser() {
  const { language } = useLanguage()
  const c = LAB_COPY[language].teaser
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from(".lab-teaser-panel", {
          opacity: 0,
          y: 32,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} aria-labelledby="lab-teaser-title" className="relative px-4 py-16 md:py-24">
      <div className="relative mx-auto max-w-7xl">
        <CornerMarks />
        <div className="lab-teaser-panel dark lab-scope grid gap-8 overflow-hidden rounded-panel border border-border bg-background p-6 text-foreground md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:p-10">
          <div>
            <span className={chipClass}>
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--lab-violet)]" />
              {c.marker}
            </span>
            <h2 id="lab-teaser-title" className="mt-5 font-display text-3xl leading-[1.05] md:text-4xl">
              {c.title}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">{c.body}</p>
            <Link href="/lab" className={buttonClass("primary", "md", "mt-6")}>
              {c.cta}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div aria-hidden="true" className="grid overflow-hidden rounded-card border border-border">
            <div
              style={resolveTokens(DEFAULT_CONFIG) as React.CSSProperties}
              className="flex h-36 items-center justify-center bg-[var(--ui-canvas)] [background-image:radial-gradient(color-mix(in_srgb,var(--ui-fg)_14%,transparent)_1px,transparent_1px)] [background-size:16px_16px]"
            >
              <Button tabIndex={-1}>{SAMPLE.button.label}</Button>
            </div>
            <div className="overflow-x-auto border-t border-border bg-[var(--lab-editor)]">
              <CodeLines code={SNIPPET} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
