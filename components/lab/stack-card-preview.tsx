"use client"

import type { CSSProperties } from "react"
import { SAMPLE } from "@/lib/lab/playground"
import { cardDeclarations, toCssValue, type CardVariant, type Declarations } from "@/lib/lab/stack-card"

const asStyle = (decls: Declarations) =>
  Object.fromEntries(Object.entries(decls).map(([prop, value]) => [prop, toCssValue(value)])) as CSSProperties

// Stands in for the <img> in the snippets: there is no image asset on this page.
const IMAGE_PLACEHOLDER =
  "radial-gradient(circle at 70% 30%, color-mix(in srgb, var(--ds-color-primary) 75%, white) 0 12%, transparent 13%), " +
  "linear-gradient(135deg, color-mix(in srgb, var(--ds-color-primary) 35%, var(--ds-color-surface)), var(--ds-color-primary))"

/** The web Card, rendered from the same declarations the React snippet prints. */
export function StackCard({ variant }: { variant: CardVariant }) {
  const s = cardDeclarations(variant)
  return (
    <article className="relative" style={asStyle(s.card)}>
      <div aria-hidden="true" style={{ ...asStyle(s.media), background: IMAGE_PLACEHOLDER }} />
      <h3 style={asStyle(s.title)}>{SAMPLE.card.title}</h3>
      <button type="button" style={asStyle(s.button)}>
        {SAMPLE.card.action}
      </button>
    </article>
  )
}
