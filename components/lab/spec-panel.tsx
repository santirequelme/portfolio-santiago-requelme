"use client"

import { useId, useMemo, useState } from "react"
import type { LabCopy } from "@/lib/lab/content"
import type { ComponentKind } from "@/lib/lab/playground"
import { SPEC_FILES, SPECS } from "@/lib/lab/specs"
import type { StacksCopy } from "@/lib/lab/stacks-copy"
import { cn } from "@/lib/utils"
import { CodeLines, CopyButton } from "./code-block"

const KINDS: ComponentKind[] = ["button", "card", "input"]

/**
 * Shows a component's spec (specs/*.spec.json) as formatted JSON. Starts on
 * Card, the component the stack switcher renders, and follows the component
 * picked in the playground after that.
 */
export function SpecPanel({
  copy,
  codeLabels,
  followed,
}: {
  copy: StacksCopy
  codeLabels: LabCopy["code"]
  followed: ComponentKind
}) {
  const [kind, setKind] = useState<ComponentKind>("card")
  const [lastFollowed, setLastFollowed] = useState(followed)
  if (followed !== lastFollowed) {
    setLastFollowed(followed)
    setKind(followed)
  }

  const baseId = useId()
  const json = useMemo(() => JSON.stringify(SPECS[kind], null, 2), [kind])

  return (
    <section aria-labelledby={`${baseId}-title`} className="overflow-hidden rounded-card border border-border bg-[var(--lab-editor)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-2 py-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <h3 id={`${baseId}-title`} className="px-2 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
            {copy.spec}
          </h3>
          <div role="tablist" aria-label={copy.specTabs} className="flex gap-1">
            {KINDS.map((k, i) => {
              const selected = k === kind
              return (
                <button
                  key={k}
                  id={`${baseId}-tab-${k}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setKind(k)}
                  onKeyDown={(e) => {
                    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
                    e.preventDefault()
                    const next = KINDS[(i + (e.key === "ArrowRight" ? 1 : -1) + KINDS.length) % KINDS.length]
                    setKind(next)
                    document.getElementById(`${baseId}-tab-${next}`)?.focus()
                  }}
                  className={cn(
                    "rounded-[6px] px-2.5 py-1 font-mono text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
                    selected ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {copy.components[k]}
                </button>
              )
            })}
          </div>
        </div>
        <CopyButton text={json} labels={codeLabels} />
      </div>
      <p className="border-b border-border px-4 py-2 text-xs text-muted-foreground">
        <span className="font-mono text-foreground/80">{SPEC_FILES[kind]}</span> · {copy.specNote}
      </p>
      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${kind}`}
        tabIndex={0}
        className="max-h-[26rem] overflow-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <CodeLines code={json} />
      </div>
    </section>
  )
}
