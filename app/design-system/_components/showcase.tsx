"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft, Palette, Type, Ruler, Square, Layers, Zap, MousePointerClick, Tag,
  MessageSquare, ToggleRight, FormInput, CircleHelp, Bell, Move, Images, LayoutTemplate,
  Component, Plus, Download, Trash2, Heart, Settings, ChevronRight,
} from "lucide-react"
import {
  Button, Badge, Tooltip, Switch, TextField, SelectField, ConfirmDialog, Toaster, type Toast,
} from "./ui"
import { ThemeToggle } from "./theme-toggle"
import { DragDropDemo } from "./drag-drop"
import { GalleryDemo } from "./gallery"
import { Skeleton, SectionSkeleton, LazyBody, type SkeletonVariant } from "./skeleton"

/* ── Section registry (drives sidebar + scrollspy) ─────────────────────── */
const SECTIONS = [
  { id: "colors", label: "Colors", icon: Palette, group: "Foundations" },
  { id: "typography", label: "Typography", icon: Type, group: "Foundations" },
  { id: "spacing", label: "Spacing", icon: Ruler, group: "Foundations" },
  { id: "radius", label: "Radius", icon: Square, group: "Foundations" },
  { id: "elevation", label: "Elevation", icon: Layers, group: "Foundations" },
  { id: "motion", label: "Motion", icon: Zap, group: "Foundations" },
  { id: "buttons", label: "Buttons", icon: MousePointerClick, group: "Components" },
  { id: "badges", label: "Badges", icon: Tag, group: "Components" },
  { id: "tooltip", label: "Tooltip", icon: MessageSquare, group: "Components" },
  { id: "switch", label: "Switch", icon: ToggleRight, group: "Components" },
  { id: "inputs", label: "Inputs", icon: FormInput, group: "Components" },
  { id: "modal", label: "Modal", icon: CircleHelp, group: "Components" },
  { id: "toast", label: "Toasts", icon: Bell, group: "Components" },
  { id: "skeleton", label: "Skeleton", icon: LayoutTemplate, group: "Components" },
  { id: "dnd", label: "Drag & Drop", icon: Move, group: "Components" },
  { id: "gallery", label: "Gallery", icon: Images, group: "Components" },
] as const

/* ── Token data ────────────────────────────────────────────────────────── */
const ACCENT: [string, string][] = [
  ["50", "#eef2ff"], ["100", "#e0e7ff"], ["200", "#c7d2fe"], ["300", "#a5b4fc"], ["400", "#818cf8"],
  ["500", "#6366f1"], ["600", "#4f46e5"], ["700", "#4338ca"], ["800", "#3730a3"], ["900", "#312e81"],
]
const NEUTRAL: [string, string][] = [
  ["50", "#fafafa"], ["100", "#f4f4f5"], ["200", "#e4e4e7"], ["300", "#d4d4d8"], ["400", "#a1a1aa"],
  ["500", "#71717a"], ["600", "#52525b"], ["700", "#3f3f46"], ["800", "#27272a"], ["900", "#18181b"],
]
const SEMANTIC: { name: string; token: string; hex: string }[] = [
  { name: "Primary", token: "--ds-primary", hex: "#4f46e5" },
  { name: "Success", token: "--ds-success", hex: "#16a34a" },
  { name: "Warning", token: "--ds-warning", hex: "#d97706" },
  { name: "Danger", token: "--ds-danger", hex: "#dc2626" },
  { name: "Info", token: "--ds-info", hex: "#2563eb" },
]
const TYPE_SCALE = [
  { name: "text-4xl", v: "--ds-text-4xl" }, { name: "text-3xl", v: "--ds-text-3xl" },
  { name: "text-2xl", v: "--ds-text-2xl" }, { name: "text-xl", v: "--ds-text-xl" },
  { name: "text-lg", v: "--ds-text-lg" }, { name: "text-md", v: "--ds-text-md" },
  { name: "text-base", v: "--ds-text-base" }, { name: "text-sm", v: "--ds-text-sm" },
  { name: "text-xs", v: "--ds-text-xs" },
]
const SPACING = [
  { name: "space-1", v: "--ds-space-1", px: "4px" }, { name: "space-2", v: "--ds-space-2", px: "8px" },
  { name: "space-3", v: "--ds-space-3", px: "12px" }, { name: "space-4", v: "--ds-space-4", px: "16px" },
  { name: "space-5", v: "--ds-space-5", px: "20px" }, { name: "space-6", v: "--ds-space-6", px: "24px" },
  { name: "space-8", v: "--ds-space-8", px: "32px" }, { name: "space-10", v: "--ds-space-10", px: "40px" },
  { name: "space-12", v: "--ds-space-12", px: "48px" }, { name: "space-16", v: "--ds-space-16", px: "64px" },
]
const RADII = [
  { name: "radius-sm", v: "--ds-radius-sm" }, { name: "radius-md", v: "--ds-radius-md" },
  { name: "radius-lg", v: "--ds-radius-lg" }, { name: "radius-xl", v: "--ds-radius-xl" },
  { name: "radius-full", v: "--ds-radius-full" },
]
const SHADOWS = ["xs", "sm", "md", "lg", "xl"]
const EASINGS = ["standard", "emphasized", "decelerate", "accelerate"]
const DURATIONS = [
  { name: "dur-fast", v: "140ms" }, { name: "dur-base", v: "220ms" }, { name: "dur-slow", v: "360ms" },
]

