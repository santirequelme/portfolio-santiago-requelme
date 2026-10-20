"use client"

import { useId, useState } from "react"
import type { LabCopy } from "@/lib/lab/content"
import { cn } from "@/lib/utils"

type Copy = LabCopy["process"]

// Stages where a person, not a tool, makes the call.
const HUMAN_STAGES = new Set(["design", "review"])

export function Process({ copy }: { copy: Copy }) {
  const [active, setActive] = useState(0)
  const baseId = useId()
  const stage = copy.stages[active]

  return (
    <div className="space-y-4">
      {/* Diagram: a row of nodes on desktop, a vertical rail on mobile. */}
      <ol role="tablist" aria-label={copy.marker} aria-orientation="horizontal" className="relative grid gap-2 md:grid-cols-6 md:gap-0">
        <span
          aria-hidden="true"
          className="absolute bottom-5 left-5 top-5 w-px bg-border md:bottom-auto md:left-[8.33%] md:right-[8.33%] md:top-5 md:h-px md:w-auto"
        />
        {copy.stages.map((s, i) => {
          const selected = i === active
          const human = HUMAN_STAGES.has(s.id)
          return (
            <li key={s.id} role="presentation" className="relative">
              <button
                id={`${baseId}-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  const n = copy.stages.length
                  let next = -1
                  if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n
                  else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + n) % n
                  else if (e.key === "Home") next = 0
                  else if (e.key === "End") next = n - 1
                  if (next < 0) return
                  e.preventDefault()
                  setActive(next)
                  document.getElementById(`${baseId}-tab-${next}`)?.focus()
                }}
                className="group flex w-full items-center gap-3 rounded-control p-0.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:flex-col md:gap-3 md:text-center"
              >
                <span
                  className={cn(
                    "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] transition-colors",
                    selected
                      ? human
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-[var(--lab-violet)] bg-[var(--lab-violet)] text-white"
                      : "border-border bg-background text-muted-foreground group-hover:border-foreground/40 group-hover:text-foreground",
                  )}
                >
                  0{i + 1}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5 md:items-center">
                  <span className={cn("text-sm font-medium leading-snug", selected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                    {s.title}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground/70">
                    <span className="md:hidden">{s.tools.slice(0, 2).join(" · ")}</span>
                    <span className="hidden md:inline">{s.tools[0]}</span>
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
        tabIndex={0}
        className="grid gap-px overflow-hidden rounded-card border border-border bg-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:grid-cols-3"
      >
        <Column label={copy.labels.tools}>
          <ul className="flex flex-wrap gap-1.5">
            {stage.tools.map((t) => (
              <li
                key={t}
                className={cn(
                  "rounded-tag border px-2 py-1 font-mono text-[11px]",
                  t === "Engram"
                    ? "border-[var(--lab-green)]/40 bg-[var(--lab-green)]/10 text-[var(--lab-green)]"
                    : "border-border text-foreground/85",
                )}
              >
                {t}
              </li>
            ))}
          </ul>
        </Column>
        <Column label={copy.labels.activities}>
          <ul className="space-y-1.5 text-sm leading-relaxed text-foreground/85">
            {stage.activities.map((a) => (
              <li key={a} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--lab-blue)]" />
                {a}
              </li>
            ))}
          </ul>
        </Column>
        <Column label={copy.labels.deliverables}>
          <ul className="space-y-1.5 text-sm leading-relaxed text-foreground/85">
            {stage.deliverables.map((d) => (
              <li key={d} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--lab-green)]" />
                {d}
              </li>
            ))}
          </ul>
        </Column>
      </div>
    </div>
  )
}

function Column({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 bg-card p-5">
      <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{label}</h4>
      {children}
    </div>
  )
}
