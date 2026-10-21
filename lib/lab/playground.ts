// Design-to-Code Playground: configuration model, design tokens and class
// recipes. This file is the single source of truth - the live preview renders
// these recipes and the code generator prints the very same strings, so the
// preview and the code panel cannot drift apart.

export type ComponentKind = "button" | "card" | "input"
export type Size = "sm" | "md" | "lg"
export type PreviewTheme = "light" | "dark"
export type PreviewState = "default" | "hover" | "disabled"
export type Framework = "react" | "angular"

export const VARIANTS = {
  button: ["primary", "secondary", "ghost"],
  card: ["elevated", "outlined", "filled"],
  input: ["outline", "filled"],
} as const satisfies Record<ComponentKind, readonly string[]>

export type Variant = (typeof VARIANTS)[ComponentKind][number]

export interface PlaygroundConfig {
  component: ComponentKind
  variant: Variant
  size: Size
  theme: PreviewTheme
  state: PreviewState
  radius: number
  accent: string
  showCode: boolean
  framework: Framework
}

export const ACCENT_PRESETS = [
  { name: "Signal", value: "#E23A0D" },
  { name: "Violet", value: "#7C5CFC" },
  { name: "Blue", value: "#2F7CF6" },
  { name: "Green", value: "#16A361" },
] as const

export const RADIUS_RANGE = { min: 0, max: 24, step: 1 } as const

export const DEFAULT_CONFIG: PlaygroundConfig = {
  component: "button",
  variant: "primary",
  size: "md",
  theme: "dark",
  state: "default",
  radius: 8,
  accent: ACCENT_PRESETS[0].value,
  showCode: true,
  framework: "react",
}

/** Switching component resets the variant to that component's first one. */
export function withComponent(config: PlaygroundConfig, component: ComponentKind): PlaygroundConfig {
  return { ...config, component, variant: VARIANTS[component][0] }
}

// ─── Colour helpers ─────────────────────────────────────────────────────────

