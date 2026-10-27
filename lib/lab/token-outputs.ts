// Reproduces, in the browser, the files `pnpm tokens:build` writes with
// Style Dictionary 5.7 (see scripts/build-tokens.mjs), so the lab can show
// them updating live. `pnpm tokens:check` fails if the two ever differ.
// No imports on purpose: the check script loads this file directly in Node.

export type TokenType = "color" | "dimension" | "fontSize"

/** Where a token's value applies. See scripts/tokens.config.mjs. */
export const TOKEN_NS = "dev.santirequelme"
export type TokenScope = "shared" | "platform"
export type NativePlatform = "ios" | "android"

export interface TokenMeta {
  scope: TokenScope
  /** Platform-local only: the value on iOS and Android ($value is the web one). */
  ios?: string
  android?: string
}

export interface TokenLeaf {
  $type: TokenType
  $value: string
  $description?: string
  $extensions?: { [TOKEN_NS]?: TokenMeta }
}

export interface TokenGroup {
  [key: string]: TokenGroup | TokenLeaf
}

export interface FlatToken {
  path: string[]
  type: TokenType
  /** The web value; `platformValue` gives the native ones. */
  value: string
  description?: string
  /** Undefined when the token does not declare one (the audit flags that). */
  scope?: TokenScope
  native?: Partial<Record<NativePlatform, string>>
}

/** The value a platform gets: the native override for platform-local tokens. */
export const platformValue = (token: FlatToken, platform: "web" | NativePlatform) =>
  platform === "web" ? token.value : (token.native?.[platform] ?? token.value)

const isLeaf = (node: TokenGroup | TokenLeaf): node is TokenLeaf => "$value" in node

/** Depth-first, in source order, like Style Dictionary's `allTokens`. */
export function flattenTokens(group: TokenGroup, path: string[] = []): FlatToken[] {
  return Object.entries(group).flatMap(([key, node]) => {
    if (!isLeaf(node)) return flattenTokens(node, [...path, key])
    const meta = node.$extensions?.[TOKEN_NS]
    const native = meta?.scope === "platform" ? { ios: meta.ios, android: meta.android } : undefined
    return [{ path: [...path, key], type: node.$type, value: node.$value, description: node.$description, scope: meta?.scope, native }]
  })
}

// ─── Names (name/kebab and name/camel) ──────────────────────────────────────

const words = (path: string[]) => path.flatMap((part) => part.split(/(?=[A-Z])/)).map((w) => w.toLowerCase())

export const CSS_PREFIX = "ds"

export function cssVarName(path: string[]) {
  return `--${[CSS_PREFIX, ...words(path)].join("-")}`
}

export function camelName(path: string[]) {
  const [first, ...rest] = words(path)
  return first + rest.map((w) => w[0].toUpperCase() + w.slice(1)).join("")
}

// ─── Values ─────────────────────────────────────────────────────────────────

function rgb(hex: string) {
  const h = hex.replace("#", "")
  const full = h.length === 3 ? h.replace(/./g, "$&$&") : h
  const n = Number.parseInt(full, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

const hex6 = (hex: string) => {
  const { r, g, b } = rgb(hex)
  return [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
}

/** "1.25rem" → 20 (Style Dictionary's size transforms read rem × 16). */
const remToPx = (value: string) => Number.parseFloat(value) * 16

function swiftValue(token: FlatToken) {
  if (token.type === "color") {
    const { r, g, b } = rgb(token.value)
    const f = (v: number) => (v / 255).toFixed(3)
    return `Color(red: ${f(r)}, green: ${f(g)}, blue: ${f(b)}, opacity: 1)`
  }
  return `CGFloat(${remToPx(platformValue(token, "ios")).toFixed(2)})`
}

function kotlinValue(token: FlatToken) {
  if (token.type === "color") return `Color(0xff${hex6(token.value)})`
  return `${remToPx(platformValue(token, "android")).toFixed(2)}.${token.type === "fontSize" ? "sp" : "dp"}`
}

const byName = (name: (t: FlatToken) => string) => (a: FlatToken, b: FlatToken) => (name(b) > name(a) ? -1 : 1)

// ─── Files ──────────────────────────────────────────────────────────────────

const HEADER = "Do not edit directly, this file was auto-generated."

export function formatCss(tokens: FlatToken[]) {
  const lines = tokens.map((t) => {
    const value = t.type === "color" ? `#${hex6(t.value)}` : t.value
    return `  ${cssVarName(t.path)}: ${value};${t.description ? ` /** ${t.description} */` : ""}`
  })
  return `/**\n * ${HEADER}\n */\n\n:root {\n${lines.join("\n")}\n}\n`
}

export function formatSwift(tokens: FlatToken[]) {
  const lines = [...tokens]
    .sort(byName((t) => camelName(t.path)))
    .map((t) => `public static let ${camelName(t.path)} = ${swiftValue(t)}${t.description ? ` /** ${t.description} */` : ""}`)
  return `\n//\n// Tokens.swift\n//\n\n// ${HEADER}\n\n\nimport SwiftUI\n\npublic enum Tokens {\n    ${lines.join("\n    ")}\n}`
}

export function formatKotlin(tokens: FlatToken[]) {
  const lines = [...tokens].sort(byName((t) => camelName(t.path))).map((t) => `  val ${camelName(t.path)} = ${kotlinValue(t)}`)
  return (
    `\n\n// ${HEADER}\n\n\n\npackage dev.santirequelme.tokens\n\n` +
    `import androidx.compose.ui.graphics.Color\nimport androidx.compose.ui.unit.*\n\n` +
    `object Tokens {\n${lines.join("\n")}\n}\n`
  )
}

export const TOKEN_FILES = {
  css: { name: "tokens.css", format: formatCss },
  swift: { name: "Tokens.swift", format: formatSwift },
  kotlin: { name: "Tokens.kt", format: formatKotlin },
} as const

export type TokenFileId = keyof typeof TOKEN_FILES
