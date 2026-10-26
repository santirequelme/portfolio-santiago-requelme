// Checks one component usage (its props) against the component's spec:
// unknown props, invalid values and types, missing required props, the
// spec's accessibility rules, and hardcoded values that should be tokens.

import { SPECS } from "@/lib/lab/specs"
import { SOURCE_TOKENS, flatTokens, cssVarName } from "@/lib/lab/stack-tokens"
import type { PropSpec } from "@/specs/schema/component-spec"
import { parseComponent } from "./parse"
import type { Result, UsageIssue, UsageReport } from "./types"

const HEX = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/gi
const COLOR_FN = /\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\([^)]*\)/gi
const LENGTH = /(?<![\w-])\d*\.?\d+(?:px|rem)\b/g
const TAILWIND_ARBITRARY = /\b[\w-]+-\[[^\]]+\]/g
const TAILWIND_PALETTE =
  /\b(?:bg|text|border|ring|outline|fill|stroke|from|via|to|shadow)-(?:white|black|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3})\b/g

// Native attributes that are fine to pass through on every component.
const PASS_THROUGH = /^(?:aria-|data-|on[A-Z])|^(?:id|role|title|tabIndex|name|value|type|form|autoComplete|style|className|class)$/

const tokens = flatTokens(SOURCE_TOKENS)
const colorTokens = tokens.filter((t) => t.type === "color")

