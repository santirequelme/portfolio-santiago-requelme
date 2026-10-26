// Web styles for Button, Card and Input, as data. React, Angular and Vue ship
// this CSS (see lib/lab/templates), and the lab's live preview injects it, so
// the preview runs the same styles the code ships.
// `{{group.name}}` is a token reference (tokens/lab.tokens.json). Values with no
// token yet (control heights, the sm and lg text sizes) are written as-is.

import type { ComponentKind } from "./playground"
import { SPECS } from "./specs"
import { cssVarName } from "./token-outputs"

export type Declarations = Record<string, string | number>
interface Rule {
  selector: string
  decls: Declarations
}

export const TOKEN_REF = /\{\{([a-zA-Z]+\.[a-zA-Z]+)\}\}/g

/** `{{color.primary}}` → `var(--ds-color-primary)` */
export const toCssValue = (value: string | number) =>
  typeof value === "number" ? value : value.replace(TOKEN_REF, (_, path: string) => `var(${cssVarName(path.split("."))})`)

const variant = (block: string, v: string, extra = "") => `.${block}[data-variant="${v}"]${extra}`
const size = (block: string, s: string) => `.${block}[data-size="${s}"]`

const RULES: Record<ComponentKind, Rule[]> = {
  button: [
    {
      selector: ".ds-button",
      decls: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        whiteSpace: "nowrap",
        border: 0,
        borderRadius: "{{radius.button}}",
        font: "inherit",
        fontWeight: 500,
        cursor: "pointer",
        transition: "background-color 150ms, border-color 150ms",
      },
    },
    { selector: size("ds-button", "sm"), decls: { height: "2rem", padding: "0 0.75rem", fontSize: "0.8125rem" } },
    { selector: size("ds-button", "md"), decls: { height: "2.5rem", padding: "0 {{space.sm}}", fontSize: "{{fontSize.body}}" } },
    { selector: size("ds-button", "lg"), decls: { height: "3rem", padding: "0 {{space.md}}", fontSize: "1rem" } },
    { selector: variant("ds-button", "primary"), decls: { background: "{{color.primary}}", color: "{{color.onPrimary}}" } },
    { selector: variant("ds-button", "primary", ":hover:enabled"), decls: { background: "color-mix(in srgb, {{color.primary}} 86%, black)" } },
    { selector: variant("ds-button", "secondary"), decls: { border: "1px solid {{color.border}}", background: "{{color.surface}}", color: "{{color.text}}" } },
    { selector: variant("ds-button", "secondary", ":hover:enabled"), decls: { borderColor: "{{color.primary}}" } },
    { selector: variant("ds-button", "ghost"), decls: { background: "transparent", color: "{{color.primary}}" } },
    { selector: variant("ds-button", "ghost", ":hover:enabled"), decls: { background: "color-mix(in srgb, {{color.primary}} 12%, transparent)" } },
    { selector: ".ds-button:focus-visible", decls: { outline: "2px solid {{color.primary}}", outlineOffset: "2px" } },
    { selector: ".ds-button:disabled", decls: { cursor: "not-allowed", opacity: 0.5 } },
  ],
  card: [
    {
      selector: ".ds-card",
      decls: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "{{space.sm}}",
        width: "100%",
        borderRadius: "{{radius.card}}",
        color: "{{color.text}}",
        transition: "box-shadow 200ms, border-color 200ms, background-color 200ms",
      },
    },
    { selector: size("ds-card", "sm"), decls: { maxWidth: "15rem", padding: "{{space.sm}}" } },
    { selector: size("ds-card", "md"), decls: { maxWidth: "18rem", padding: "{{space.md}}" } },
    { selector: size("ds-card", "lg"), decls: { maxWidth: "20rem", padding: "{{space.lg}}" } },
    { selector: variant("ds-card", "elevated"), decls: { background: "{{color.surface}}", boxShadow: "0 8px 24px -12px rgb(0 0 0 / 0.35)" } },
    { selector: variant("ds-card", "elevated", ":hover"), decls: { boxShadow: "0 18px 36px -14px rgb(0 0 0 / 0.5)" } },
    { selector: variant("ds-card", "outlined"), decls: { border: "1px solid {{color.border}}", background: "transparent" } },
    { selector: variant("ds-card", "outlined", ":hover"), decls: { borderColor: "{{color.primary}}" } },
    { selector: variant("ds-card", "filled"), decls: { background: "color-mix(in srgb, {{color.primary}} 10%, {{color.surface}})" } },
    { selector: variant("ds-card", "filled", ":hover"), decls: { background: "color-mix(in srgb, {{color.primary}} 16%, {{color.surface}})" } },
    { selector: '.ds-card[aria-disabled="true"]', decls: { opacity: 0.5, pointerEvents: "none" } },
    {
      selector: ".ds-card__eyebrow",
      decls: { margin: 0, fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "{{color.primary}}" },
    },
    { selector: ".ds-card__title", decls: { margin: 0, fontSize: "{{fontSize.title}}", fontWeight: 600, lineHeight: 1.375 } },
    { selector: ".ds-card__body", decls: { margin: 0, fontSize: "{{fontSize.body}}", lineHeight: 1.625, color: "{{color.muted}}" } },
    {
      selector: ".ds-card__action",
      decls: { borderRadius: "calc({{radius.card}} / 2)", fontSize: "{{fontSize.body}}", fontWeight: 500, color: "{{color.primary}}", textUnderlineOffset: "4px" },
    },
    { selector: ".ds-card__action:hover", decls: { textDecoration: "underline" } },
    { selector: ".ds-card__action:focus-visible", decls: { outline: "2px solid {{color.primary}}", outlineOffset: "2px" } },
  ],
  input: [
    { selector: ".ds-field", decls: { display: "flex", flexDirection: "column", gap: "0.375rem", width: "100%", maxWidth: "18rem" } },
    { selector: ".ds-field__label", decls: { fontSize: "{{fontSize.body}}", fontWeight: 500, color: "{{color.text}}" } },
    { selector: ".ds-field__hint", decls: { margin: 0, fontSize: "0.75rem", color: "{{color.muted}}" } },
    {
      selector: ".ds-input",
      decls: {
        width: "100%",
        border: "1px solid transparent",
        borderRadius: "{{radius.input}}",
        color: "{{color.text}}",
        font: "inherit",
        outline: "none",
        transition: "border-color 150ms, box-shadow 150ms, background-color 150ms",
      },
    },
    { selector: ".ds-input::placeholder", decls: { color: "{{color.muted}}" } },
    { selector: size("ds-input", "sm"), decls: { height: "2rem", padding: "0 0.625rem", fontSize: "0.8125rem" } },
    { selector: size("ds-input", "md"), decls: { height: "2.5rem", padding: "0 0.75rem", fontSize: "{{fontSize.body}}" } },
    { selector: size("ds-input", "lg"), decls: { height: "3rem", padding: "0 {{space.sm}}", fontSize: "1rem" } },
    { selector: variant("ds-input", "outline"), decls: { borderColor: "{{color.border}}", background: "{{color.surface}}" } },
    { selector: variant("ds-input", "outline", ":hover"), decls: { borderColor: "color-mix(in srgb, {{color.text}} 35%, {{color.border}})" } },
    { selector: variant("ds-input", "filled"), decls: { background: "color-mix(in srgb, {{color.text}} 7%, {{color.surface}})" } },
    { selector: variant("ds-input", "filled", ":hover"), decls: { background: "color-mix(in srgb, {{color.text}} 11%, {{color.surface}})" } },
    // After the variants, so focus wins over hover.
    {
      selector: ".ds-input[data-variant]:focus-visible",
      decls: { borderColor: "{{color.primary}}", boxShadow: "0 0 0 4px color-mix(in srgb, {{color.primary}} 25%, transparent)" },
    },
    { selector: ".ds-input:disabled", decls: { cursor: "not-allowed", opacity: 0.5 } },
  ],
}

