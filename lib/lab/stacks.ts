// "One system, every stack": for the lab's Card, returns the code each stack
// would ship, using the generated token names, plus the generated token file
// that stack reads. Everything derives from the same token set.

import { cardDeclarations, toCssValue, TOKEN_REF, type CardVariant, type Declarations } from "./stack-card"
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

/** React: the body of the `styles` object. */
function reactStyles(parts: Record<string, Declarations>) {
  return Object.entries(parts)
    .map(([part, decls]) => {
      const lines = Object.entries(decls).map(([prop, value]) => `    ${prop}: ${JSON.stringify(checkRefs(value))},`)
      return `  ${part}: {\n${lines.join("\n")}\n  },`
    })
    .join("\n")
}

/** Angular and Vue: plain CSS rules, one per part. */
function cssRules(parts: Record<string, Declarations>, indent: string) {
  return Object.entries(parts)
    .map(([part, decls]) => {
      const lines = Object.entries(decls).map(([prop, value]) => `${indent}  ${kebab(prop)}: ${checkRefs(value)};`)
      return `${indent}.${part} {\n${lines.join("\n")}\n${indent}}`
    })
    .join("\n\n")
}

function componentCode(stack: StackDef, variant: CardVariant) {
  const parts = cardDeclarations(variant)
  switch (stack.id) {
    case "react":
      return stack.template.replace("{{styles}}", reactStyles(parts))
    case "angular":
      return stack.template.replace("{{styles}}", cssRules(parts, "    "))
    case "vue":
      return stack.template.replace("{{styles}}", cssRules(parts, ""))
    case "swift":
      return nativeRefs(stack.template.replace("{{surface}}", SWIFT_SURFACE[variant]))
    case "kotlin":
      return nativeRefs(stack.template.replace("{{surface}}", KOTLIN_SURFACE[variant]))
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
