"use client"

import { useId, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Labelled control row. */
export function Field({
  label,
  labelId,
  htmlFor,
  children,
  hint,
}: {
  label: string
  labelId?: string
  htmlFor?: string
  children: ReactNode
  hint?: ReactNode
}) {
  const Tag = htmlFor ? "label" : "p"
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <Tag id={labelId} {...(htmlFor ? { htmlFor } : {})} className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </Tag>
        {hint && <span className="font-mono text-[11px] text-foreground/70">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

export interface SegmentOption<T extends string> {
  value: T
  label: string
}

/**
 * Segmented control implemented as an ARIA radio group: Tab focuses the
 * selected option, arrow keys move and select.
 */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  compact = false,
}: {
  label: string
  value: T
  options: readonly SegmentOption<T>[]
  onChange: (value: T) => void
  /** Inline variant without the visible label, for toolbars. */
  compact?: boolean
}) {
  const groupRef = useRef<HTMLDivElement>(null)
  const labelId = useId()

  const move = (from: number, dir: 1 | -1) => {
    const next = (from + dir + options.length) % options.length
    onChange(options[next].value)
    ;(groupRef.current?.children[next] as HTMLElement | undefined)?.focus()
  }

  const group = (
      <div
        ref={groupRef}
        role="radiogroup"
        aria-labelledby={labelId}
        className={cn("grid gap-0.5 rounded-control border border-border bg-background p-0.5", compact && "inline-grid")}
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((opt, i) => {
          const checked = opt.value === value
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              onClick={() => onChange(opt.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault()
                  move(i, 1)
                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault()
                  move(i, -1)
                }
              }}
              className={cn(
                compact ? "h-6 px-2 font-mono text-[11px]" : "h-8 px-2 text-[13px] font-medium",
                "truncate rounded-[6px] capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                checked ? "bg-secondary text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.3)]" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
  )

  if (compact) {
    return (
      <>
        <span id={labelId} className="sr-only">
          {label}
        </span>
        {group}
      </>
    )
  }

  return (
    <Field label={label} labelId={labelId}>
      {group}
    </Field>
  )
}

/** On/off switch (role="switch"). */
export function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex w-full items-center justify-between gap-3 rounded-control py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
      <span
        aria-hidden="true"
        className={cn(
          "relative block h-5 w-9 shrink-0 rounded-full border transition-colors",
          checked ? "border-[var(--lab-green)]/60 bg-[var(--lab-green)]/80" : "border-border bg-background",
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 block h-3.5 w-3.5 rounded-full bg-foreground transition-transform motion-reduce:transition-none",
            checked ? "translate-x-4" : "translate-x-0",
          )}
        />
      </span>
    </button>
  )
}
