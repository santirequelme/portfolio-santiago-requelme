// Generates the code each stack ships for Button, Card and Input, plus the
// generated token files. Sources: tokens/lab.tokens.json (tokens), the specs
// (description, variants, sizes, defaults) and lib/lab/templates (code).
// Used by the lab's stack switcher and by the public registry (lib/registry).

import { componentCss, cssTokenPaths, TOKEN_REF } from "./component-css"
import { SAMPLE, type ComponentKind } from "./playground"
import { enumProp, SPECS } from "./specs"
import { camelName, cssVarName, flatTokens, TOKEN_PATHS, type LabTokens } from "./stack-tokens"
import { TOKEN_FILES, type TokenFileId } from "./token-outputs"
import { BUTTON } from "./templates/button"
import { CARD } from "./templates/card"
import { CARD_EXAMPLE } from "./templates/card-example"
import { INPUT } from "./templates/input"
import { pascal, type ComponentTemplates, type Language, type StackId } from "./templates/shared"

export type { Language, StackId }

export interface GeneratedFile {
  name: string
  language: Language
  code: string
}

export interface StackFile extends GeneratedFile {
  /** 1-based lines that use or define the primary colour. */
  primaryLines: Set<number>
}

interface StackDef {
  id: StackId
  label: string
  tokenFile: TokenFileId
  /** True when the lab's live preview runs this stack's code. */
  runs: boolean
}

export const STACKS: readonly StackDef[] = [
  { id: "react", label: "React", tokenFile: "css", runs: true },
  { id: "angular", label: "Angular", tokenFile: "css", runs: false },
  { id: "vue", label: "Vue", tokenFile: "css", runs: false },
  { id: "swift", label: "Swift", tokenFile: "swift", runs: false },
  { id: "kotlin", label: "Kotlin", tokenFile: "kotlin", runs: false },
]

const TEMPLATES: Record<ComponentKind, ComponentTemplates> = { button: BUTTON, card: CARD, input: INPUT }

const cardVariant = enumProp(SPECS.card, "variant")
export const CARD_VARIANTS = cardVariant.values
export const DEFAULT_CARD_VARIANT = cardVariant.default

// ─── Placeholders ───────────────────────────────────────────────────────────

const isNative = (stack: StackId) => stack === "swift" || stack === "kotlin"

/** A spec value as the stack writes it: Kotlin enums are PascalCase. */
const asValue = (stack: StackId, value: string) => (stack === "kotlin" ? pascal(value) : value)

/** A spec value list as a union type (web) or enum cases (native). */
function asType(stack: StackId, values: string[]) {
  if (stack === "swift") return values.join(", ")
  if (stack === "kotlin") return values.map(pascal).join(", ")
  return values.map((v) => JSON.stringify(v)).join(" | ")
}

/** `{{color.primary}}` → `var(--ds-color-primary)` on the web, `Tokens.colorPrimary` natively. */
function resolveTokens(code: string, stack: StackId) {
  return code.replace(TOKEN_REF, (_, path: string) => {
    if (!TOKEN_PATHS.has(path)) throw new Error(`Unknown token "${path}" in a template`)
    const parts = path.split(".")
    return isNative(stack) ? `Tokens.${camelName(parts)}` : `var(${cssVarName(parts)})`
  })
}

/** Replaces every `{{name}}` placeholder, failing on any left unfilled. */
function fill(template: string, values: Record<string, string>, stack: StackId) {
  let code = template
  for (const [key, value] of Object.entries(values)) code = code.replaceAll(`{{${key}}}`, value)
  const left = /\{\{\w+\}\}/.exec(code)
  if (left) throw new Error(`Placeholder ${left[0]} is not filled`)
  return resolveTokens(code, stack)
}

function placeholderValues(kind: ComponentKind, stack: StackId) {
  const spec = SPECS[kind]
  const variant = enumProp(spec, "variant")
  const size = enumProp(spec, "size")
  const ctx = { variants: variant.values, sizes: size.values }
  const native = stack === "swift" ? TEMPLATES[kind].swift(ctx) : stack === "kotlin" ? TEMPLATES[kind].kotlin(ctx) : {}
  return {
    doc: `${spec.name}: ${spec.description}`,
    variantType: asType(stack, variant.values),
    variantDefault: asValue(stack, variant.default),
    sizeType: asType(stack, size.values),
    sizeDefault: asValue(stack, size.default),
    css: componentCss(kind),
    ...native,
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

/** The component's files for one stack. */
export function componentFiles(kind: ComponentKind, stack: StackId): GeneratedFile[] {
  const values = placeholderValues(kind, stack)
  return TEMPLATES[kind].files[stack].map((f) => ({ ...f, code: fill(f.code, values, stack) }))
}

/** The lab's Card composition (image, title, primary Button) in one stack. */
export function cardExampleFile(
  stack: StackId,
  variant: string = DEFAULT_CARD_VARIANT,
  text: { title: string; action: string } = SAMPLE.card,
): GeneratedFile {
  const t = CARD_EXAMPLE[stack]
  const values = {
    variant: asValue(stack, variant),
    size: asValue(stack, enumProp(SPECS.card, "size").default),
    title: text.title,
    action: text.action,
  }
  return { ...t, code: fill(t.code, values, stack) }
}

/** Token paths a component's code reads, across every stack. */
export function codeTokenPaths(kind: ComponentKind): string[] {
  const paths = new Set(cssTokenPaths(kind))
  for (const stack of STACKS.map((s) => s.id)) {
    const values = placeholderValues(kind, stack)
    const raw = [...TEMPLATES[kind].files[stack].map((f) => f.code), ...Object.values(values)].join("\n")
    for (const [, path] of raw.matchAll(TOKEN_REF)) paths.add(path)
  }
  return [...paths].sort()
}

const PRIMARY = /--ds-color-primary\b|Tokens\.colorPrimary\b|\bcolorPrimary =/

function linesMatching(code: string, re: RegExp) {
  const set = new Set<number>()
  code.split("\n").forEach((line, i) => re.test(line) && set.add(i + 1))
  return set
}

const TOKEN_FILE_LANGUAGE: Record<TokenFileId, Language> = { css: "css", swift: "swift", kotlin: "kotlin" }

/** The generated token file, exactly as `pnpm tokens:build` writes it, minus surrounding blank lines. */
export function tokenFile(id: TokenFileId, tokens: LabTokens): GeneratedFile {
  const { name, format } = TOKEN_FILES[id]
  return { name, language: TOKEN_FILE_LANGUAGE[id], code: format(flatTokens(tokens)).trim() }
}

/** For the stack switcher: the Card example, the Card's files and the token file. */
export function stackFiles(id: StackId, variant: string, tokens: LabTokens): StackFile[] {
  const stack = STACKS.find((s) => s.id === id) ?? STACKS[0]
  const files = [cardExampleFile(stack.id, variant), ...componentFiles("card", stack.id), tokenFile(stack.tokenFile, tokens)]
  return files.map((f) => ({ ...f, primaryLines: linesMatching(f.code, PRIMARY) }))
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
