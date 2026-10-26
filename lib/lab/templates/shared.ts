// Shared types and helpers for the component templates in this folder.
//
// Templates are plain strings with placeholders:
//   {{color.primary}}   a design token, printed with the stack's generated name
//   {{doc}}             "<Name>: <description>" from the component's spec
//   {{variantType}}     the spec's variants, in the stack's syntax
//   {{variantDefault}}  the spec's default variant (likewise sizeType, sizeDefault)
//   {{css}}             web: the component's stylesheet (lib/lab/component-css.ts)
//   {{...Cases}}        native: one switch branch per variant or size
// Angular and Vue interpolation keeps its spaces ({{ label }}), so it never
// matches a placeholder.

export type StackId = "react" | "angular" | "vue" | "swift" | "kotlin"
export type Language = "tsx" | "ts" | "css" | "vue" | "swift" | "kotlin"

export interface TemplateFile {
  name: string
  language: Language
  code: string
}

/** What a native template needs to build its switch branches. */
export interface NativeContext {
  variants: string[]
  sizes: string[]
}

export interface ComponentTemplates {
  files: Record<StackId, TemplateFile[]>
  /** Extra placeholder values for Swift and Kotlin, built from the spec's variants and sizes. */
  swift: (ctx: NativeContext) => Record<string, string>
  kotlin: (ctx: NativeContext) => Record<string, string>
}

export const pascal = (s: string) => s[0].toUpperCase() + s.slice(1)

/** Looks a spec value up in a template table, failing loudly when it is missing. */
export function entry<T>(table: Record<string, T>, key: string, what: string): T {
  if (!(key in table)) throw new Error(`No ${what} for "${key}" in the template; add it or update the spec`)
  return table[key]
}

/** A number in Swift (points) or Kotlin (dp or sp); token references pass through. */
export const swiftNumber = (v: string | number) => `${v}`
export const kotlinNumber = (v: string | number, unit: "dp" | "sp") => (typeof v === "number" ? `${v}.${unit}` : v)
