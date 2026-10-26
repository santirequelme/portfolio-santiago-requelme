// "One system, every stack": for the lab's Card, returns the code each stack
// would ship, using the generated token names, plus the generated token file
// that stack reads. Tokens come from tokens/lab.tokens.json; the Card's
// description, variant values and default come from specs/card.spec.json.

import { SAMPLE } from "./playground"
import { SPECS } from "./specs"
import {
  CARD_BASE,
  CARD_VARIANT_STYLES,
  CARD_VARIANTS,
  DEFAULT_CARD_VARIANT,
  toCssValue,
  TOKEN_REF,
  type CardVariant,
  type Declarations,
} from "./stack-card"
import { ANGULAR, KOTLIN, KOTLIN_SURFACE, REACT, SWIFT, SWIFT_SURFACE, VUE } from "./stack-templates"
import { camelName, flatTokens, TOKEN_PATHS, type LabTokens } from "./stack-tokens"
import { TOKEN_FILES, type TokenFileId } from "./token-outputs"

export type StackId = "react" | "angular" | "vue" | "swift" | "kotlin"

export interface StackFile {
  name: string
  code: string
  /** 1-based lines that use or define the primary colour. */
  primaryLines: Set<number>
}

interface StackDef {
  id: StackId
  label: string
  file: string
  tokenFile: TokenFileId
  /** True when the live preview runs this exact code. */
  runs: boolean
  template: string
}

export const STACKS: readonly StackDef[] = [
  { id: "react", label: "React", file: "Card.tsx", tokenFile: "css", runs: true, template: REACT },
  { id: "angular", label: "Angular", file: "card.component.ts", tokenFile: "css", runs: false, template: ANGULAR },
  { id: "vue", label: "Vue", file: "Card.vue", tokenFile: "css", runs: false, template: VUE },
  { id: "swift", label: "Swift", file: "CardView.swift", tokenFile: "swift", runs: false, template: SWIFT },
  { id: "kotlin", label: "Kotlin", file: "CardView.kt", tokenFile: "kotlin", runs: false, template: KOTLIN },
]

// ─── Placeholder filling ────────────────────────────────────────────────────

/** `{{color.primary}}` → `Tokens.colorPrimary`, failing loudly on unknown tokens. */
function nativeRefs(code: string) {
  return code.replace(TOKEN_REF, (_, path: string) => {
    if (!TOKEN_PATHS.has(path)) throw new Error(`Unknown token "${path}" in a stack template`)
    return `Tokens.${camelName(path.split("."))}`
  })
}

const kebab = (prop: string) => prop.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

function checkRefs(value: string | number) {
  if (typeof value === "string") {
    for (const [, path] of value.matchAll(TOKEN_REF)) {
      if (!TOKEN_PATHS.has(path)) throw new Error(`Unknown token "${path}" in the card definition`)
    }
  }
  return toCssValue(value)
}

/** React: the body of an object of style objects, one per key. */
function reactObject(groups: Record<string, Declarations>) {
  return Object.entries(groups)
    .map(([key, decls]) => {
      const lines = Object.entries(decls).map(([prop, value]) => `    ${prop}: ${JSON.stringify(checkRefs(value))},`)
      return `  ${key}: {\n${lines.join("\n")}\n  },`
    })
    .join("\n")
}

/** Angular and Vue: plain CSS rules, one per key. */
function cssRules(groups: Record<string, Declarations>, indent: string, selector: (key: string) => string) {
  return Object.entries(groups)
    .map(([key, decls]) => {
      const lines = Object.entries(decls).map(([prop, value]) => `${indent}  ${kebab(prop)}: ${checkRefs(value)};`)
      return `${indent}${selector(key)} {\n${lines.join("\n")}\n${indent}}`
    })
    .join("\n\n")
}

const part = (key: string) => `.${key}`
const variantRule = (key: string) => `.card[data-variant="${key}"]`
const pascal = (s: string) => s[0].toUpperCase() + s.slice(1)
const { title, action } = SAMPLE.card

/** Replaces every `{{name}}` placeholder, failing on any left unfilled. */
function fill(template: string, values: Record<string, string>) {
  let code = template
  for (const [key, value] of Object.entries(values)) code = code.replaceAll(`{{${key}}}`, value)
  const left = /\{\{\w+\}\}/.exec(code)
  if (left) throw new Error(`Placeholder ${left[0]} is not filled`)
  return code
}

