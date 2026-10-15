"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { ArrowUpRight, Download, Play } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"
import { Magnetic } from "@/components/motion/magnetic"
import { buttonClass, chipAccentClass, chipClass, type ButtonSize, type ButtonVariant } from "@/lib/ui"

// ─── Content ──────────────────────────────────────────────────────────────────

const COPY = {
  en: {
    eyebrow: "Portfolio system · v1.0",
    title: "Paper, ink & signal",
    intro:
      "The small design system behind this portfolio: warm paper surfaces, near-black ink and a single red-orange signal colour. Light mode leads; dark mode follows the same tokens.",
    color: "Colour",
    colorNote: "Live values from the CSS custom properties, in both themes.",
    light: "Light",
    dark: "Dark",
    type: "Typography",
    display: "Display · Geist Pixel",
    body: "Body · Satoshi Variable",
    weight: "Weight",
    pangram: "Design is how it works, and how it moves.",
    space: "Spacing & radius",
    spaceNote: "A 4px base. Radii stay soft so the pixel type can be the sharp element.",
    components: "Components",
    primary: "Primary",
    outline: "Secondary",
    magnetic: "Magnetic",
    view: "View project",
    chips: "Chips",
    card: "Card",
    cardTitle: "Project card",
    cardBody: "Inset media, underline-on-hover title, filling arrow badge.",
    motion: "Motion",
    motionNote: "Easing curves used across the site. Press play to watch each one.",
    play: "Play",
    duration: "Durations",
  },
  es: {
    eyebrow: "Sistema del portfolio · v1.0",
    title: "Papel, tinta y señal",
    intro:
      "El pequeño design system detrás de este portfolio: superficies de papel cálido, tinta casi negra y un único color señal rojo anaranjado. El modo claro manda; el oscuro sigue los mismos tokens.",
    color: "Color",
    colorNote: "Valores en vivo de las custom properties de CSS, en ambos temas.",
    light: "Claro",
    dark: "Oscuro",
    type: "Tipografía",
    display: "Display · Geist Pixel",
    body: "Texto · Satoshi Variable",
    weight: "Peso",
    pangram: "El diseño es cómo funciona, y cómo se mueve.",
    space: "Espaciado y radios",
    spaceNote: "Base de 4px. Los radios son suaves para que la tipografía pixel sea el elemento filoso.",
    components: "Componentes",
    primary: "Primario",
    outline: "Secundario",
    magnetic: "Magnético",
    view: "Ver proyecto",
    chips: "Chips",
    card: "Tarjeta",
    cardTitle: "Tarjeta de proyecto",
    cardBody: "Imagen enmarcada, título con subrayado al hover y flecha que se rellena.",
    motion: "Motion",
    motionNote: "Curvas de easing usadas en el sitio. Dale play para ver cada una.",
    play: "Play",
    duration: "Duraciones",
  },
}

const COLOR_TOKENS = [
  { token: "background", name: "Paper" },
  { token: "card", name: "Sheet" },
  { token: "secondary", name: "Sand" },
  { token: "border", name: "Rule" },
  { token: "muted-foreground", name: "Graphite" },
  { token: "foreground", name: "Ink" },
  { token: "primary", name: "Signal" },
  { token: "accent", name: "Ember" },
]

const DISPLAY_SIZES = [
  { label: "Display XL", px: 72 },
  { label: "Display L", px: 56 },
  { label: "Heading", px: 40 },
  { label: "Title", px: 24 },
]

const SPACING = [4, 8, 12, 16, 24, 32, 48, 64, 96]
// Mirrors the --radius-* tokens in globals.css.
const RADII = [
  { token: "tag", px: 4, cls: "rounded-tag", role: { en: "Chips, labels", es: "Chips, etiquetas" } },
  { token: "control", px: 8, cls: "rounded-control", role: { en: "Buttons, inputs", es: "Botones, inputs" } },
  { token: "inner", px: 10, cls: "rounded-inner", role: { en: "Media in cards", es: "Media en tarjetas" } },
  { token: "card", px: 16, cls: "rounded-card", role: { en: "Cards", es: "Tarjetas" } },
  { token: "panel", px: 20, cls: "rounded-panel", role: { en: "Panels, nav", es: "Paneles, nav" } },
]

const BUTTON_VARIANTS: ButtonVariant[] = ["primary", "ink", "secondary", "ghost"]
const BUTTON_SIZES: ButtonSize[] = ["sm", "md", "lg"]

const EASES = ["power3.out", "power4.out", "back.out(1.7)", "expo.inOut", "elastic.out(1, 0.4)"]
const DURATIONS = [
  { label: "fast", s: 0.3 },
  { label: "base", s: 0.6 },
  { label: "slow", s: 0.9 },
  { label: "story", s: 1.4 },
]

