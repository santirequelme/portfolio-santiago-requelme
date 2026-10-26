"use client"

import { componentCss } from "@/lib/lab/component-css"
import { enumProp, SPECS } from "@/lib/lab/specs"
import { SAMPLE } from "@/lib/lab/playground"

// The same stylesheets the React, Angular and Vue code ships (card.css and
// button.css), so the preview runs exactly that CSS.
const CSS = `${componentCss("card")}\n\n${componentCss("button")}`
const CARD_SIZE = enumProp(SPECS.card, "size").default

// Stands in for the <img> in the examples: there is no image asset on this page.
const IMAGE_PLACEHOLDER =
  "radial-gradient(circle at 70% 30%, color-mix(in srgb, var(--ds-color-primary) 75%, white) 0 12%, transparent 13%), " +
  "linear-gradient(135deg, color-mix(in srgb, var(--ds-color-primary) 35%, var(--ds-color-surface)), var(--ds-color-primary))"

/** The lab's Card example (CardExample in the code panel), rendered with the shipped CSS. */
export function StackCard({ variant }: { variant: string }) {
  return (
    <>
      <style>{CSS}</style>
      <article className="ds-card relative" data-variant={variant} data-size={CARD_SIZE}>
        <div
          aria-hidden="true"
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: "calc(var(--ds-radius-card) / 2)",
            background: IMAGE_PLACEHOLDER,
          }}
        />
        <h3 className="ds-card__title">{SAMPLE.card.title}</h3>
        <button type="button" className="ds-button" data-variant="primary" data-size="md">
          {SAMPLE.card.action}
        </button>
      </article>
    </>
  )
}
