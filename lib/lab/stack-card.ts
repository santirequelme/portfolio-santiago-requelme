// The Card shown in "One system, every stack": image, title and a button.
// The web preview renders these declarations and the React, Angular and Vue
// snippets print them, so preview and code come from the same definition.
// `{{group.name}}` is a token reference (see tokens/lab.tokens.json).

import { cssVarName } from "./token-outputs"

export type CardVariant = "elevated" | "outlined" | "filled"
export type CardPart = "card" | "media" | "title" | "button"
export type Declarations = Record<string, string | number>

const BASE: Record<CardPart, Declarations> = {
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
const VARIANTS: Record<CardVariant, Declarations> = {
  elevated: { background: "{{color.surface}}", boxShadow: "0 8px 24px -12px rgb(0 0 0 / 0.35)" },
  outlined: { background: "transparent", border: "1px solid {{color.border}}" },
  filled: { background: "color-mix(in srgb, {{color.primary}} 10%, {{color.surface}})" },
}

export const CARD_VARIANTS = Object.keys(VARIANTS) as CardVariant[]

export function cardDeclarations(variant: CardVariant): Record<CardPart, Declarations> {
  return { ...BASE, card: { ...BASE.card, ...VARIANTS[variant] } }
}

export const TOKEN_REF = /\{\{([a-zA-Z]+\.[a-zA-Z]+)\}\}/g

/** `{{color.primary}}` → `var(--ds-color-primary)` */
export const toCssValue = (value: string | number) =>
  typeof value === "number" ? value : value.replace(TOKEN_REF, (_, path: string) => `var(${cssVarName(path.split("."))})`)
