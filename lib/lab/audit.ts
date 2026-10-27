// The system checking its own values, not just how they are used. The same
// functions run in `pnpm tokens:audit` (before every build) and live in the
// lab, so a wrong token fails once instead of shipping in five languages.
//
//   contrast  every pair in the specs' accessibility.contrastChecks, and
//             color.primary never used as text (it is below 4.5:1 on surface)
//   target    the minimum touch target per platform, and that the native
//             Button and Input pad their tap area to it
//   scope     every token says whether it is shared or platform-local

import { componentCss } from "./component-css"
import { ACCENT_PRESETS, contrastRatio, DEFAULT_CONFIG, RECIPES, resolveTokens, THEME_SURFACES, type ComponentKind, type PreviewTheme } from "./playground"
import { SPECS } from "./specs"
import { componentFiles } from "./stacks"
import { platformValue, type FlatToken, type NativePlatform } from "./token-outputs"

export type Platform = "web" | NativePlatform

/** Minimum touch target per platform, in px, pt or dp (all 1/16 rem in the tokens). */
export const TARGET_GUIDELINES: Record<Platform, { size: number; unit: string; source: string }> = {
  web: { size: 24, unit: "px", source: "WCAG 2.2, 2.5.8 Target Size (Minimum)" },
  ios: { size: 44, unit: "pt", source: "Apple Human Interface Guidelines" },
  android: { size: 48, unit: "dp", source: "Material Design" },
}

export interface AuditCheck {
  id: string
  kind: "contrast" | "target" | "scope"
  label: string
  detail: string
  pass: boolean
  component?: ComponentKind
}

const COMPONENTS = Object.keys(SPECS) as ComponentKind[]
const PLATFORM_NAMES: Record<Platform, string> = { web: "web", ios: "iOS", android: "Android" }
const round = (n: number) => Math.floor(n * 100) / 100
const rem = (value: string) => Number.parseFloat(value) * 16

/** Contrast checks from the specs, against a palette of token path → hex. */
export function contrastChecks(palette: Record<string, string | undefined>, prefix = ""): AuditCheck[] {
  return COMPONENTS.flatMap((component) =>
    SPECS[component].accessibility.contrastChecks.map((c, i): AuditCheck => {
      const fg = palette[c.foreground]
      const bg = palette[c.background]
      const id = `${prefix}contrast.${component}.${i}`
      const label = `${SPECS[component].name}: ${c.label}`
      if (!fg || !bg) return { id, kind: "contrast", component, label, detail: `${c.foreground} or ${c.background} is not a colour token`, pass: false }
      const ratio = round(contrastRatio(fg, bg))
      return { id, kind: "contrast", component, label, detail: `${c.foreground} on ${c.background}: ${ratio}:1, needs ${c.min}:1`, pass: ratio >= c.min }
    }),
  )
}

const colourPalette = (tokens: FlatToken[]) =>
  Object.fromEntries(tokens.filter((t) => t.type === "color").map((t) => [t.path.join("."), t.value]))

function targetChecks(tokens: FlatToken[]): AuditCheck[] {
  const find = (path: string) => tokens.find((t) => t.path.join(".") === path)
  const minTarget = find("control.minTarget")
  if (!minTarget) return [{ id: "target.token", kind: "target", label: "Minimum touch target", detail: "control.minTarget is missing", pass: false }]

  const checks = (Object.keys(TARGET_GUIDELINES) as Platform[]).map((platform): AuditCheck => {
    const { size, unit, source } = TARGET_GUIDELINES[platform]
    const value = rem(platformValue(minTarget, platform))
    return { id: `target.${platform}`, kind: "target", label: `Touch target on ${PLATFORM_NAMES[platform]}`, detail: `control.minTarget is ${value}${unit}; ${source} asks for ${size}${unit}`, pass: value >= size }
  })

  const heights = ["sm", "md", "lg"].map((s) => [s, find(`control.${s}`)] as const)
  const webMin = rem(minTarget.value)
  checks.push({
    id: "target.web.heights",
    kind: "target",
    label: "Web control heights",
    detail: `${heights.map(([s, t]) => `${s} ${t ? rem(t.value) : "?"}px`).join(", ")}, at least ${webMin}px`,
    pass: heights.every(([, t]) => t !== undefined && rem(t.value) >= webMin),
  })

  // The visible height is shared; on native, the tap area is padded to the platform minimum.
  for (const [stack, platform] of [["swift", "ios"], ["kotlin", "android"]] as const) {
    const missing = (["button", "input"] as const).filter((kind) => !componentFiles(kind, stack).some((f) => f.code.includes("Tokens.controlMinTarget")))
    checks.push({
      id: `target.${platform}.code`,
      kind: "target",
      label: `${PLATFORM_NAMES[platform]} tap area in code`,
      detail: missing.length ? `${missing.join(" and ")} do not read Tokens.controlMinTarget` : "Button and Input pad their tap area to Tokens.controlMinTarget",
      pass: missing.length === 0,
    })
  }
  return checks
}

