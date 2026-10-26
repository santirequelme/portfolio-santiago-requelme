"use client"

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type Dispatch, type SetStateAction } from "react"
import { RotateCcw } from "lucide-react"
import {
  ACCENT_PRESETS,
  DEFAULT_CONFIG,
  RADIUS_RANGE,
  SAMPLE,
  VARIANTS,
  contrastRatio,
  resolveTokens,
  withComponent,
  type ComponentKind,
  type Framework,
  type PlaygroundConfig,
  type PreviewState,
  type PreviewTheme,
  type Size,
  type Variant,
} from "@/lib/lab/playground"
import { generateCode } from "@/lib/lab/codegen"
import type { LabCopy } from "@/lib/lab/content"
import { cn } from "@/lib/utils"
import { CodeBlock } from "./code-block"
import { Field, Segmented, Switch } from "./controls"
import { Button, Card, Input, cardParts } from "./demo-components"

type Copy = LabCopy["playground"]

const SIZES: Size[] = ["sm", "md", "lg"]
const COMPONENTS: ComponentKind[] = ["button", "card", "input"]
const THEMES: PreviewTheme[] = ["light", "dark"]
const STATES: PreviewState[] = ["default", "hover", "disabled"]
const FRAMEWORKS: { value: Framework; label: string }[] = [
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" },
]

/** WCAG level for a contrast ratio on normal-size text. */
function contrastLevel(ratio: number) {
  if (ratio >= 7) return "AAA"
  if (ratio >= 4.5) return "AA"
  if (ratio >= 3) return "AA large"
  return "Fail"
}

