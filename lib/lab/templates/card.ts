// Card in five stacks. API from specs/card.spec.json.

import { entry, kotlinNumber, pascal, swiftNumber, type ComponentTemplates } from "./shared"

const REACT = `import type { HTMLAttributes } from "react"
import "./card.css"

// {{doc}}
// API from specs/card.spec.json. Styles: card.css, which reads tokens.css (generated).

export type CardVariant = {{variantType}}
export type CardSize = {{sizeType}}

export type CardProps = HTMLAttributes<HTMLElement> & {
  variant?: CardVariant
  size?: CardSize
  /** Dims the card and blocks pointer events. Take inner actions out of the tab order too. */
  disabled?: boolean
}

/** Class names for the content: compose the card from these. */
export const cardParts = {
  eyebrow: "ds-card__eyebrow",
  title: "ds-card__title",
  body: "ds-card__body",
  action: "ds-card__action",
} as const

export function Card({ variant = "{{variantDefault}}", size = "{{sizeDefault}}", disabled, className, ...props }: CardProps) {
  return (
    <article
      aria-disabled={disabled || undefined}
      data-variant={variant}
      data-size={size}
      className={["ds-card", className].filter(Boolean).join(" ")}
      {...props}
    />
  )
}
`

const ANGULAR = `import { Component, Input, ViewEncapsulation, booleanAttribute } from "@angular/core"

// {{doc}}
// API from specs/card.spec.json. Styles: card.css, which reads tokens.css
// (generated, loaded once globally).

export type CardVariant = {{variantType}}
export type CardSize = {{sizeType}}

// Content goes inside, styled with the ds-card__eyebrow, __title, __body and
// __action classes. Encapsulation is off so those classes reach it.
@Component({
  selector: "ds-card",
  standalone: true,
  template: \`
    <article
      class="ds-card"
      [attr.data-variant]="variant"
      [attr.data-size]="size"
      [attr.aria-disabled]="disabled || null"
    >
      <ng-content />
    </article>
  \`,
  styleUrl: "./card.css",
  encapsulation: ViewEncapsulation.None,
})
export class CardComponent {
  @Input() variant: CardVariant = "{{variantDefault}}"
  @Input() size: CardSize = "{{sizeDefault}}"
  @Input({ transform: booleanAttribute }) disabled = false
}
`

const VUE = `<script setup lang="ts">
// {{doc}}
// API from specs/card.spec.json. Reads the CSS variables from tokens.css
// (generated), imported once in main.ts.
type CardVariant = {{variantType}}
type CardSize = {{sizeType}}

withDefaults(defineProps<{ variant?: CardVariant; size?: CardSize; disabled?: boolean }>(), {
  variant: "{{variantDefault}}",
  size: "{{sizeDefault}}",
  disabled: false,
})
</script>

<template>
  <article class="ds-card" :data-variant="variant" :data-size="size" :aria-disabled="disabled || undefined">
    <slot />
  </article>
</template>

<!-- Not scoped, so the ds-card__ classes reach the slotted content. -->
<style>
{{css}}
</style>
`

const SWIFT = `import SwiftUI

// {{doc}}
// API from specs/card.spec.json. Uses the generated Tokens enum (Tokens.swift).
// Maximum widths have no token yet.

enum DSCardVariant {
    case {{variantType}}
}

enum DSCardSize {
    case {{sizeType}}
}

struct DSCard<Content: View>: View {
    var variant: DSCardVariant = .{{variantDefault}}
    var size: DSCardSize = .{{sizeDefault}}
    var isDisabled = false
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: {{space.sm}}) {
            content
        }
        .padding(metrics.padding)
        .frame(maxWidth: metrics.maxWidth, alignment: .leading)
        .foregroundStyle({{color.text}})
        .background(surface)
        .opacity(isDisabled ? 0.5 : 1)
        .allowsHitTesting(!isDisabled)
    }

    private var metrics: (padding: CGFloat, maxWidth: CGFloat) {
        switch size {
{{sizeCases}}
        }
    }

    @ViewBuilder private var surface: some View {
        let shape = RoundedRectangle(cornerRadius: {{radius.card}})
        switch variant {
{{surfaceCases}}
        }
    }
}

// Content styles, matching cardParts on the web.
extension View {
    func cardEyebrow() -> some View {
        font(.system(size: 11, weight: .medium)).textCase(.uppercase).foregroundStyle({{color.muted}})
    }

    func cardTitle() -> some View {
        font(.system(size: {{fontSize.title}}, weight: .semibold))
    }

    func cardBody() -> some View {
        font(.system(size: {{fontSize.body}})).foregroundStyle({{color.muted}})
    }
}
`

