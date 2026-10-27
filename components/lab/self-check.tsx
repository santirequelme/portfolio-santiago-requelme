"use client"

import { useMemo } from "react"
import { Check, ChevronRight, X } from "lucide-react"
import { auditPlayground, auditTokens, type AuditCheck } from "@/lib/lab/audit"
import type { AiCopy } from "@/lib/lab/ai-copy"
import { flatTokens, SOURCE_TOKENS } from "@/lib/lab/stack-tokens"
import { Badge } from "./badge"

const KINDS = ["contrast", "target", "scope"] as const

/** The build's token audit (scripts/audit-tokens.ts), run here on the same source tokens. */
export function SelfCheck({ copy }: { copy: AiCopy["selfCheck"] }) {
  const checks = useMemo<AuditCheck[]>(() => [...auditTokens(flatTokens(SOURCE_TOKENS)), ...auditPlayground()], [])
  return (
    <section aria-labelledby="self-check-title" className="rounded-card border border-border bg-card p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <h3 id="self-check-title" className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">
          {copy.title}
        </h3>
        <Badge tone="live">{copy.badge}</Badge>
      </div>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{copy.body}</p>

      <dl className="mt-4 grid gap-px overflow-hidden rounded-inner border border-border bg-border sm:grid-cols-3">
        {KINDS.map((kind) => {
          const own = checks.filter((c) => c.kind === kind)
          const passed = own.filter((c) => c.pass).length
          return (
            <div key={kind} className="flex flex-col gap-1.5 bg-[var(--lab-editor)] p-4">
              <dt className="order-2 text-xs text-muted-foreground">{copy.kinds[kind]}</dt>
              <dd className={`order-1 font-display text-2xl leading-none ${passed === own.length ? "text-foreground" : "text-destructive"}`}>
                {passed}/{own.length}
              </dd>
            </div>
          )
        })}
      </dl>

      <details className="group mt-3">
        <summary className="flex w-fit cursor-pointer list-none items-center gap-1.5 rounded-[4px] font-mono text-[11px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
          <ChevronRight aria-hidden="true" className="h-3 w-3 transition-transform group-open:rotate-90 motion-reduce:transition-none" />
          {copy.all} ({checks.length})
        </summary>
        <ul className="mt-2 max-h-80 divide-y divide-border overflow-auto rounded-inner border border-border bg-[var(--lab-editor)]">
          {checks.map((c) => (
            <li key={c.id} className="flex gap-2.5 px-3 py-2 text-xs leading-relaxed">
              {c.pass ? (
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--lab-green)]" aria-label={copy.pass} />
              ) : (
                <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" aria-label={copy.fail} />
              )}
              <span className="min-w-0">
                <span className="text-foreground/90">{c.label}</span>
                <span className="block break-words font-mono text-[10.5px] text-muted-foreground">{c.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </details>
      <p className="mt-2 text-xs text-muted-foreground">{copy.command}</p>
    </section>
  )
}