// ─── Pieces ───────────────────────────────────────────────────────────────────

function Section({ index, title, note, children }: { index: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section className="sys-section border-t border-border py-16 md:py-24">
      <div className="grid gap-10 md:grid-cols-[220px_minmax(0,1fr)]">
        <header>
          <p className="font-mono text-xs text-primary">{index}</p>
          <h2 className="mt-2 overflow-hidden font-display text-3xl md:text-4xl">
            <span className="sys-title inline-block">{title}</span>
          </h2>
          {note && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{note}</p>}
        </header>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  )
}

// Resolve any CSS colour (oklch, lab…) to a hex string via a 1px canvas.
function toHex(color: string) {
  const ctx = document.createElement("canvas").getContext("2d")
  if (!ctx || !color) return color
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`.toUpperCase()
}

// One column of swatches rendered inside a theme wrapper so it always shows
// that theme's values, whatever theme the page itself is in.
function SwatchColumn({ theme, label }: { theme: "light" | "dark"; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!ref.current) return
    const styles = getComputedStyle(ref.current)
    setValues(Object.fromEntries(COLOR_TOKENS.map((c) => [c.token, toHex(styles.getPropertyValue(`--${c.token}`).trim())])))
  }, [])

  return (
    <div ref={ref} className={`${theme} rounded-panel border border-border bg-background p-4 text-foreground`}>
      <p className="mb-3 px-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {COLOR_TOKENS.map((c) => (
          <li key={c.token} className="sys-swatch overflow-hidden rounded-control border border-border bg-card">
            <div className="h-20" style={{ background: `var(--${c.token})` }} />
            <div className="p-3">
              <p className="text-sm font-semibold">{c.name}</p>
              <p className="font-mono text-[10px] text-muted-foreground">--{c.token}</p>
              <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">{values[c.token]}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function EaseCurve({ ease, play }: { ease: string; play: number }) {
  const dotRef = useRef<SVGCircleElement>(null)
  const W = 200
  const H = 120
  const pad = 14

  // Sample the ease into an SVG path; overshooting eases go outside the box.
  const fn = useMemo(() => gsap.parseEase(ease), [ease])
  const points = Array.from({ length: 61 }, (_, i) => {
    const t = i / 60
    const x = pad + t * (W - pad * 2)
    const y = H - pad - fn(t) * (H - pad * 2)
    return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`
  }).join(" ")

  useEffect(() => {
    if (!play || !dotRef.current) return
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const p = { t: 0 }
      gsap.to(p, {
        t: 1,
        duration: 1.2,
        ease: "none",
        onUpdate: () => {
          dotRef.current?.setAttribute("cx", String(pad + p.t * (W - pad * 2)))
          dotRef.current?.setAttribute("cy", String(H - pad - fn(p.t) * (H - pad * 2)))
        },
      })
    })
    return () => mm.revert()
  }, [play, fn])

  return (
    <figure className="sys-curve rounded-card border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" aria-hidden="true">
        <rect x={pad} y={pad} width={W - pad * 2} height={H - pad * 2} fill="none" className="stroke-border" strokeDasharray="3 4" />
        <path d={points} fill="none" className="sys-curve-path stroke-primary" strokeWidth={2.5} strokeLinecap="round" pathLength={1} />
        <circle ref={dotRef} cx={pad} cy={H - pad} r={5} className="fill-foreground" />
      </svg>
      <figcaption className="mt-3 font-mono text-xs text-muted-foreground">{ease}</figcaption>
    </figure>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SystemView() {
  const { language } = useLanguage()
  const c = COPY[language]
  const rootRef = useRef<HTMLDivElement>(null)
  const [weight, setWeight] = useState(500)
  const [play, setPlay] = useState(0)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(".sys-hero-char", { yPercent: 110, duration: 0.9, stagger: 0.025 })
          .from(".sys-hero-fade", { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.5")

        // Signature mark: rules draw in, square drops into place.
        gsap.fromTo(
          ".sys-mark .draw",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.4, ease: "power3.inOut", stagger: 0.12, delay: 0.3 },
        )
        gsap.from(".sys-mark .drop", { y: -40, opacity: 0, duration: 1, ease: "bounce.out", delay: 1.1 })

        gsap.utils.toArray<HTMLElement>(".sys-section").forEach((section) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: "top 75%" } })
          tl.from(section.querySelector(".sys-title"), { yPercent: 110, duration: 0.8, ease: "power4.out" })
          const swatches = section.querySelectorAll(".sys-swatch")
          if (swatches.length)
            tl.from(swatches, { y: 30, opacity: 0, duration: 0.6, stagger: 0.04, ease: "power3.out" }, "-=0.4")
          const bars = section.querySelectorAll(".sys-bar")
          if (bars.length) tl.from(bars, { scaleX: 0, duration: 0.8, stagger: 0.05, ease: "power3.out" }, "-=0.4")
          const items = section.querySelectorAll(".sys-item")
          if (items.length)
            tl.from(items, { y: 24, opacity: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" }, "-=0.4")
          const curves = section.querySelectorAll(".sys-curve-path")
          if (curves.length)
            tl.fromTo(curves, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, stagger: 0.1, ease: "power2.inOut" }, "-=0.2")
        })
      })
      return () => mm.revert()
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className="relative z-10 mx-auto max-w-6xl px-4 pt-32 pb-24 md:pt-44">
      {/* ── Hero ── */}
      <header className="grid items-end gap-10 pb-16 md:grid-cols-[1fr_auto]">
        <div>
          <p className="sys-hero-fade font-mono text-xs uppercase tracking-[0.25em] text-primary">{c.eyebrow}</p>
          <h1 className="mt-6 font-display text-5xl leading-[1] sm:text-6xl md:text-7xl" aria-label={c.title}>
            {c.title.split(" ").map((word, w) => (
              <span key={w} aria-hidden="true" className="mr-[0.3em] inline-block overflow-hidden align-bottom">
                {word.split("").map((ch, i) => (
                  <span key={i} className="sys-hero-char inline-block">
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="sys-hero-fade mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{c.intro}</p>
        </div>

        {/* Signature mark: baseline grid, kerning brackets and a signal square */}
        <svg viewBox="0 0 200 200" className="sys-mark h-40 w-40 md:h-52 md:w-52" aria-hidden="true">
          <g className="stroke-foreground" fill="none" strokeWidth={1.5}>
            <path className="draw" pathLength={1} strokeDasharray={1} d="M10 150 H190" />
            <path className="draw" pathLength={1} strokeDasharray={1} d="M10 110 H190" opacity={0.35} />
            <path className="draw" pathLength={1} strokeDasharray={1} d="M10 70 H190" opacity={0.35} />
            <path className="draw" pathLength={1} strokeDasharray={1} d="M40 40 V170" />
            <path className="draw" pathLength={1} strokeDasharray={1} d="M160 40 V170" />
            <path className="draw" pathLength={1} strokeDasharray={1} d="M40 40 H55 M40 170 H55 M160 40 H145 M160 170 H145" />
          </g>
          <rect className="drop fill-primary" x={78} y={86} width={44} height={64} />
          <circle className="drop fill-foreground" cx={100} cy={70} r={6} />
        </svg>
      </header>

      {/* ── 01 Colour ── */}
      <Section index="01" title={c.color} note={c.colorNote}>
        <div className="grid gap-4">
          <SwatchColumn theme="light" label={c.light} />
          <SwatchColumn theme="dark" label={c.dark} />
        </div>
      </Section>

      {/* ── 02 Typography ── */}
      <Section index="02" title={c.type}>
        <p className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">{c.display}</p>
        <ul className="space-y-6">
          {DISPLAY_SIZES.map((d) => (
            <li key={d.px} className="sys-item flex items-baseline gap-6 border-b border-border pb-4">
              <span className="w-24 flex-shrink-0 font-mono text-xs text-muted-foreground">
                {d.label}
                <br />
                {d.px}px
              </span>
              <span className="font-display leading-none" style={{ fontSize: `clamp(20px, ${d.px / 14.4}vw, ${d.px}px)` }}>
                Santiago Requelme
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{c.body}</p>
            <label className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
              {c.weight}
              <input
                type="range"
                min={300}
                max={900}
                step={10}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-40 accent-[var(--primary)]"
              />
              <span className="w-8 text-foreground">{weight}</span>
            </label>
          </div>
          <p className="sys-item text-3xl leading-snug md:text-5xl" style={{ fontWeight: weight }}>
            {c.pangram}
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
            {[300, 400, 500, 600, 700, 800, 900].map((w) => (
              <li key={w} className="sys-item rounded-control border border-border bg-card p-4">
                <span className="block text-3xl" style={{ fontWeight: w }}>
                  Aa
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── 03 Spacing & radius ── */}
      <Section index="03" title={c.space} note={c.spaceNote}>
        <ul className="space-y-3">
          {SPACING.map((s) => (
            <li key={s} className="flex items-center gap-4">
              
              <span className="w-10 flex-shrink-0 font-mono text-xs text-muted-foreground">{s}</span>
              <span className="sys-bar block h-3 min-w-0 origin-left rounded-[2px] bg-primary" style={{ width: `min(${s * 4}px, 100%)` }} />
            </li>
          ))}
        </ul>
        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {RADII.map((r) => (
            <li key={r.token} className="sys-item">
              <span className={`relative block h-24 border border-foreground/70 bg-secondary ${r.cls}`}>
                <span
                  className="absolute left-0 top-0 border-l border-t border-primary"
                  style={{ width: r.px, height: r.px }}
                  aria-hidden="true"
                />
              </span>
              <span className="mt-3 block font-mono text-[11px] text-foreground">
                --radius-{r.token} · {r.px}px
              </span>
              <span className="block text-xs text-muted-foreground">{r.role[language]}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── 04 Components ── */}
      <Section index="04" title={c.components}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="sys-item overflow-x-auto rounded-card border border-border bg-card p-6 md:col-span-2">
            <table className="w-full border-separate border-spacing-y-3 text-left">
              <thead>
                <tr>
                  <th className="w-24" />
                  {BUTTON_SIZES.map((size) => (
                    <th key={size} className="font-mono text-[11px] font-normal uppercase tracking-widest text-muted-foreground">
                      {size}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BUTTON_VARIANTS.map((variant) => (
                  <tr key={variant}>
                    <td className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{variant}</td>
                    {BUTTON_SIZES.map((size) => (
                      <td key={size} className="pr-4">
                        <button type="button" className={buttonClass(variant, size)}>
                          {variant === "primary" && <Download className="h-4 w-4" aria-hidden="true" />}
                          {variant === "primary" ? c.primary : variant === "secondary" ? c.outline : variant === "ink" ? "Ink" : "Ghost"}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sys-item flex flex-wrap items-center gap-4 rounded-card border border-border bg-card p-6">
            <Magnetic>
              <button type="button" className={buttonClass("secondary", "md")}>
                {c.magnetic}
              </button>
            </Magnetic>
            <span className="inline-flex items-center gap-1.5 rounded-control bg-foreground/90 px-3 py-1.5 text-xs font-medium text-background">
              {c.view}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </div>

          <div className="sys-item flex flex-wrap items-center gap-2 rounded-card border border-border bg-card p-6">
            {["React", "TypeScript", "GSAP"].map((chip) => (
              <span key={chip} className={chipAccentClass}>
                {chip}
              </span>
            ))}
            {["Figma", "WCAG"].map((chip) => (
              <span key={chip} className={chipClass}>
                {chip}
              </span>
            ))}
          </div>

          <a href="#" onClick={(e) => e.preventDefault()} className="sys-item group flex flex-col rounded-card border border-border bg-card p-1.5 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-primary/30 md:col-span-2 md:flex-row">
            <div className="relative aspect-video overflow-hidden rounded-inner bg-secondary md:w-1/2">
              <svg viewBox="0 0 320 180" className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105" aria-hidden="true">
                <rect width="320" height="180" className="fill-secondary" />
                <g className="stroke-foreground/30" strokeWidth="1">
                  {Array.from({ length: 9 }, (_, i) => (
                    <line key={i} x1={i * 40} y1="0" x2={i * 40} y2="180" />
                  ))}
                </g>
                <rect x="120" y="50" width="80" height="80" className="fill-primary" />
                <circle cx="200" cy="50" r="10" className="fill-foreground" />
              </svg>
            </div>
            <div className="flex flex-1 items-start justify-between gap-4 p-5">
              <div>
                <h3 className="text-lg">
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1.5px]">
                    {c.cardTitle}
                  </span>
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.cardBody}</p>
              </div>
              <span className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-control border border-border transition-colors duration-500 group-hover:border-primary group-hover:text-primary-foreground">
                <span className="absolute inset-0 scale-0 bg-primary transition-transform duration-500 group-hover:scale-100" />
                <ArrowUpRight className="relative h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </div>
          </a>
        </div>
      </Section>

      {/* ── 05 Motion ── */}
      <Section index="05" title={c.motion} note={c.motionNote}>
        <button
          type="button"
          onClick={() => setPlay((n) => n + 1)}
          className={buttonClass("ink", "md", "mb-6")}
        >
          <Play className="h-4 w-4" aria-hidden="true" />
          {c.play}
        </button>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {EASES.map((e) => (
            <EaseCurve key={e} ease={e} play={play} />
          ))}
        </div>
        <p className="mt-10 mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">{c.duration}</p>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {DURATIONS.map((d) => (
            <li key={d.label} className="sys-item rounded-control border border-border bg-card p-4">
              <p className="font-display text-2xl">{d.s}s</p>
              <p className="font-mono text-xs text-muted-foreground">{d.label}</p>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}