// Every variant and size in the spec needs a rule, and there must be no extra.
for (const kind of Object.keys(RULES) as ComponentKind[]) {
  const spec = SPECS[kind]
  for (const [attr, expected] of [
    ["variant", spec.variants],
    ["size", spec.sizes],
  ] as const) {
    const found = [...new Set(RULES[kind].flatMap((r) => [...r.selector.matchAll(new RegExp(`data-${attr}="(\\w+)"`, "g"))].map((m) => m[1])))]
    if (found.length !== expected.length || !expected.every((v) => found.includes(v)))
      throw new Error(`${spec.name}: ${attr}s in the spec (${expected.join(", ")}) and component-css.ts (${found.join(", ")}) differ`)
  }
}

/** Every token path the styles reference, per component. */
export const cssTokenPaths = (kind: ComponentKind) =>
  [...new Set(RULES[kind].flatMap((r) => Object.values(r.decls).flatMap((v) => (typeof v === "string" ? [...v.matchAll(TOKEN_REF)].map((m) => m[1]) : []))))]

const kebab = (prop: string) => prop.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

/** The component's stylesheet, with tokens as CSS variables from tokens.css. */
export function componentCss(kind: ComponentKind, indent = "") {
  const header = `${indent}/* ${SPECS[kind].name} styles. Reads the CSS variables from tokens.css (generated). */`
  const rules = RULES[kind].map(({ selector, decls }) => {
    const lines = Object.entries(decls).map(([prop, value]) => `${indent}  ${kebab(prop)}: ${toCssValue(value)};`)
    return `${indent}${selector} {\n${lines.join("\n")}\n${indent}}`
  })
  const motion = `${indent}@media (prefers-reduced-motion: reduce) {\n${indent}  ${RULES[kind].find((r) => "transition" in r.decls)?.selector ?? ""} {\n${indent}    transition: none;\n${indent}  }\n${indent}}`
  return [header, ...rules, motion].join("\n\n")
}
