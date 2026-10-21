"use client"

import { useId, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Check, ShieldAlert, Sparkles, UserRound } from "lucide-react"
import type { LabCopy } from "@/lib/lab/content"
import { cn } from "@/lib/utils"
import { CodeLines } from "./code-block"

type Copy = LabCopy["workflow"]

export function Workflow({ copy }: { copy: Copy }) {
  const [active, setActive] = useState(0)
  const baseId = useId()
  const reduce = useReducedMotion()
  const step = copy.steps[active]
  const l = copy.labels

  const focusTab = (i: number) => document.getElementById(`${baseId}-tab-${i}`)?.focus()

  return (
    <div className="space-y-4">
      <div
        role="tablist"
        aria-label={copy.marker}
        aria-orientation="horizontal"
        className="grid grid-cols-2 gap-2 md:grid-cols-4"
      >
        {copy.steps.map((s, i) => {
          const selected = i === active
          return (
            <button
              key={s.id}
              id={`${baseId}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                const n = copy.steps.length
                let next = -1
                if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n
                else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + n) % n
                else if (e.key === "Home") next = 0
                else if (e.key === "End") next = n - 1
                if (next < 0) return
                e.preventDefault()
                setActive(next)
                focusTab(next)
              }}
              className={cn(
                "group relative flex flex-col items-start gap-3 overflow-hidden rounded-card border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected ? "border-foreground/30 bg-card" : "border-border bg-card/40 hover:border-foreground/20 hover:bg-card/70",
              )}
            >
              <span className="flex w-full items-center justify-between font-mono text-[11px] text-muted-foreground">
                <span className={selected ? "text-[var(--lab-violet)]" : undefined}>0{i + 1}</span>
                {i < active && <Check className="h-3.5 w-3.5 text-[var(--lab-green)]" aria-hidden="true" />}
              </span>
              <span className={cn("text-sm font-semibold leading-snug md:text-[15px]", selected ? "text-foreground" : "text-foreground/75")}>
                {s.title}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[var(--lab-violet)] transition-transform duration-300 motion-reduce:transition-none",
                  selected ? "scale-x-100" : "scale-x-0",
                )}
              />
            </button>
          )
        })}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
        tabIndex={0}
        className="rounded-card border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step.id}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="grid gap-px overflow-hidden rounded-card bg-border lg:grid-cols-2"
          >
            <div className="space-y-5 bg-card p-5 md:p-6">
              <Block label={l.objective}>
                <p className="text-base leading-relaxed text-foreground">{step.objective}</p>
              </Block>
              <Block label={l.input}>
                <div className="overflow-hidden rounded-inner border border-border bg-[var(--lab-editor)]">
                  <p className="border-b border-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground">{step.inputLabel}</p>
                  <div className="overflow-x-auto">
                    <CodeLines code={step.input} />
                  </div>
                </div>
              </Block>
            </div>

            <div className="space-y-5 bg-card p-5 md:p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <Block label={l.ai} icon={<Sparkles className="h-3.5 w-3.5 text-[var(--lab-violet)]" aria-hidden="true" />}>
                  <List items={step.aiHelps} dot="bg-[var(--lab-violet)]" />
                </Block>
                <Block label={l.me} icon={<UserRound className="h-3.5 w-3.5 text-primary" aria-hidden="true" />}>
                  <List items={step.iDecide} dot="bg-primary" />
                </Block>
              </div>

              <Block label={l.risks} icon={<ShieldAlert className="h-3.5 w-3.5 text-[var(--lab-blue)]" aria-hidden="true" />}>
                <ul className="space-y-2">
                  {step.risks.map((r) => (
                    <li key={r.risk} className="grid gap-1 rounded-inner border border-border p-3 text-sm sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-3">
                      <span className="text-foreground/85">{r.risk}</span>
                      <ArrowRight className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" aria-hidden="true" />
                      <span className="text-muted-foreground">{r.mitigation}</span>
                    </li>
                  ))}
                </ul>
              </Block>

              <Block label={l.output}>
                <p className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--lab-green)]" aria-hidden="true" />
                  {step.output}
                </p>
              </Block>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Block({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <h4 className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        {icon}
        {label}
      </h4>
      {children}
    </div>
  )
}

function List({ items, dot }: { items: string[]; dot: string }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85">
          <span aria-hidden="true" className={cn("mt-2 h-1 w-1 shrink-0 rounded-full", dot)} />
          {item}
        </li>
      ))}
    </ul>
  )
}
