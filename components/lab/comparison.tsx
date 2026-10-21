"use client"

import { useId, useMemo, useState } from "react"
import { INITIAL_BUTTON, REFINED_BUTTON, type LabCopy } from "@/lib/lab/content"
import { diffLines } from "@/lib/lab/diff"
import { tokenize } from "@/lib/lab/highlight"
import { cn } from "@/lib/utils"
import { CodeLines, CopyButton, TokenSpans } from "./code-block"

type Copy = LabCopy["comparison"]
type View = "initial" | "refined" | "diff"
const VIEWS: View[] = ["initial", "refined", "diff"]

/** 1-based line numbers of `code` that contain any of the substrings. */
function linesMatching(code: string, needles: string[]) {
  const set = new Set<number>()
  code.split("\n").forEach((line, i) => {
    if (needles.some((n) => line.includes(n))) set.add(i + 1)
  })
  return set
}

export function Comparison({ copy, codeLabels }: { copy: Copy; codeLabels: LabCopy["code"] }) {
  const [view, setView] = useState<View>("refined")
  const [aspectId, setAspectId] = useState(copy.aspects[0].id)
  const baseId = useId()

  const aspect = copy.aspects.find((a) => a.id === aspectId) ?? copy.aspects[0]
  const marks = useMemo(() => linesMatching(REFINED_BUTTON, aspect.match), [aspect])
  const diff = useMemo(() => diffLines(INITIAL_BUTTON, REFINED_BUTTON), [])
  const stats = useMemo(
    () => ({ add: diff.filter((d) => d.type === "add").length, del: diff.filter((d) => d.type === "del").length }),
    [diff],
  )

  const code = view === "initial" ? INITIAL_BUTTON : REFINED_BUTTON

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="flex min-w-0 flex-col overflow-hidden rounded-card border border-border bg-[var(--lab-editor)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-2 py-1.5">
          <div role="tablist" aria-label={copy.marker} className="flex gap-1">
            {VIEWS.map((v, i) => (
              <button
                key={v}
                id={`${baseId}-tab-${v}`}
                type="button"
                role="tab"
                aria-selected={view === v}
                aria-controls={`${baseId}-panel`}
                tabIndex={view === v ? 0 : -1}
                onClick={() => setView(v)}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
                  e.preventDefault()
                  const next = VIEWS[(i + (e.key === "ArrowRight" ? 1 : -1) + VIEWS.length) % VIEWS.length]
                  setView(next)
                  document.getElementById(`${baseId}-tab-${next}`)?.focus()
                }}
                className={cn(
                  "rounded-[6px] px-2.5 py-1 font-mono text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  view === v ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {copy.tabs[v]}
                {v === "diff" && (
                  <span className="ml-1.5">
                    <span className="text-[var(--lab-green)]">+{stats.add}</span>{" "}
                    <span className="text-destructive">−{stats.del}</span>
                  </span>
                )}
              </button>
            ))}
          </div>
          {view !== "diff" && <CopyButton text={code} labels={codeLabels} />}
        </div>
        {view === "refined" && (
          <p className="flex items-center gap-2 border-b border-border px-4 py-2 text-xs text-muted-foreground">
            <span aria-hidden="true" className="h-3 w-0.5 bg-[var(--lab-violet)]" />
            {copy.highlightHint}: <span className="text-foreground">{aspect.title}</span>
          </p>
        )}
        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${view}`}
          tabIndex={0}
          className="max-h-[30rem] overflow-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          {view === "diff" ? (
            <DiffView diff={diff} marks={marks} />
          ) : (
            <CodeLines code={code} marks={view === "refined" ? marks : undefined} />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="rounded-card border border-border bg-card p-4">
          <p id={`${baseId}-aspects`} className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            {copy.aspectsLabel}
          </p>
          <div role="group" aria-labelledby={`${baseId}-aspects`} className="flex flex-wrap gap-1.5">
            {copy.aspects.map((a) => {
              const on = a.id === aspect.id
              return (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setAspectId(a.id)
                    if (view === "initial") setView("refined")
                  }}
                  className={cn(
                    "rounded-tag border px-2.5 py-1.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    on
                      ? "border-[var(--lab-violet)]/50 bg-[var(--lab-violet)]/15 text-foreground"
                      : "border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground",
                  )}
                >
                  {a.title}
                </button>
              )
            })}
          </div>
        </div>

        <div aria-live="polite" className="flex-1 space-y-4 rounded-card border border-border bg-card p-4">
          <h4 className="text-base font-semibold font-sans">{aspect.title}</h4>
          <div className="space-y-1.5">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--lab-green)]">{copy.whyLabel}</p>
            <p className="text-sm leading-relaxed text-foreground/85">{aspect.why}</p>
          </div>
          <div className="space-y-1.5">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--lab-blue)]">{copy.tradeoffLabel}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{aspect.tradeoff}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function DiffView({ diff, marks }: { diff: ReturnType<typeof diffLines>; marks: Set<number> }) {
  return (
    <pre className="min-w-max py-3 font-mono text-[12.5px] leading-[1.7]">
      <code>
        {diff.map((d, i) => (
          <span
            key={i}
            className={cn(
              "flex border-l-2 border-transparent pr-6",
              d.type === "add" && "bg-[var(--lab-green)]/[0.09]",
              d.type === "del" && "bg-destructive/[0.1]",
              d.type === "add" && d.newNo && marks.has(d.newNo) && "border-[var(--lab-violet)]",
            )}
          >
            <span aria-hidden="true" className="w-9 shrink-0 select-none pr-2 text-right text-foreground/25">
              {d.oldNo ?? ""}
            </span>
            <span aria-hidden="true" className="w-9 shrink-0 select-none pr-2 text-right text-foreground/25">
              {d.newNo ?? ""}
            </span>
            <span
              className={cn(
                "w-5 shrink-0 select-none text-center",
                d.type === "add" ? "text-[var(--lab-green)]" : d.type === "del" ? "text-destructive" : "text-transparent",
              )}
            >
              <span className="sr-only">{d.type === "add" ? "added: " : d.type === "del" ? "removed: " : ""}</span>
              <span aria-hidden="true">{d.type === "add" ? "+" : d.type === "del" ? "−" : " "}</span>
            </span>
            <span className={d.type === "del" ? "opacity-70" : undefined}>
              <TokenSpans tokens={tokenize(d.text)} />
              {d.text === "" && " "}
            </span>
          </span>
        ))}
      </code>
    </pre>
  )
}