function hexToRgb(hex: string) {
  const h = hex.replace("#", "")
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h
  const n = Number.parseInt(full, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`.toUpperCase()
}

/** Mix a colour towards black by `amount` (0-1). */
function darken(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex({ r: r * (1 - amount), g: g * (1 - amount), b: b * (1 - amount) })
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const lin = [r, g, b].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

export function contrastRatio(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Text colour for content placed on the accent: whichever contrasts more. */
function onAccent(accent: string) {
  return contrastRatio(accent, "#FFFFFF") >= contrastRatio(accent, "#111111") ? "#FFFFFF" : "#111111"
}

// ─── Tokens ─────────────────────────────────────────────────────────────────

const THEME_SURFACES = {
  light: { canvas: "#F4F2EE", surface: "#FFFFFF", fg: "#17120F", muted: "#6B635D", border: "#E2DDD9" },
  dark: { canvas: "#111215", surface: "#1B1C21", fg: "#F2F2F4", muted: "#A0A0AB", border: "#2E3037" },
} as const

export type TokenName =
  | "--ui-accent"
  | "--ui-accent-hover"
  | "--ui-on-accent"
  | "--ui-radius"
  | "--ui-canvas"
  | "--ui-surface"
  | "--ui-fg"
  | "--ui-muted"
  | "--ui-border"

/** CSS custom properties the components read. */
export function resolveTokens(config: PlaygroundConfig): Record<TokenName, string> {
  const s = THEME_SURFACES[config.theme]
  return {
    "--ui-accent": config.accent.toUpperCase(),
    "--ui-accent-hover": darken(config.accent, 0.14),
    "--ui-on-accent": onAccent(config.accent),
    "--ui-radius": `${config.radius}px`,
    "--ui-canvas": s.canvas,
    "--ui-surface": s.surface,
    "--ui-fg": s.fg,
    "--ui-muted": s.muted,
    "--ui-border": s.border,
  }
}

// ─── Class recipes ──────────────────────────────────────────────────────────
// Every string is a complete literal so Tailwind can compile it statically.
// `data-[force=hover]:` mirrors each hover style so docs and visual tests can
// pin the hover state without a pointer.

export const RECIPES = {
  button: {
    base:
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--ui-radius)] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ui-canvas)] disabled:cursor-not-allowed disabled:opacity-50",
    sizes: {
      sm: "h-8 px-3 text-[13px]",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-5 text-base",
    },
    variants: {
      primary:
        "bg-[var(--ui-accent)] text-[var(--ui-on-accent)] enabled:hover:bg-[var(--ui-accent-hover)] data-[force=hover]:bg-[var(--ui-accent-hover)]",
      secondary:
        "border border-[var(--ui-border)] bg-[var(--ui-surface)] text-[var(--ui-fg)] enabled:hover:border-[var(--ui-accent)] data-[force=hover]:border-[var(--ui-accent)]",
      ghost:
        "bg-transparent text-[var(--ui-accent)] enabled:hover:bg-[color-mix(in_srgb,var(--ui-accent)_12%,transparent)] data-[force=hover]:bg-[color-mix(in_srgb,var(--ui-accent)_12%,transparent)]",
    },
  },
  card: {
    base:
      "flex w-full flex-col gap-3 rounded-[var(--ui-radius)] text-[var(--ui-fg)] transition-[box-shadow,border-color,background-color] duration-200 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    sizes: {
      sm: "max-w-60 p-4",
      md: "max-w-72 p-5",
      lg: "max-w-80 p-6",
    },
    variants: {
      elevated:
        "bg-[var(--ui-surface)] shadow-[0_8px_24px_-12px_rgb(0_0_0/0.35)] hover:shadow-[0_18px_36px_-14px_rgb(0_0_0/0.5)] data-[force=hover]:shadow-[0_18px_36px_-14px_rgb(0_0_0/0.5)]",
      outlined:
        "border border-[var(--ui-border)] bg-transparent hover:border-[var(--ui-accent)] data-[force=hover]:border-[var(--ui-accent)]",
      filled:
        "bg-[color-mix(in_srgb,var(--ui-accent)_10%,var(--ui-surface))] hover:bg-[color-mix(in_srgb,var(--ui-accent)_16%,var(--ui-surface))] data-[force=hover]:bg-[color-mix(in_srgb,var(--ui-accent)_16%,var(--ui-surface))]",
    },
    parts: {
      eyebrow: "text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--ui-accent)]",
      title: "text-base font-semibold leading-snug",
      body: "text-sm leading-relaxed text-[var(--ui-muted)]",
      action:
        "mt-1 inline-flex w-fit items-center gap-1 rounded-[calc(var(--ui-radius)/2)] text-sm font-medium text-[var(--ui-accent)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-accent)]",
    },
  },
  input: {
    base:
      "w-full rounded-[var(--ui-radius)] text-[var(--ui-fg)] outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-[var(--ui-muted)] focus-visible:border-[var(--ui-accent)] focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--ui-accent)_25%,transparent)] disabled:cursor-not-allowed disabled:opacity-50",
    sizes: {
      sm: "h-8 px-2.5 text-[13px]",
      md: "h-10 px-3 text-sm",
      lg: "h-12 px-4 text-base",
    },
    variants: {
      outline:
        "border border-[var(--ui-border)] bg-[var(--ui-surface)] enabled:hover:border-[color-mix(in_srgb,var(--ui-fg)_35%,var(--ui-border))] data-[force=hover]:border-[color-mix(in_srgb,var(--ui-fg)_35%,var(--ui-border))]",
      filled:
        "border border-transparent bg-[color-mix(in_srgb,var(--ui-fg)_7%,var(--ui-surface))] enabled:hover:bg-[color-mix(in_srgb,var(--ui-fg)_11%,var(--ui-surface))] data-[force=hover]:bg-[color-mix(in_srgb,var(--ui-fg)_11%,var(--ui-surface))]",
    },
    parts: {
      field: "flex w-full max-w-72 flex-col gap-1.5",
      label: "text-sm font-medium text-[var(--ui-fg)]",
      hint: "text-xs text-[var(--ui-muted)]",
    },
  },
} as const

/** Sample content shared by the preview and the generated usage code. */
export const SAMPLE = {
  button: { label: "Save changes" },
  card: {
    eyebrow: "Design system",
    title: "Tokens, not hex codes",
    body: "Components read semantic tokens, so a theme change is one config, not a refactor.",
    action: "Read the docs",
  },
  input: { label: "Email", placeholder: "you@company.com", hint: "We'll only use it to reply." },
} as const