function scopeChecks(tokens: FlatToken[]): AuditCheck[] {
  const undeclared = tokens.filter((t) => !t.scope).map((t) => t.path.join("."))
  const incomplete = tokens.filter((t) => t.scope === "platform" && (!t.native?.ios || !t.native.android)).map((t) => t.path.join("."))
  const local = tokens.filter((t) => t.scope === "platform").map((t) => t.path.join("."))
  return [
    {
      id: "scope.declared",
      kind: "scope",
      label: "Every token is shared or platform-local",
      detail: undeclared.length ? `No scope: ${undeclared.join(", ")}` : `${tokens.length - local.length} shared, ${local.length} platform-local (${local.join(", ")})`,
      pass: undeclared.length === 0,
    },
    {
      id: "scope.values",
      kind: "scope",
      label: "Platform-local tokens have iOS and Android values",
      detail: incomplete.length ? `Missing a native value: ${incomplete.join(", ")}` : "Each one has a web, iOS and Android value",
      pass: incomplete.length === 0,
    },
  ]
}

// Text in color.primary, per place it could hide: web CSS, playground classes,
// SwiftUI foregrounds and Compose text colours (including a variant's content colour).
export const PRIMARY_AS_TEXT: [string, (kind: ComponentKind) => string, RegExp][] = [
  ["web CSS", (kind) => componentCss(kind), /(?<![-\w])color:\s*var\(--ds-color-primary\)/],
  ["playground", (kind) => JSON.stringify(RECIPES[kind]), /text-\[var\(--ui-accent\)\]/],
  ["Swift", (kind) => componentFiles(kind, "swift").map((f) => f.code).join("\n"), /foregroundStyle\(Tokens\.colorPrimary|return \([^,()]+, Tokens\.colorPrimary/],
  ["Kotlin", (kind) => componentFiles(kind, "kotlin").map((f) => f.code).join("\n"), /color = Tokens\.colorPrimary|Triple\([^,()]+(\([^)]*\))?, Tokens\.colorPrimary/],
]

function primaryTextChecks(): AuditCheck[] {
  return COMPONENTS.map((component): AuditCheck => {
    const found = PRIMARY_AS_TEXT.filter(([, code, re]) => re.test(code(component))).map(([where]) => where)
    return {
      id: `contrast.${component}.primaryText`,
      kind: "contrast",
      component,
      label: `${SPECS[component].name}: no text in color.primary`,
      detail: found.length ? `color.primary is used as text in ${found.join(", ")}` : "Primary is only used for fills, borders, underlines and focus rings",
      pass: found.length === 0,
    }
  })
}

/** Every check against a token set (the source tokens, or the lab's edited copy). */
export function auditTokens(tokens: FlatToken[]): AuditCheck[] {
  return [...contrastChecks(colourPalette(tokens)), ...primaryTextChecks(), ...targetChecks(tokens), ...scopeChecks(tokens)]
}

/** The playground's recipes read their own palette, so they get the same contrast checks per theme and accent. */
export function auditPlayground(): AuditCheck[] {
  return (Object.keys(THEME_SURFACES) as PreviewTheme[]).flatMap((theme) =>
    ACCENT_PRESETS.flatMap((accent) => {
      const t = resolveTokens({ ...DEFAULT_CONFIG, theme, accent: accent.value })
      const palette = {
        "color.surface": t["--ui-surface"],
        "color.text": t["--ui-fg"],
        "color.muted": t["--ui-muted"],
        "color.primary": t["--ui-accent"],
        "color.onPrimary": t["--ui-on-accent"],
        "color.border": t["--ui-border"],
        "color.controlBorder": t["--ui-control"],
      }
      return contrastChecks(palette, `playground.${theme}.${accent.name.toLowerCase()}.`).map((c) => ({ ...c, label: `Playground ${theme}, ${accent.name}: ${c.label}` }))
    }),
  )
}
