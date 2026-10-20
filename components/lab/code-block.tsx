"use client"

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react"
import { Check, Copy, TriangleAlert } from "lucide-react"
import { tokenizeLines, type Token, type TokenType } from "@/lib/lab/highlight"
import { cn } from "@/lib/utils"

const TOKEN_CLASS: Record<TokenType, string> = {
  comment: "text-[var(--lab-comment)] italic",
  string: "text-[var(--lab-green)]",
  keyword: "text-[var(--lab-violet)]",
  tag: "text-[var(--lab-blue)]",
  attr: "text-[var(--lab-cyan)]",
  number: "text-primary",
  type: "text-[var(--lab-blue)]",
  fn: "text-foreground",
  punct: "text-foreground/50",
  plain: "text-foreground/90",
}

export function TokenSpans({ tokens }: { tokens: Token[] }) {
  return (
    <>
      {tokens.map((t, i) => (
        <span key={i} className={TOKEN_CLASS[t.type]}>
          {t.text}
        </span>
      ))}
    </>
  )
}

/** Copy text with the async Clipboard API, falling back to execCommand. */
async function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const ta = document.createElement("textarea")
    ta.value = text
    ta.setAttribute("readonly", "")
    ta.style.position = "fixed"
    ta.style.opacity = "0"
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand("copy")
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

export function CopyButton({ text, labels }: { text: string; labels: { copy: string; copied: string; failed: string } }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle")
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const onCopy = async () => {
    const ok = await copyText(text)
    setStatus(ok ? "copied" : "failed")
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus("idle"), 2000)
  }

  const Icon = status === "copied" ? Check : status === "failed" ? TriangleAlert : Copy
  return (
    <button
      type="button"
      onClick={onCopy}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-control border px-2 font-mono text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        status === "copied"
          ? "border-[var(--lab-green)]/40 text-[var(--lab-green)]"
          : status === "failed"
            ? "border-destructive/50 text-destructive"
            : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span aria-live="polite">{status === "copied" ? labels.copied : status === "failed" ? labels.failed : labels.copy}</span>
    </button>
  )
}

/** Numbered, highlighted lines. `marks` tints lines by 1-based number. */
export function CodeLines({
  code,
  marks,
  lineClass,
}: {
  code: string
  marks?: Set<number>
  lineClass?: (n: number) => string | undefined
}) {
  const lines = useMemo(() => tokenizeLines(code), [code])
  return (
    <pre className="min-w-max py-3 font-mono text-[12.5px] leading-[1.7]">
      <code>
        {lines.map((tokens, i) => {
          const n = i + 1
          return (
            <span
              key={i}
              className={cn(
                "flex border-l-2 border-transparent pr-6",
                marks?.has(n) && "border-[var(--lab-violet)] bg-[var(--lab-violet)]/10",
                lineClass?.(n),
              )}
            >
              <span aria-hidden="true" className="w-11 shrink-0 select-none pr-4 text-right text-foreground/25">
                {n}
              </span>
              <span>
                <TokenSpans tokens={tokens} />
                {tokens.length === 0 && " "}
              </span>
            </span>
          )
        })}
      </code>
    </pre>
  )
}

export interface CodeFile {
  name: string
  code: string
  note?: ReactNode
}

/** Editor-style panel with file tabs, a copy action and highlighted code. */
export function CodeBlock({
  files,
  labels,
  toolbar,
  marks,
  className,
  maxHeight = "28rem",
}: {
  files: CodeFile[]
  labels: { copy: string; copied: string; failed: string; files: string }
  toolbar?: ReactNode
  marks?: Set<number>
  className?: string
  maxHeight?: string
}) {
  const [active, setActive] = useState(0)
  const index = Math.min(active, files.length - 1)
  const file = files[index]
  const tablistId = useId()

  return (
    <div className={cn("flex min-w-0 flex-col overflow-hidden rounded-card border border-border bg-[var(--lab-editor)]", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-2 py-1.5">
        <div role="tablist" aria-label={labels.files} id={tablistId} className="flex min-w-0 gap-1 overflow-x-auto">
          {files.map((f, i) => (
            <button
              key={f.name}
              type="button"
              role="tab"
              aria-selected={i === index}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  e.preventDefault()
                  const next = (i + (e.key === "ArrowRight" ? 1 : -1) + files.length) % files.length
                  setActive(next)
                  ;(e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus()
                }
              }}
              tabIndex={i === index ? 0 : -1}
              className={cn(
                "shrink-0 rounded-[6px] px-2.5 py-1 font-mono text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                i === index ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.name}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {toolbar}
          <CopyButton text={file.code} labels={labels} />
        </div>
      </div>
      {file.note && <div className="border-b border-border px-4 py-2 text-xs text-muted-foreground">{file.note}</div>}
      <div role="tabpanel" aria-labelledby={tablistId} tabIndex={0} className="overflow-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" style={{ maxHeight }}>
        <CodeLines code={file.code} marks={marks} />
      </div>
    </div>
  )
}