export function Playground({
  copy,
  codeLabels,
  config,
  setConfig,
}: {
  copy: Copy
  codeLabels: LabCopy["code"]
  /** The whole playground is driven by this one object; preview and code both
   *  derive from it. It lives in LabView so other sections can follow it. */
  config: PlaygroundConfig
  setConfig: Dispatch<SetStateAction<PlaygroundConfig>>
}) {
  const set = <K extends keyof PlaygroundConfig>(key: K, value: PlaygroundConfig[K]) =>
    setConfig((c) => ({ ...c, [key]: value }))

  const tokens = useMemo(() => resolveTokens(config), [config])
  const files = useMemo(() => generateCode(config), [config])
  const illustrative = files.some((f) => f.illustrative)

  const onPrimary = config.component === "button" && config.variant === "primary"
  const ratio = onPrimary
    ? contrastRatio(tokens["--ui-on-accent"], tokens["--ui-accent"])
    : contrastRatio(tokens["--ui-accent"], tokens["--ui-surface"])
  const level = contrastLevel(ratio)

  // Short-lived "clicked" feedback for interactive previews.
  const [clicks, setClicks] = useState(0)
  const [flash, setFlash] = useState(false)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => {
    if (flashTimer.current) clearTimeout(flashTimer.current)
  }, [])
  // Switching component clears the feedback from the previous one.
  useEffect(() => {
    setFlash(false)
    setClicks(0)
  }, [config.component])
  const registerClick = () => {
    setClicks((n) => n + 1)
    setFlash(true)
    if (flashTimer.current) clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setFlash(false), 1200)
  }

  const force = config.state === "hover" ? { "data-force": "hover" } : {}
  const disabled = config.state === "disabled"

  return (
    <div className="grid gap-4 lg:grid-cols-[19.5rem_minmax(0,1fr)]">
      {/* ── Controls ─────────────────────────────────────────────────── */}
      <div className="lab-panel space-y-5 rounded-card border border-border bg-card p-4 md:p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">{copy.controls}</h3>
          <button
            type="button"
            onClick={() => setConfig(DEFAULT_CONFIG)}
            className="inline-flex h-7 items-center gap-1.5 rounded-control px-2 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            {copy.reset}
          </button>
        </div>

        <Segmented
          label={copy.component}
          value={config.component}
          options={COMPONENTS.map((v) => ({ value: v, label: copy.components[v] }))}
          onChange={(v) => setConfig((c) => withComponent(c, v))}
        />
        <Segmented<Variant>
          label={copy.variant}
          value={config.variant}
          options={VARIANTS[config.component].map((v) => ({ value: v, label: v }))}
          onChange={(v) => set("variant", v)}
        />
        <Segmented label={copy.size} value={config.size} options={SIZES.map((v) => ({ value: v, label: v }))} onChange={(v) => set("size", v)} />
        <Segmented
          label={copy.theme}
          value={config.theme}
          options={THEMES.map((v) => ({ value: v, label: copy.themes[v] }))}
          onChange={(v) => set("theme", v)}
        />
        <Segmented
          label={copy.state}
          value={config.state}
          options={STATES.map((v) => ({ value: v, label: copy.states[v] }))}
          onChange={(v) => set("state", v)}
        />

        <Field label={copy.radius} htmlFor="lab-radius" hint={`${config.radius}px`}>
          <input
            id="lab-radius"
            type="range"
            min={RADIUS_RANGE.min}
            max={RADIUS_RANGE.max}
            step={RADIUS_RANGE.step}
            value={config.radius}
            onChange={(e) => set("radius", Number(e.target.value))}
            aria-valuetext={`${config.radius}px`}
            className="lab-range w-full"
          />
        </Field>

        <AccentPicker label={copy.accent} customLabel={copy.customAccent} value={config.accent} onChange={(v) => set("accent", v)} />

        <div className="border-t border-border pt-4">
          <Switch label={copy.showCode} checked={config.showCode} onChange={(v) => set("showCode", v)} />
        </div>
      </div>

      {/* ── Preview + code ───────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-col gap-4">
        <figure className="overflow-hidden rounded-card border border-border">
          <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border bg-card px-4 py-2.5 font-mono text-[11px] text-muted-foreground">
            <span className="flex items-center gap-2 uppercase tracking-[0.12em]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--lab-green)]" />
              {copy.preview}
            </span>
            <span data-testid="preview-meta">
              {config.component} · {config.variant} · {config.size} · {copy.states[config.state].toLowerCase()}
            </span>
          </figcaption>

          <div
            data-testid="preview-canvas"
            data-theme={config.theme}
            style={tokens as CSSProperties}
            className="lab-preview relative flex min-h-72 items-center justify-center bg-[var(--ui-canvas)] px-4 py-14 transition-colors duration-300 md:min-h-80"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(color-mix(in_srgb,var(--ui-fg)_14%,transparent)_1px,transparent_1px)] [background-size:16px_16px]"
            />
            <div className="relative flex w-full justify-center">
              {config.component === "button" && (
                <Button
                  variant={config.variant as "primary"}
                  size={config.size}
                  disabled={disabled}
                  onClick={registerClick}
                  {...force}
                >
                  {SAMPLE.button.label}
                </Button>
              )}
              {config.component === "card" && (
                <Card variant={config.variant as "elevated"} size={config.size} disabled={disabled} {...force}>
                  <p className={cardParts.eyebrow}>{SAMPLE.card.eyebrow}</p>
                  <h3 className={cardParts.title}>{SAMPLE.card.title}</h3>
                  <p className={cardParts.body}>{SAMPLE.card.body}</p>
                  <a
                    href="/system"
                    className={cardParts.action}
                    tabIndex={disabled ? -1 : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      registerClick()
                    }}
                  >
                    {SAMPLE.card.action} →
                  </a>
                </Card>
              )}
              {config.component === "input" && (
                <Input
                  type="email"
                  label={SAMPLE.input.label}
                  hint={SAMPLE.input.hint}
                  placeholder={SAMPLE.input.placeholder}
                  variant={config.variant as "outline"}
                  size={config.size}
                  disabled={disabled}
                  {...force}
                />
              )}
            </div>

            <span
              aria-live="polite"
              className={cn(
                "absolute bottom-3 left-1/2 -translate-x-1/2 rounded-tag bg-[var(--ui-fg)] px-2 py-1 font-mono text-[10px] text-[var(--ui-canvas)] transition-opacity duration-200",
                flash ? "opacity-100" : "opacity-0",
              )}
            >
              {flash ? `${copy.clicked} ×${clicks}` : ""}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border bg-card px-4 py-2.5 font-mono text-[11px] text-muted-foreground">
            <span data-testid="contrast">
              {onPrimary ? copy.contrast : copy.contrastSurface}:{" "}
              <span className="text-foreground">{ratio.toFixed(2)}:1</span>{" "}
              <span className={level === "Fail" ? "text-destructive" : level === "AA large" ? "text-[var(--lab-blue)]" : "text-[var(--lab-green)]"}>
                {level}
              </span>
            </span>
            <span>--ui-radius: {tokens["--ui-radius"]}</span>
            <span className="inline-flex items-center gap-1.5">
              --ui-accent:
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[2px] border border-border" style={{ background: tokens["--ui-accent"] }} />
              {tokens["--ui-accent"]}
            </span>
          </div>
        </figure>

        {config.showCode && (
          <CodeBlock
            key={config.framework}
            files={files.map((f, i) => ({
              name: f.name,
              code: f.code,
              note: i === 0 ? (illustrative ? copy.illustrative : copy.runs) : undefined,
            }))}
            labels={codeLabels}
            toolbar={
              <Segmented compact label={copy.framework} value={config.framework} options={FRAMEWORKS} onChange={(v) => set("framework", v)} />
            }
          />
        )}
      </div>
    </div>
  )
}

/** Preset swatches plus a native colour input. */
export function AccentPicker({
  label,
  customLabel,
  value,
  onChange,
}: {
  label: string
  customLabel: string
  value: string
  onChange: (v: string) => void
}) {
  const groupRef = useRef<HTMLDivElement>(null)
  const labelId = useId()
  const current = ACCENT_PRESETS.findIndex((p) => p.value.toLowerCase() === value.toLowerCase())
  const isPreset = current !== -1

  const move = (from: number, dir: 1 | -1) => {
    const next = (from + dir + ACCENT_PRESETS.length) % ACCENT_PRESETS.length
    onChange(ACCENT_PRESETS[next].value)
    ;(groupRef.current?.children[next] as HTMLElement | undefined)?.focus()
  }

  return (
    <Field label={label} labelId={labelId} hint={value.toUpperCase()}>
      <div className="flex items-center gap-2">
        <div ref={groupRef} role="radiogroup" aria-labelledby={labelId} className="flex gap-2">
          {ACCENT_PRESETS.map((p, i) => {
            const checked = i === current
            return (
              <button
                key={p.value}
                type="button"
                role="radio"
                aria-checked={checked}
                aria-label={p.name}
                title={p.name}
                tabIndex={checked || (current === -1 && i === 0) ? 0 : -1}
                onClick={() => onChange(p.value)}
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
                  "h-8 w-8 rounded-control border transition-[box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                  checked ? "border-foreground/80 shadow-[inset_0_0_0_2px_var(--card)]" : "border-transparent",
                )}
                style={{ background: p.value }}
              />
            )
          })}
        </div>
        <span aria-hidden="true" className="h-5 w-px bg-border" />
        <label
          className={cn(
            "relative h-8 w-8 cursor-pointer overflow-hidden rounded-control border focus-within:ring-2 focus-within:ring-ring",
            isPreset ? "border-dashed border-border" : "border-foreground/80",
          )}
          style={isPreset ? undefined : { background: value }}
        >
          <span className="sr-only">{customLabel}</span>
          {isPreset && (
            <span
              aria-hidden="true"
              className="absolute inset-1 rounded-[4px] [background:conic-gradient(#E23A0D,#F5B700,#16A361,#2F7CF6,#7C5CFC,#E23A0D)]"
            />
          )}
          <input
            type="color"
            value={value.toLowerCase()}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
      </div>
    </Field>
  )
}
