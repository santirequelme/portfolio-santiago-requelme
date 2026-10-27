"use client"

import { useId, useMemo, useState } from "react"
import { ChevronRight } from "lucide-react"
import type { LabCopy } from "@/lib/lab/content"
import type { PlaygroundConfig } from "@/lib/lab/playground"
import { CARD_VARIANTS, DEFAULT_CARD_VARIANT, primaryDefinitions, stackFiles, STACKS, type StackId } from "@/lib/lab/stacks"
import type { StacksCopy } from "@/lib/lab/stacks-copy"
import { cssVariables, tokensFor } from "@/lib/lab/stack-tokens"
import { tokenize } from "@/lib/lab/highlight"
import { cn } from "@/lib/utils"
import { CodeBlock, CodeLines, CopyButton, TokenSpans } from "./code-block"
import { ContrastStatus } from "./contrast-status"
import { AccentPicker } from "./playground"
import { ScopeTable } from "./scope-table"
import { SpecPanel } from "./spec-panel"
import { StackCard } from "./stack-card-preview"

/** The playground's Card variant when Card is selected there; the spec's default otherwise. */
const cardVariantOf = (config: PlaygroundConfig): string =>
  config.component === "card" && CARD_VARIANTS.includes(config.variant) ? config.variant : DEFAULT_CARD_VARIANT