function componentCode(stack: StackDef, variant: CardVariant) {
  const doc = `${SPECS.card.name}: ${SPECS.card.description}`
  const quoted = (v: string) => JSON.stringify(v)
  switch (stack.id) {
    case "react":
      return fill(stack.template, {
        doc,
        variantType: CARD_VARIANTS.map(quoted).join(" | "),
        variantDefault: quoted(DEFAULT_CARD_VARIANT),
        styles: reactObject(CARD_BASE),
        variantStyles: reactObject(CARD_VARIANT_STYLES),
        usage: `<Card variant="${variant}" image="/cover.jpg" title="${title}" action="${action}" />`,
      })
    case "angular":
    case "vue": {
      const indent = stack.id === "angular" ? "    " : ""
      return fill(stack.template, {
        doc,
        variantType: CARD_VARIANTS.map(quoted).join(" | "),
        variantDefault: quoted(DEFAULT_CARD_VARIANT),
        styles: cssRules(CARD_BASE, indent, part),
        variantStyles: cssRules(CARD_VARIANT_STYLES, indent, variantRule),
        usage:
          stack.id === "angular"
            ? `<ui-card variant="${variant}" image="/cover.jpg" title="${title}" actionLabel="${action}" (action)="open()" />`
            : `<Card variant="${variant}" image="/cover.jpg" title="${title}" action-label="${action}" @action="open" />`,
      })
    }
    case "swift":
      return nativeRefs(
        fill(stack.template, {
          doc,
          variantType: CARD_VARIANTS.join(", "),
          variantDefault: `.${DEFAULT_CARD_VARIANT}`,
          surfaceCases: CARD_VARIANTS.map((v) => `        case .${v}:\n            ${SWIFT_SURFACE[v]}`).join("\n"),
          usage: `CardView(image: Image("cover"), title: "${title}", action: "${action}", variant: .${variant})`,
        }),
      )
    case "kotlin":
      return nativeRefs(
        fill(stack.template, {
          doc,
          variantType: CARD_VARIANTS.map(pascal).join(", "),
          variantDefault: `CardVariant.${pascal(DEFAULT_CARD_VARIANT)}`,
          surfaceCases: CARD_VARIANTS.map((v) => `        CardVariant.${pascal(v)} -> ${KOTLIN_SURFACE[v]}`).join("\n"),
          usage: `CardView(image = painterResource(R.drawable.cover), title = "${title}", action = "${action}", variant = CardVariant.${pascal(variant)})`,
        }),
      )
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

const PRIMARY = /--ds-color-primary\b|Tokens\.colorPrimary\b|\bcolorPrimary =/

function linesMatching(code: string, re: RegExp) {
  const set = new Set<number>()
  code.split("\n").forEach((line, i) => re.test(line) && set.add(i + 1))
  return set
}

/** The generated token file, exactly as `pnpm tokens:build` writes it, minus surrounding blank lines. */
export function tokenFile(id: TokenFileId, tokens: LabTokens) {
  const { name, format } = TOKEN_FILES[id]
  return { name, code: format(flatTokens(tokens)).trim() }
}

/** Component file + the token file it reads, for one stack. */
export function stackFiles(id: StackId, variant: CardVariant, tokens: LabTokens): StackFile[] {
  const stack = STACKS.find((s) => s.id === id) ?? STACKS[0]
  const component = componentCode(stack, variant)
  const generated = tokenFile(stack.tokenFile, tokens)
  return [
    { name: stack.file, code: component, primaryLines: linesMatching(component, PRIMARY) },
    { ...generated, primaryLines: linesMatching(generated.code, PRIMARY) },
  ]
}

/** The line that defines color.primary in each generated file. */
export function primaryDefinitions(tokens: LabTokens) {
  return (Object.keys(TOKEN_FILES) as TokenFileId[]).map((id) => {
    const { name, code } = tokenFile(id, tokens)
    const definition = code.split("\n").find((l) => PRIMARY.test(l)) ?? ""
    const line = definition.replace(/\s*\/\*\*.*\*\/\s*$/, "").trim()
    const stacks = STACKS.filter((s) => s.tokenFile === id).map((s) => s.label)
    return { id, name, line, stacks }
  })
}
