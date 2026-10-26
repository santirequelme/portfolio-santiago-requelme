"use client"

import { useMemo } from "react"
import { beforeAfterReports, finalAnswer, WITHOUT_SYSTEM } from "@/lib/lab/ai-demo"
import type { AiCopy } from "@/lib/lab/ai-copy"
import type { UsageReport } from "@/lib/registry"
import { cn } from "@/lib/utils"
import { Badge } from "./badge"
import { CodeLines } from "./code-block"

type Copy = AiCopy["beforeAfter"]

export function BeforeAfter({ copy }: { copy: Copy }) {
  const reports = useMemo(() => beforeAfterReports(), [])
  const answer = useMemo(() => finalAnswer(), [])

  return (
    <section aria-labelledby="before-after-title" className="space-y-3">
      <div>
        <h3 id="before-after-title" className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">
          {copy.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{copy.body}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Column
          title={copy.without}
          badge={<Badge tone="illustrative">{copy.withoutBadge}</Badge>}
          note={copy.withoutNote}
          code={WITHOUT_SYSTEM}
          reports={[
            ["Button", reports.without.button],
            ["Input", reports.without.input],
          ]}
          copy={copy}
        />
        <Column
          title={copy.withSystem}
          badge={<Badge tone="live">{copy.withBadge}</Badge>}
          note={copy.withNote}
          code={answer.code}
          reports={[["Button", reports.with.button]]}
          copy={copy}
        />
      </div>
    </section>
  )
}

function Column({
  title,
  badge,
  note,
  code,
  reports,
  copy,
}: {
  title: string
  badge: React.ReactNode
  note: string
  code: string
  reports: [string, UsageReport][]
  copy: Copy
}) {
  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-card border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h4 className="text-sm font-semibold font-sans">{title}</h4>
        {badge}
      </div>
      <p className="border-b border-border px-4 py-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
      <div className="max-h-72 overflow-auto border-b border-border bg-[var(--lab-editor)]">
        <CodeLines code={code} />
      </div>
      <div className="space-y-3 p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{copy.report}</p>
        {reports.map(([name, r]) => (
          <div key={name} className="space-y-1.5">
            <p className="flex items-center gap-2 font-mono text-[12px]">
              <span className="text-foreground">{name}</span>
              <span className={r.valid ? "text-[var(--lab-green)]" : "text-destructive"}>{r.valid ? copy.valid : copy.invalid}</span>
            </p>
            {r.issues.length > 0 && (
              <ul className="space-y-1">
                {r.issues.map((issue, i) => (
                  <li key={i} className="flex gap-2 text-xs leading-relaxed">
                    <span
                      className={cn(
                        "mt-px shrink-0 rounded-[3px] px-1 font-mono text-[10px] uppercase",
                        issue.severity === "error" ? "bg-destructive/15 text-destructive" : "bg-[var(--lab-blue)]/15 text-[var(--lab-blue)]",
                      )}
                    >
                      {issue.severity}
                    </span>
                    <span className="text-foreground/85">
                      {issue.prop && <code className="font-mono text-[11px] text-muted-foreground">{issue.prop} · </code>}
                      {issue.message}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
