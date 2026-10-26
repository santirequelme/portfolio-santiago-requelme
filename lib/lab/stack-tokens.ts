// The lab's design tokens: tokens/lab.tokens.json is the source, and the
// playground's accent and radius controls edit a copy of it live.

import source from "@/tokens/lab.tokens.json"
import { DEFAULT_CONFIG, resolveTokens, type PlaygroundConfig } from "./playground"
import { camelName, cssVarName, flattenTokens, type FlatToken, type TokenGroup, type TokenLeaf } from "./token-outputs"

type Group<K extends string> = Record<K, TokenLeaf>

export interface LabTokens extends TokenGroup {
  color: Group<"surface" | "text" | "muted" | "primary" | "onPrimary" | "border">
  radius: Group<"card" | "button" | "input">
  space: Group<"sm" | "md" | "lg">
  fontSize: Group<"title" | "body">
}

export const SOURCE_TOKENS = source as LabTokens

/** Source tokens with the playground's accent (primary) and radius applied. */
export function tokensFor({ accent, radius: px }: Pick<PlaygroundConfig, "accent" | "radius">): LabTokens {
  const t: LabTokens = structuredClone(SOURCE_TOKENS)
  // Same contrast pick the playground uses for text on the accent.
  const onAccent = resolveTokens({ ...DEFAULT_CONFIG, accent })["--ui-on-accent"]
  t.color.primary.$value = accent.toUpperCase()
  t.color.onPrimary.$value = onAccent
  const radius = `${px / 16}rem`
  t.radius.card.$value = radius
  t.radius.button.$value = radius
  t.radius.input.$value = radius
  return t
}

export const flatTokens = (tokens: LabTokens): FlatToken[] => flattenTokens(tokens)

/** CSS custom properties for a token set, for the live web preview. */
export function cssVariables(tokens: LabTokens): Record<string, string> {
  return Object.fromEntries(flatTokens(tokens).map((t) => [cssVarName(t.path), t.value]))
}

/** All token paths, e.g. "color.primary", used to validate template placeholders. */
export const TOKEN_PATHS = new Set(flatTokens(SOURCE_TOKENS).map((t) => t.path.join(".")))

export { camelName, cssVarName }
