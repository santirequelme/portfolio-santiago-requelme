// The Card shown in "One system, every stack": image, title and a button.
// The web preview renders these declarations and the React, Angular and Vue
// snippets print them, so preview and code come from the same definition.
// `{{group.name}}` is a token reference (see tokens/lab.tokens.json).

import { enumProp, SPECS } from "./specs"
import { cssVarName } from "./token-outputs"

export type CardVariant = "elevated" | "outlined" | "filled"
export type CardPart = "card" | "media" | "title" | "button"
export type Declarations = Record<string, string | number>

export const CARD_BASE: Record<CardPart, Declarations> = {
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "{{space.sm}}",
    width: "100%",
    maxWidth: "18rem",
    padding: "{{space.md}}",
    borderRadius: "{{radius.card}}",
    color: "{{color.text}}",
  },
  media: {
    display: "block",
    width: "100%",
    aspectRatio: "16 / 9",
    objectFit: "cover",
    borderRadius: "calc({{radius.card}} / 2)",
  },
  title: {
    margin: 0,
    fontSize: "{{fontSize.title}}",
    fontWeight: 600,
    lineHeight: 1.35,
  },
  button: {
    alignSelf: "flex-start",
    minHeight: "2.5rem",
    padding: "0 {{space.sm}}",
    border: 0,
    borderRadius: "{{radius.button}}",
    background: "{{color.primary}}",
    color: "{{color.onPrimary}}",
    fontSize: "{{fontSize.body}}",
    fontWeight: 500,
    cursor: "pointer",
  },
}

// Same three looks as the playground's Card variants.
export const CARD_VARIANT_STYLES: Record<CardVariant, Declarations> = {
  elevated: { background: "{{color.surface}}", boxShadow: "0 8px 24px -12px rgb(0 0 0 / 0.35)" },
  outlined: { background: "transparent", border: "1px solid {{color.border}}" },
  filled: { background: "color-mix(in srgb, {{color.primary}} 10%, {{color.surface}})" },
}

// Variant names and the default come from specs/card.spec.json; every one of
// them needs a style above, and there must be no extra styles.
const variantSpec = enumProp(SPECS.card, "variant")
const styled = Object.keys(CARD_VARIANT_STYLES)
if (styled.length !== variantSpec.values.length || !variantSpec.values.every((v) => styled.includes(v))) {
  throw new Error(`Card variants in card.spec.json (${variantSpec.values.join(", ")}) and stack-card.ts (${styled.join(", ")}) differ`)
}
export const CARD_VARIANTS = variantSpec.values as CardVariant[]
export const DEFAULT_CARD_VARIANT = variantSpec.default as CardVariant

export function cardDeclarations(variant: CardVariant): Record<CardPart, Declarations> {
  return { ...CARD_BASE, card: { ...CARD_BASE.card, ...CARD_VARIANT_STYLES[variant] } }
}

export const TOKEN_REF = /\{\{([a-zA-Z]+\.[a-zA-Z]+)\}\}/g

/** `{{color.primary}}` → `var(--ds-color-primary)` */
export const toCssValue = (value: string | number) =>
  typeof value === "number" ? value : value.replace(TOKEN_REF, (_, path: string) => `var(${cssVarName(path.split("."))})`)