const KOTLIN = `import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import dev.santirequelme.tokens.Tokens

// {{doc}}
// API from specs/card.spec.json. Uses the generated Tokens object (Tokens.kt).
// Maximum widths have no token yet.

enum class DSCardVariant { {{variantType}} }
enum class DSCardSize { {{sizeType}} }

@Composable
fun DSCard(
    modifier: Modifier = Modifier,
    variant: DSCardVariant = DSCardVariant.{{variantDefault}},
    size: DSCardSize = DSCardSize.{{sizeDefault}},
    disabled: Boolean = false,
    content: @Composable ColumnScope.() -> Unit,
) {
    val shape = RoundedCornerShape({{radius.card}})
    val surface = when (variant) {
{{surfaceCases}}
    }
    val (padding, maxWidth) = when (size) {
{{sizeCases}}
    }
    Column(
        verticalArrangement = Arrangement.spacedBy({{space.sm}}),
        modifier = modifier
            .widthIn(max = maxWidth)
            .then(surface)
            .alpha(if (disabled) 0.5f else 1f)
            .padding(padding),
        content = content,
    )
}

// Content styles, matching cardParts on the web. Uppercase the eyebrow text itself.
object CardParts {
    val eyebrow = TextStyle(color = {{color.muted}}, fontSize = 11.sp, fontWeight = FontWeight.Medium, letterSpacing = 1.32.sp)
    val title = TextStyle(color = {{color.text}}, fontSize = {{fontSize.title}}, fontWeight = FontWeight.SemiBold)
    val body = TextStyle(color = {{color.muted}}, fontSize = {{fontSize.body}})
}
`

// Per size: padding, maximum width.
const SIZES: Record<string, [string, number]> = {
  sm: ["{{space.sm}}", 240],
  md: ["{{space.md}}", 288],
  lg: ["{{space.lg}}", 320],
}

const SWIFT_SURFACE: Record<string, string> = {
  elevated: `shape.fill({{color.surface}}).shadow(color: .black.opacity(0.35), radius: 12, y: 8)`,
  outlined: `shape.stroke({{color.border}}, lineWidth: 1)`,
  filled: `// Color.mix(with:by:) needs iOS 18.
            shape.fill({{color.surface}}.mix(with: {{color.primary}}, by: 0.1))`,
}

const KOTLIN_SURFACE: Record<string, string> = {
  elevated: `Modifier.shadow(8.dp, shape).background({{color.surface}}, shape)`,
  outlined: `Modifier.border(1.dp, {{color.border}}, shape)`,
  filled: `Modifier.background(lerp({{color.surface}}, {{color.primary}}, 0.1f), shape)`,
}

export const CARD: ComponentTemplates = {
  files: {
    react: [
      { name: "Card.tsx", language: "tsx", code: REACT },
      { name: "card.css", language: "css", code: "{{css}}\n" },
    ],
    angular: [
      { name: "card.component.ts", language: "ts", code: ANGULAR },
      { name: "card.css", language: "css", code: "{{css}}\n" },
    ],
    vue: [{ name: "Card.vue", language: "vue", code: VUE }],
    swift: [{ name: "DSCard.swift", language: "swift", code: SWIFT }],
    kotlin: [{ name: "DSCard.kt", language: "kotlin", code: KOTLIN }],
  },
  swift: ({ variants, sizes }) => ({
    surfaceCases: variants.map((v) => `        case .${v}:\n            ${entry(SWIFT_SURFACE, v, "Card surface")}`).join("\n"),
    sizeCases: sizes.map((s) => `        case .${s}: return (${entry(SIZES, s, "Card size").map(swiftNumber).join(", ")})`).join("\n"),
  }),
  kotlin: ({ variants, sizes }) => ({
    surfaceCases: variants.map((v) => `        DSCardVariant.${pascal(v)} -> ${entry(KOTLIN_SURFACE, v, "Card surface")}`).join("\n"),
    sizeCases: sizes
      .map((s) => {
        const [padding, maxWidth] = entry(SIZES, s, "Card size")
        return `        DSCardSize.${pascal(s)} -> Pair(${padding}, ${kotlinNumber(maxWidth, "dp")})`
      })
      .join("\n"),
  }),
}
