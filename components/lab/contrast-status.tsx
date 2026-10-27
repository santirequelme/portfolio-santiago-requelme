"use client"

import { useMemo } from "react"
import { Check, TriangleAlert } from "lucide-react"
import { auditTokens } from "@/lib/lab/audit"
import { flatTokens, type LabTokens } from "@/lib/lab/stack-tokens"
import type { StacksCopy } from "@/lib/lab/stacks-copy"

/** The audit's contrast pairs, live against the primary being edited. */
export function ContrastStatus({ copy, tokens }: { copy: StacksCopy["contrast"]; tokens: LabTokens }) {
  const checks = useMemo(() => auditTokens(flatTokens(tokens)).filter((c) => c.kind === "contrast" && c.id.match(/\.\d+$/)), [tokens])
  const failed = checks.filter((c) => !c.pass)
  return (
    <div role="status" className="space-y-1.5 border-t border-border pt-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{copy.title}</p>
      <p className={`flex gap-2 text-xs leading-relaxed ${failed.length ? "text-destructive" : "text-[var(--lab-green)]"}`}>
        {failed.length ? <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
        {failed.length ? copy.fail(failed.length, checks.length) : copy.pass(checks.length)}
      </p>
      {failed.length > 0 && (
        <ul className="space-y-1 pl-5.5">
          {failed.map((c) => (
            <li key={c.id} className="text-xs leading-relaxed text-foreground/85">
              {c.label}
              <span className="block font-mono text-[10.5px] text-muted-foreground">{c.detail}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