function Section({
  id, icon: Icon, eyebrow, title, desc, skeleton = "controls", children,
}: {
  id: string
  icon: React.ComponentType<{ size?: number }>
  eyebrow: string
  title: string
  desc: string
  skeleton?: SkeletonVariant
  children: React.ReactNode
}) {
  return (
    <section id={id} className="ds-section">
      <div className="ds-eyebrow" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Icon size={13} />
        {eyebrow}
      </div>
      <h2 className="ds-section__title">{title}</h2>
      <p className="ds-section__desc">{desc}</p>
      <LazyBody skeleton={<SectionSkeleton variant={skeleton} />}>{children}</LazyBody>
    </section>
  )
}

function Ramp({ name, steps }: { name: string; steps: [string, string][] }) {
  return (
    <div className="ds-block">
      <div className="ds-label">{name}</div>
      <div className="ds-ramp" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
        {steps.map(([step, hex]) => (
          <div key={step} className="ds-ramp__cell" style={{ background: hex, color: Number(step) >= 400 ? "#fff" : "#18181b" }}>
            {step}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Showcase() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [active, setActive] = useState<string>(SECTIONS[0].id)
  const [dialog, setDialog] = useState<null | "primary" | "danger">(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [switches, setSwitches] = useState({ notifications: true, analytics: false, marketing: false })
  const toastId = useRef(0)

  /* Theme persistence */
  useEffect(() => {
    const saved = localStorage.getItem("ds-theme")
    if (saved === "dark" || saved === "light") setTheme(saved)
  }, [])
  const toggleTheme = () =>
    setTheme((t) => {
      const next = t === "light" ? "dark" : "light"
      localStorage.setItem("ds-theme", next)
      return next
    })

  /* Scrollspy */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  const pushToast = useCallback((tone: Toast["tone"], title: string, message?: string) => {
    const id = ++toastId.current
    setToasts((prev) => [...prev, { id, tone, title, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3800)
  }, [])
  const dismissToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const groups = ["Foundations", "Components"] as const

  return (
    <div className="ds-root" data-theme={theme}>
      <div className="ds-shell">
        {/* ── Sidebar (desktop) ─────────────────────────────────────────── */}
        <aside className="ds-sidebar">
          <div className="ds-sidebar__head">
            <div className="ds-brand">
              <span className="ds-brand__mark"><Component size={18} /></span>
              <div>
                <div className="ds-brand__name">Aura</div>
                <div className="ds-brand__tag">Design System</div>
              </div>
            </div>
            <ThemeToggle checked={theme === "dark"} onChange={toggleTheme} />
          </div>

          <nav className="ds-nav">
            {groups.map((g) => (
              <div key={g}>
                <div className="ds-nav__group">{g}</div>
                {SECTIONS.filter((s) => s.group === g).map((s) => (
                  <button key={s.id} className="ds-nav__link" data-active={active === s.id} onClick={() => scrollTo(s.id)}>
                    <span className="ds-nav__dot" />
                    {s.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* ── Mobile top bar ────────────────────────────────────────────── */}
        <div className="ds-topbar">
          <div className="ds-brand" style={{ padding: 0 }}>
            <span className="ds-brand__mark"><Component size={16} /></span>
            <div className="ds-brand__name">Aura</div>
          </div>
          <div className="ds-topbar__nav">
            {SECTIONS.map((s) => (
              <button key={s.id} className="ds-topbar__chip" data-active={active === s.id} onClick={() => scrollTo(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
          <ThemeToggle checked={theme === "dark"} onChange={toggleTheme} />
        </div>

        {/* ── Content ───────────────────────────────────────────────────── */}
        <main className="ds-content">
          <div className="ds-content__inner">
            <header className="ds-hero">
              <Link href="/#projectList" className="ds-hero__back">
                <ArrowLeft size={16} /> Back to portfolio
              </Link>
              <h1 className="ds-hero__title">
                Aura <em>Design System</em>
              </h1>
              <p className="ds-hero__lead">
                A compact, composable UI system with semantic tokens, a considered type and spacing scale, and a set of
                accessible, themeable components. Built to be explored: switch themes, drag things around, and open a
                dialog.
              </p>
              <div className="ds-hero__meta">
                <Badge tone="accent" dot>Light &amp; dark</Badge>
                <Badge tone="success" dot>Accessible</Badge>
                <Badge tone="neutral" dot>Token-driven</Badge>
                <Badge tone="info" dot>16 sections</Badge>
              </div>
            </header>

            {/* ═══════════════════ FOUNDATIONS ═══════════════════ */}
            <Section id="colors" skeleton="grid" icon={Palette} eyebrow="Foundations" title="Colors"
              desc="A neutral ramp for surfaces and text, an accent ramp for interaction, and semantic status hues. Components consume semantic tokens, never raw hex.">
              <Ramp name="Accent" steps={ACCENT} />
              <Ramp name="Neutral" steps={NEUTRAL} />
              <div className="ds-block">
                <div className="ds-label">Semantic</div>
                <div className="ds-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
                  {SEMANTIC.map((c) => (
                    <div key={c.name} className="ds-swatch">
                      <div className="ds-swatch__chip" style={{ background: c.hex }} />
                      <div className="ds-swatch__meta">
                        <div className="ds-swatch__name">{c.name}</div>
                        <div className="ds-swatch__val">{c.hex}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            <Section id="typography" skeleton="list" icon={Type} eyebrow="Foundations" title="Typography"
              desc="A modular type scale pairing a display face for headings with a clean sans for body. Sizes are exposed as tokens for consistent rhythm.">
              <div className="ds-panel">
                {TYPE_SCALE.map((t) => (
                  <div key={t.name} className="ds-type-sample">
                    <span className="ds-type-sample__meta">{t.name}</span>
                    <span style={{ fontSize: `var(${t.v})`, fontFamily: "var(--ds-font-display)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                      The quick brown fox
                    </span>
                  </div>
                ))}
              </div>
              <div className="ds-block">
                <div className="ds-label">Weights</div>
                <div className="ds-panel ds-row" style={{ gap: "var(--ds-space-6)" }}>
                  {[
                    ["Regular", 400], ["Medium", 500], ["Semibold", 600], ["Bold", 700],
                  ].map(([label, w]) => (
                    <span key={label} style={{ fontSize: "var(--ds-text-lg)", fontWeight: w as number }}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </Section>

            <Section id="spacing" skeleton="list" icon={Ruler} eyebrow="Foundations" title="Spacing"
              desc="A 4px-based scale keeps layouts on a predictable grid. Use tokens for padding, gaps and margins instead of magic numbers.">
              <div className="ds-panel">
                {SPACING.map((s) => (
                  <div key={s.name} className="ds-token-row">
                    <span className="ds-token-name" style={{ width: 90 }}>{s.name}</span>
                    <div className="ds-space-bar" style={{ width: `var(${s.v})` }} />
                    <span className="ds-token-val" style={{ marginLeft: "auto", fontFamily: "var(--ds-font-mono)" }}>{s.px}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="radius" skeleton="grid" icon={Square} eyebrow="Foundations" title="Radius"
              desc="Corner radii scale with component size, subtle on inputs, softer on cards and dialogs, full for pills and avatars.">
              <div className="ds-radii">
                {RADII.map((r) => (
                  <div key={r.name} className="ds-radii__box" style={{ borderRadius: `var(${r.v === "--ds-radius-full" ? "--ds-radius-lg" : r.v})` }}>
                    <div className="ds-radii__demo" style={{ borderRadius: `var(${r.v})` }} />
                    <span className="ds-token-name">{r.name}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="elevation" skeleton="grid" icon={Layers} eyebrow="Foundations" title="Elevation"
              desc="Five shadow steps convey depth and focus. Higher elevation means more transient, so cards sit low and dialogs and toasts sit high.">
              <div className="ds-elev">
                {SHADOWS.map((s) => (
                  <div key={s} className="ds-elev__box" style={{ boxShadow: `var(--ds-shadow-${s})` }}>
                    shadow-{s}
                  </div>
                ))}
              </div>
            </Section>

            <Section id="motion" icon={Zap} eyebrow="Foundations" title="Motion"
              desc="Easing curves and durations give the system a consistent sense of movement. Standard for most transitions, emphasized for entrances.">
              <div className="ds-motion">
                {EASINGS.map((e) => (
                  <div key={e} className="ds-panel">
                    <span className="ds-token-name">ease-{e}</span>
                    <div className="ds-motion__track">
                      <div className="ds-motion__bar" style={{ animationTimingFunction: `var(--ds-ease-${e})` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="ds-block ds-row">
                {DURATIONS.map((d) => (
                  <Badge key={d.name} tone="neutral"><code style={{ background: "none", border: "none", padding: 0 }}>{d.name}</code> · {d.v}</Badge>
                ))}
              </div>
            </Section>

            {/* ═══════════════════ COMPONENTS ═══════════════════ */}
            <Section id="buttons" icon={MousePointerClick} eyebrow="Components" title="Buttons"
              desc="The primary action primitive. Five variants, three sizes, plus icon, pill, loading and disabled states, all driven by tokens.">
              <div className="ds-block">
                <div className="ds-label">Variants</div>
                <div className="ds-row">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>
              <div className="ds-block">
                <div className="ds-label">Sizes</div>
                <div className="ds-row">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              <div className="ds-block">
                <div className="ds-label">With icons &amp; states</div>
                <div className="ds-row">
                  <Button variant="primary"><Plus size={16} /> New project</Button>
                  <Button variant="secondary"><Download size={16} /> Export</Button>
                  <Button variant="primary" loading>Saving…</Button>
                  <Button variant="primary" disabled>Disabled</Button>
                  <Button variant="secondary" icon aria-label="Settings"><Settings size={16} /></Button>
                  <Button variant="outline" icon pill aria-label="Like"><Heart size={16} /></Button>
                </div>
              </div>
              <div className="ds-block">
                <div className="ds-label">Shapes</div>
                <div className="ds-row">
                  <Button pill>Pill button</Button>
                  <Button variant="outline" pill>Pill outline</Button>
                </div>
              </div>
              <div className="ds-block">
                <div className="ds-label">Full width</div>
                <Button full>Continue</Button>
              </div>
            </Section>

            <Section id="badges" icon={Tag} eyebrow="Components" title="Badges"
              desc="Compact status and metadata labels. Soft tones for subtle emphasis, solid for stronger signals, with an optional status dot.">
              <div className="ds-panel ds-row">
                <Badge tone="neutral">Neutral</Badge>
                <Badge tone="accent">Accent</Badge>
                <Badge tone="success" dot>Active</Badge>
                <Badge tone="warning" dot>Pending</Badge>
                <Badge tone="danger" dot>Failed</Badge>
                <Badge tone="info" dot>Info</Badge>
                <Badge tone="solid">Solid</Badge>
              </div>
            </Section>

            <Section id="tooltip" icon={MessageSquare} eyebrow="Components" title="Tooltip"
              desc="Contextual hints on hover or keyboard focus. Positioned above the trigger with a subtle motion and pointer.">
              <div className="ds-panel ds-row" style={{ gap: "var(--ds-space-6)" }}>
                <Tooltip label="Create a new item"><Button variant="secondary"><Plus size={16} /> Hover me</Button></Tooltip>
                <Tooltip label="This action is permanent"><Button variant="danger" icon aria-label="Delete"><Trash2 size={16} /></Button></Tooltip>
                <Tooltip label="Focusable with the keyboard too">
                  <span style={{ textDecoration: "underline dotted", cursor: "help", fontSize: "var(--ds-text-base)" }}>Hover this text</span>
                </Tooltip>
              </div>
            </Section>

            <Section id="switch" skeleton="list" icon={ToggleRight} eyebrow="Components" title="Switch"
              desc="An accessible toggle for binary settings, role=switch, keyboard operable, with a spring-eased thumb.">
              <div className="ds-panel" style={{ display: "flex", flexDirection: "column", gap: "var(--ds-space-4)" }}>
                <Switch label="Push notifications" checked={switches.notifications} onChange={(v) => setSwitches((s) => ({ ...s, notifications: v }))} />
                <Switch label="Share anonymous analytics" checked={switches.analytics} onChange={(v) => setSwitches((s) => ({ ...s, analytics: v }))} />
                <Switch label="Marketing emails" checked={switches.marketing} onChange={(v) => setSwitches((s) => ({ ...s, marketing: v }))} />
              </div>
            </Section>

            <Section id="inputs" skeleton="list" icon={FormInput} eyebrow="Components" title="Inputs"
              desc="Form fields with labels, hints, validation and a consistent focus ring. Text, select and textarea share the same visual language.">
              <div className="ds-panel ds-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                <TextField label="Full name" placeholder="Ada Lovelace" hint="As it appears on your ID" />
                <TextField label="Email" type="email" placeholder="you@example.com" error="Enter a valid email address" defaultValue="not-an-email" />
                <SelectField label="Role" options={["Designer", "Engineer", "Product Manager"]} />
                <label className="dsx-field" style={{ gridColumn: "1 / -1" }}>
                  <span className="dsx-field__label">Notes</span>
                  <textarea className="dsx-textarea" placeholder="Write a short description…" />
                </label>
              </div>
            </Section>

            <Section id="modal" icon={CircleHelp} eyebrow="Components" title="Modal"
              desc="A focus-trapped confirmation dialog for yes/no decisions. Backdrop click and the Escape key cancel; Enter confirms.">
              <div className="ds-panel ds-row">
                <Button variant="primary" onClick={() => setDialog("primary")}>Publish changes</Button>
                <Button variant="danger" onClick={() => setDialog("danger")}><Trash2 size={16} /> Delete item</Button>
              </div>
              <ConfirmDialog
                open={dialog === "primary"}
                tone="primary"
                title="Publish these changes?"
                message="Your updates will go live immediately and become visible to everyone."
                confirmLabel="Yes, publish"
                cancelLabel="Not yet"
                onConfirm={() => { setDialog(null); pushToast("success", "Changes published", "Your updates are now live.") }}
                onCancel={() => setDialog(null)}
              />
              <ConfirmDialog
                open={dialog === "danger"}
                tone="danger"
                title="Delete this item?"
                message="This action can't be undone. The item and its data will be permanently removed."
                confirmLabel="Yes, delete"
                cancelLabel="Keep it"
                onConfirm={() => { setDialog(null); pushToast("danger", "Item deleted", "The item was removed.") }}
                onCancel={() => setDialog(null)}
              />
            </Section>

            <Section id="toast" icon={Bell} eyebrow="Components" title="Toasts"
              desc="Transient feedback that stacks in the corner and auto-dismisses. Colour-coded by intent with a manual close.">
              <div className="ds-panel ds-row">
                <Button variant="secondary" onClick={() => pushToast("success", "Saved successfully", "Your work is safe.")}>Success toast</Button>
                <Button variant="secondary" onClick={() => pushToast("danger", "Something went wrong", "Please try again.")}>Error toast</Button>
                <Button variant="secondary" onClick={() => pushToast("info", "Heads up", "A new version is available.")}>Info toast</Button>
              </div>
            </Section>

            <Section id="skeleton" skeleton="grid" icon={LayoutTemplate} eyebrow="Components" title="Skeleton"
              desc="Placeholder loaders with a soft shimmer, shown while content streams in. Every section on this page reveals its body through one as it scrolls into view.">
              <div className="ds-panel ds-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--ds-space-6)", alignItems: "start" }}>
                <div>
                  <div className="ds-label">Text lines</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Skeleton w="70%" h={14} />
                    <Skeleton h={10} />
                    <Skeleton h={10} />
                    <Skeleton w="55%" h={10} />
                  </div>
                </div>
                <div>
                  <div className="ds-label">Avatar &amp; meta</div>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <Skeleton w={48} h={48} circle />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                      <Skeleton w="65%" h={12} />
                      <Skeleton w="40%" h={10} />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="ds-label">Media card</div>
                  <div className="dsx-skel-card">
                    <Skeleton h={84} radius={8} />
                    <Skeleton w="80%" h={12} style={{ marginTop: 12 }} />
                    <Skeleton w="50%" h={10} style={{ marginTop: 8 }} />
                  </div>
                </div>
              </div>
            </Section>

            <Section id="dnd" skeleton="list" icon={Move} eyebrow="Components" title="Drag &amp; Drop"
              desc="A reorderable list built on native drag events. Grab a row and drop it anywhere and the index updates live.">
              <div className="ds-panel">
                <DragDropDemo />
              </div>
            </Section>

            <Section id="gallery" skeleton="grid" icon={Images} eyebrow="Components" title="Photo Gallery"
              desc="A responsive image grid with a full-screen lightbox. Navigate with the arrows or your keyboard; Escape closes.">
              <GalleryDemo />
            </Section>

            <footer style={{ marginTop: "var(--ds-space-16)", paddingTop: "var(--ds-space-6)", borderTop: "1px solid var(--ds-border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--ds-space-4)", flexWrap: "wrap" }}>
              <p style={{ fontSize: "var(--ds-text-sm)", color: "var(--ds-text-muted)" }}>
                Aura Design System, built with React, tokens and a lot of care.
              </p>
              <Link href="/#projectList" className="ds-hero__back" style={{ margin: 0 }}>
                Back to portfolio <ChevronRight size={16} />
              </Link>
            </footer>
          </div>
        </main>
      </div>

      <Toaster toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