function rgb(hex: string) {
  const h = hex.replace("#", "").slice(0, 6)
  const full = h.length === 3 ? h.replace(/./g, "$&$&") : h
  const n = Number.parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** The token a hex colour equals, or the nearest one. */
function colorSuggestion(hex: string) {
  const [r, g, b] = rgb(hex)
  const ranked = colorTokens
    .map((t) => {
      const [tr, tg, tb] = rgb(t.value)
      return { t, d: (r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2 }
    })
    .sort((a, b) => a.d - b.d)
  const best = ranked[0].t
  const name = `var(${cssVarName(best.path)})`
  return ranked[0].d === 0
    ? `This is ${best.path.join(".")}: use ${name}.`
    : `Use a colour token, e.g. ${best.path.join(".")} (${name}) is the closest.`
}

function lengthSuggestion(length: string) {
  const px = length.endsWith("rem") ? Number.parseFloat(length) * 16 : Number.parseFloat(length)
  const match = tokens.find((t) => t.type !== "color" && Number.parseFloat(t.value) * 16 === px)
  return match
    ? `This equals ${match.path.join(".")}: use var(${cssVarName(match.path)}).`
    : "Use a spacing, radius or font-size token. If none fits, add one to tokens/lab.tokens.json first."
}

/** Every string inside a prop value, with where it was found. */
function strings(value: unknown, where: string): [string, string][] {
  if (typeof value === "string") return [[where, value]]
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => strings(v, `${where}.${k}`))
  return []
}

function hardcoded(prop: string, value: unknown): UsageIssue[] {
  const issues: UsageIssue[] = []
  const report = (where: string, message: string, suggestion: string) =>
    issues.push({ severity: "error", kind: "hardcoded_value", prop: where, message, suggestion })

  for (const [where, text] of strings(value, prop)) {
    let rest = text.replace(/var\(--ds-[\w-]+\)/g, "")
    // Tailwind arbitrary values first, so `bg-[#3b82f6]` is reported once.
    for (const m of rest.match(TAILWIND_ARBITRARY) ?? []) {
      const hex = m.match(HEX)?.[0]
      if (hex) report(where, `Hardcoded colour ${m}.`, colorSuggestion(hex))
      else report(where, `Arbitrary value ${m}.`, "Use the component's variant or size, or a token.")
      rest = rest.replace(m, "")
    }
    for (const m of rest.match(TAILWIND_PALETTE) ?? [])
      report(where, `Palette colour class ${m} bypasses the tokens.`, "Use the component's variant, or a token through a CSS variable.")
    for (const m of rest.match(HEX) ?? []) report(where, `Hardcoded colour ${m}.`, colorSuggestion(m))
    for (const m of rest.match(COLOR_FN) ?? []) report(where, `Hardcoded colour ${m}.`, "Use a colour token, e.g. var(--ds-color-primary).")
    if (where.startsWith("style")) for (const m of rest.match(LENGTH) ?? []) report(where, `Hardcoded size ${m}.`, lengthSuggestion(m))
  }
  return issues
}

function checkProp(spec: PropSpec, value: unknown): UsageIssue | null {
  if (spec.type === "enum") {
    if (typeof value === "string" && spec.values?.includes(value)) return null
    return {
      severity: "error",
      kind: "invalid_value",
      prop: spec.name,
      message: `${JSON.stringify(value)} is not a valid ${spec.name}.`,
      suggestion: `Use one of: ${spec.values?.join(", ")}${spec.default !== null ? ` (default ${spec.default})` : ""}.`,
    }
  }
  const expected = spec.type === "string" ? "string" : spec.type === "boolean" ? "boolean" : null
  if (expected && typeof value !== expected)
    return { severity: "error", kind: "invalid_type", prop: spec.name, message: `${spec.name} must be a ${expected}, got ${typeof value}.` }
  return null
}

const hasText = (v: unknown) => typeof v === "string" && v.trim().length > 0

/** The spec's accessibility rules that can be checked from props alone. */
function accessibility(component: keyof typeof SPECS, props: Record<string, unknown>): UsageIssue[] {
  const rule = SPECS[component].accessibility
  const issues: UsageIssue[] = []
  if (component === "button" && !hasText(props.children) && !hasText(props["aria-label"]) && !hasText(props["aria-labelledby"]))
    issues.push({ severity: "error", kind: "accessibility", prop: "children", message: rule.labels })
  if (component === "input" && hasText(props.placeholder) && !hasText(props.label))
    issues.push({ severity: "error", kind: "accessibility", prop: "label", message: rule.labels })
  if (component === "card" && props.disabled === true)
    issues.push({ severity: "warning", kind: "accessibility", prop: "disabled", message: rule.keyboard[1] ?? rule.keyboard[0] })
  return issues
}

export function validateUsage(component: unknown, props: unknown): Result<UsageReport> {
  const parsed = parseComponent(component)
  if (!parsed.ok) return parsed
  if (!props || typeof props !== "object" || Array.isArray(props))
    return { ok: false, error: { code: "invalid_props", message: "props must be an object of prop names to values.", received: props, valid: [] } }

  const id = parsed.data
  const spec = SPECS[id]
  const values = props as Record<string, unknown>
  const issues: UsageIssue[] = []

  for (const [name, value] of Object.entries(values)) {
    const propSpec = spec.props.find((p) => p.name === name)
    if (propSpec) {
      const issue = checkProp(propSpec, value)
      if (issue) issues.push(issue)
    } else if (!PASS_THROUGH.test(name)) {
      issues.push({
        severity: "warning",
        kind: "unknown_prop",
        prop: name,
        message: `${name} is not in the ${spec.name} spec.`,
        suggestion: `Spec props: ${spec.props.map((p) => p.name).join(", ")}.${spec.extends ? ` Native attributes pass through (${spec.extends}).` : ""}`,
      })
    }
    issues.push(...hardcoded(name, value))
  }

  // An accessibility issue on a prop says more than "required", so report it once.
  const a11y = accessibility(id, values)
  for (const p of spec.props)
    if (p.required && !(p.name in values) && !a11y.some((i) => i.prop === p.name))
      issues.push({ severity: "error", kind: "missing_required", prop: p.name, message: `${p.name} is required: ${p.description}` })

  issues.push(...a11y)
  return { ok: true, data: { component: id, valid: !issues.some((i) => i.severity === "error"), issues } }
}
