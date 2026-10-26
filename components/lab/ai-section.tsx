"use client"

import { ArrowUpRight, Info } from "lucide-react"
import type { AiCopy } from "@/lib/lab/ai-copy"
import { SITE } from "@/lib/lab/ai-copy"
import type { LabCopy } from "@/lib/lab/content"
import type { Savings } from "@/lib/lab/savings"
import type { RulesEntry } from "@/lib/registry"
import { Badge } from "./badge"
import { BeforeAfter } from "./before-after"
import { CopyButton } from "./code-block"
import { McpDemo } from "./mcp-demo"
import { SavingsStrip } from "./savings-strip"

export function AiSection({
  copy,
  codeLabels,
  rules,
  savings,
}: {
  copy: AiCopy
  codeLabels: LabCopy["code"]
  rules: RulesEntry
  savings: Savings
}) {
  return (
    <div className="space-y-6">
      <SavingsStrip copy={copy.savings} savings={savings} />

      {/* ── The functional part: the public registry ─────────────────── */}
      <section aria-labelledby="registry-title" className="rounded-card border border-border bg-card p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <h3 id="registry-title" className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">
            {copy.registry.title}
          </h3>
          <Badge tone="live">{copy.registry.badge}</Badge>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{copy.registry.body}</p>
        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-inner border border-border">
          {copy.registry.routes.map((route) => (
            <li key={route.path} className="flex flex-col gap-2 bg-[var(--lab-editor)] p-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-mono text-[12.5px]">
                  <span className="text-[var(--lab-green)]">GET</span>
                  <span className="truncate text-foreground">{route.path}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{route.text}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={route.path}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-7 items-center gap-1 rounded-control border border-border px-2 font-mono text-[11px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {copy.registry.open}
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  <span className="sr-only">{route.path}</span>
                </a>
                <CopyButton text={`curl -s "${SITE}${route.path}"`} labels={{ ...codeLabels, copy: copy.registry.copy }} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="flex gap-2.5 rounded-card border border-dashed border-[var(--lab-violet)]/50 bg-[var(--lab-violet)]/[0.07] px-4 py-3 text-sm leading-relaxed text-foreground/90">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--lab-violet)]" aria-hidden="true" />
        {copy.note}
      </p>

      {/* ── The conceptual part: a simulated MCP session ─────────────── */}
      <McpDemo copy={copy.mcp} codeLabels={codeLabels} rules={rules} />

      <BeforeAfter copy={copy.beforeAfter} />
    </div>
  )
}
