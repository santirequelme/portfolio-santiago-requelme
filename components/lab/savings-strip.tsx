"use client"

import type { AiCopy } from "@/lib/lab/ai-copy"
import type { Savings } from "@/lib/lab/savings"

const kb = (bytes: number) => `${Math.round(bytes / 1024)} KB`

export function SavingsStrip({ copy, savings }: { copy: AiCopy["savings"]; savings: Savings }) {
  const stats = [
    { value: kb(savings.registryBytes), extra: `${copy.read.versus} ${kb(savings.sourceBytes)}`, label: copy.read.label },
    { value: `${savings.cardLines} ${copy.lines.unit}`, label: copy.lines.label.replace("{css}", String(savings.cssLines)) },
    { value: `${savings.caught} ${copy.caught.unit}`, label: copy.caught.label },
  ]
  return (
    <section aria-labelledby="savings-title" className="rounded-card border border-border bg-card p-4 md:p-5">
      <h3 id="savings-title" className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">
        {copy.title}
      </h3>
      <dl className="mt-4 grid gap-px overflow-hidden rounded-inner border border-border bg-border md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-2 bg-[var(--lab-editor)] p-4">
            <dt className="order-2 text-xs leading-relaxed text-muted-foreground">{s.label}</dt>
            <dd className="order-1 flex flex-wrap items-baseline gap-x-2 font-display text-3xl leading-none text-foreground">
              {s.value}
              {s.extra && <span className="font-mono text-[12px] text-muted-foreground">{s.extra}</span>}
            </dd>
          </div>
        ))}
      </dl>
      <details className="group mt-3 text-xs text-muted-foreground">
        <summary className="cursor-pointer rounded-[4px] font-mono text-[11px] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {copy.sources}
        </summary>
        <p className="mt-2 font-mono text-[11px] leading-relaxed">{savings.sourceFiles.join(", ")}</p>
      </details>
      <p className="mt-2 text-xs text-muted-foreground">{copy.disclaimer}</p>
    </section>
  )
}