export function StackSwitcher({
  copy,
  codeLabels,
  config,
  onPrimaryChange,
}: {
  copy: StacksCopy
  codeLabels: LabCopy["code"]
  config: PlaygroundConfig
  onPrimaryChange: (hex: string) => void
}) {
  const [stack, setStack] = useState<StackId>("react")
  const baseId = useId()

  const variant = cardVariantOf(config)
  const tokens = useMemo(() => tokensFor(config), [config])
  const files = useMemo(() => stackFiles(stack, variant, tokens), [stack, variant, tokens])
  const definitions = useMemo(() => primaryDefinitions(tokens), [tokens])
  const tokensJson = useMemo(() => JSON.stringify(tokens, null, 2), [tokens])
  const jsonMarks = useMemo(() => {
    const marks = new Set<number>()
    tokensJson.split("\n").forEach((line, i) => /"(primary|onPrimary)"/.test(line) && marks.add(i + 1))
    return marks
  }, [tokensJson])

  const current = STACKS.find((s) => s.id === stack) ?? STACKS[0]
  const primary = tokens.color.primary.$value

  return (
    <div className="grid gap-4 lg:grid-cols-[19.5rem_minmax(0,1fr)]">
      {/* ── The proof control and what it changes ─────────────────────── */}
      <div className="min-w-0 space-y-5 self-start rounded-card border border-border bg-card p-4 md:p-5 lg:sticky lg:top-28">
        <div className="space-y-2">
          <AccentPicker label={copy.primary} customLabel={copy.customPrimary} value={primary} onChange={onPrimaryChange} />
          <p className="text-xs text-muted-foreground">{copy.primaryHint}</p>
        </div>

        <ContrastStatus copy={copy.contrast} tokens={tokens} />

        <div className="space-y-1.5 border-t border-border pt-4 font-mono text-[11px] text-muted-foreground">
          <p className="uppercase tracking-[0.12em]">{copy.following}</p>
          <p className="flex justify-between gap-3">
            <span>{copy.variant}</span>
            <span className="text-foreground">{variant}</span>
          </p>
          <p className="flex justify-between gap-3">
            <span>{copy.radius}</span>
            <span className="text-foreground">{config.radius}px</span>
          </p>
          {config.component !== "card" && <p className="pt-1 font-sans text-xs">{copy.variantHint}</p>}
        </div>

        <div className="space-y-2.5 border-t border-border pt-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{copy.propagation}</p>
          <ul className="space-y-2">
            {definitions.map((d) => (
              <li key={d.id} className="overflow-hidden rounded-inner border border-border bg-[var(--lab-editor)]">
                <p className="flex justify-between gap-2 border-b border-border px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
                  <span className="text-foreground/80">{d.name}</span>
                  <span className="truncate">{d.stacks.join(" · ")}</span>
                </p>
                <code
                  key={d.line}
                  className="block overflow-x-auto whitespace-pre px-2.5 py-1.5 font-mono text-[11.5px] animate-in fade-in duration-500 motion-reduce:animate-none"
                >
                  <TokenSpans tokens={tokenize(d.line)} />
                </code>
              </li>
            ))}
          </ul>
          <p aria-live="polite" className="text-xs text-muted-foreground">
            {copy.summary(primary)}
          </p>
        </div>
      </div>

      {/* ── Preview, stack tabs, code and source tokens ───────────────── */}
      <div className="flex min-w-0 flex-col gap-4">
        <figure className="overflow-hidden rounded-card border border-border">
          <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border bg-card px-4 py-2.5 font-mono text-[11px] text-muted-foreground">
            <span className="flex items-center gap-2 uppercase tracking-[0.12em]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--lab-green)]" />
              {copy.preview}
            </span>
            <span>
              card · {variant} · {config.radius}px · {primary}
            </span>
          </figcaption>
          <div
            className="lab-preview relative flex min-h-72 flex-col items-center justify-center gap-3 bg-background px-4 py-12"
            style={cssVariables(tokens)}
            data-testid="stack-preview"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(color-mix(in_srgb,var(--foreground)_12%,transparent)_1px,transparent_1px)] [background-size:16px_16px]"
            />
            <StackCard variant={variant} />
            <p className="relative font-mono text-[10px] text-muted-foreground">{copy.imageNote}</p>
          </div>
        </figure>

        <div className="min-w-0">
          <div
            role="tablist"
            aria-label={copy.stacks}
            className="mb-2 flex w-full gap-1 overflow-x-auto rounded-control border border-border bg-card p-1"
          >
            {STACKS.map((s, i) => {
              const selected = s.id === stack
              return (
                <button
                  key={s.id}
                  id={`${baseId}-tab-${s.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setStack(s.id)}
                  onKeyDown={(e) => {
                    const n = STACKS.length
                    let next = -1
                    if (e.key === "ArrowRight") next = (i + 1) % n
                    else if (e.key === "ArrowLeft") next = (i - 1 + n) % n
                    else if (e.key === "Home") next = 0
                    else if (e.key === "End") next = n - 1
                    if (next < 0) return
                    e.preventDefault()
                    setStack(STACKS[next].id)
                    document.getElementById(`${baseId}-tab-${STACKS[next].id}`)?.focus()
                  }}
                  className={cn(
                    "flex-1 whitespace-nowrap rounded-[6px] px-3 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
                    selected ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s.label}
                </button>
              )
            })}
          </div>

          <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${stack}`}>
            <CodeBlock
              key={stack}
              files={files.map((f, i) => ({
                name: f.name,
                code: f.code,
                marks: f.primaryLines,
                note: i === 0 ? (current.runs ? copy.runs : copy.notRun) : i === files.length - 1 ? copy.generated : undefined,
              }))}
              labels={codeLabels}
            />
          </div>
        </div>

        <SpecPanel copy={copy} codeLabels={codeLabels} followed={config.component} />

        <ScopeTable copy={copy.scope} />

        <details className="group overflow-hidden rounded-card border border-border bg-[var(--lab-editor)]">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-mono text-[12px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
            <ChevronRight
              aria-hidden="true"
              className="h-3.5 w-3.5 text-muted-foreground transition-transform group-open:rotate-90 motion-reduce:transition-none"
            />
            {copy.tokensPanel}
            <span className="ml-auto text-[11px] uppercase tracking-[0.12em] text-[var(--lab-green)]">{copy.tokensPanelMeta}</span>
          </summary>
          <div className="border-t border-border">
            <div className="flex items-center justify-between gap-3 px-4 py-2">
              <p className="text-xs text-muted-foreground">{copy.tokensPanelNote}</p>
              <CopyButton text={tokensJson} labels={codeLabels} />
            </div>
            <div className="max-h-[26rem] overflow-auto border-t border-border">
              <CodeLines code={tokensJson} marks={jsonMarks} />
            </div>
          </div>
        </details>
      </div>
    </div>
  )
}
