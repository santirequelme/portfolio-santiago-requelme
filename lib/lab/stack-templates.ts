// Card templates, one per stack. Plain strings with a few placeholders:
//   {{color.primary}}    a design token, printed with the stack's generated name
//   {{doc}}              the description from specs/card.spec.json
//   {{variantType}}      the variant values from the spec, in the stack's syntax
//   {{variantDefault}}   the spec's default variant
//   {{styles}}           web: base style rules (see stack-card.ts)
//   {{variantStyles}}    web: one style rule per variant
//   {{surfaceCases}}     native: one branch per variant
//   {{usage}}            a usage line with the variant picked in the playground
// Angular and Vue interpolation keeps its spaces ({{ title }}), so it never
// matches a placeholder.

import type { CardVariant } from "./stack-card"

export const REACT = `import type { CSSProperties } from "react"

// {{doc}}
// API from specs/card.spec.json. Reads the CSS variables from tokens.css
// (generated), loaded once globally.

export type CardVariant = {{variantType}}

type CardProps = {
  image: string
  title: string
  action: string
  onAction?: () => void
  variant?: CardVariant
}

const styles = {
{{styles}}
} satisfies Record<string, CSSProperties>

const variants = {
{{variantStyles}}
} satisfies Record<CardVariant, CSSProperties>

export function Card({ image, title, action, onAction, variant = {{variantDefault}} }: CardProps) {
  return (
    <article style={{ ...styles.card, ...variants[variant] }}>
      <img src={image} alt="" style={styles.media} />
      <h3 style={styles.title}>{title}</h3>
      <button type="button" style={styles.button} onClick={onAction}>
        {action}
      </button>
    </article>
  )
}

// Usage: {{usage}}
`

export const ANGULAR = `import { Component, EventEmitter, Input, Output } from "@angular/core"

// {{doc}}
// API from specs/card.spec.json. Reads the CSS variables from tokens.css
// (generated), loaded once globally through the "styles" entry in angular.json.

export type CardVariant = {{variantType}}

@Component({
  selector: "ui-card",
  standalone: true,
  template: \`
    <article class="card" [attr.data-variant]="variant">
      <img class="media" [src]="image" alt="" />
      <h3 class="title">{{ title }}</h3>
      <button type="button" class="button" (click)="action.emit()">
        {{ actionLabel }}
      </button>
    </article>
  \`,
  styles: \`
{{styles}}

{{variantStyles}}
  \`,
})
export class CardComponent {
  @Input({ required: true }) image!: string
  @Input({ required: true }) title!: string
  @Input({ required: true }) actionLabel!: string
  @Input() variant: CardVariant = {{variantDefault}}
  @Output() action = new EventEmitter<void>()
}

// Usage: {{usage}}
`

export const VUE = `<script setup lang="ts">
// {{doc}}
// API from specs/card.spec.json. Reads the CSS variables from tokens.css
// (generated), imported once in main.ts.
type CardVariant = {{variantType}}

withDefaults(defineProps<{ image: string; title: string; actionLabel: string; variant?: CardVariant }>(), {
  variant: {{variantDefault}},
})
defineEmits<{ action: [] }>()
</script>

<template>
  <article class="card" :data-variant="variant">
    <img class="media" :src="image" alt="" />
    <h3 class="title">{{ title }}</h3>
    <button type="button" class="button" @click="$emit('action')">
      {{ actionLabel }}
    </button>
  </article>
</template>

<style scoped>
{{styles}}

{{variantStyles}}
</style>

<!-- Usage: {{usage}} -->
`

export const SWIFT = `import SwiftUI

// {{doc}}
// API from specs/card.spec.json. Uses the generated Tokens enum (Tokens.swift).

enum CardVariant {
    case {{variantType}}
}

struct CardView: View {
    let image: Image
    let title: String
    let action: String
    var variant: CardVariant = {{variantDefault}}
    var onAction: () -> Void = {}

    var body: some View {
        VStack(alignment: .leading, spacing: {{space.sm}}) {
            image
                .resizable()
                .aspectRatio(16 / 9, contentMode: .fill)
                .clipShape(RoundedRectangle(cornerRadius: {{radius.card}} / 2))
            Text(title)
                .font(.system(size: {{fontSize.title}}, weight: .semibold))
                .foregroundStyle({{color.text}})
            Button(action: onAction) {
                Text(action)
                    .font(.system(size: {{fontSize.body}}, weight: .medium))
                    .foregroundStyle({{color.onPrimary}})
                    .padding(.horizontal, {{space.sm}})
                    .frame(minHeight: 40)
                    .background({{color.primary}}, in: RoundedRectangle(cornerRadius: {{radius.button}}))
            }
            .buttonStyle(.plain)
        }
        .padding({{space.md}})
        .frame(maxWidth: 288, alignment: .leading)
        .background(surface)
    }

    @ViewBuilder private var surface: some View {
        let shape = RoundedRectangle(cornerRadius: {{radius.card}})
        switch variant {
{{surfaceCases}}
        }
    }
}

// Usage: {{usage}}
`

export const KOTLIN = `import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import dev.santirequelme.tokens.Tokens

// {{doc}}
// API from specs/card.spec.json. Uses the generated Tokens object (Tokens.kt).

enum class CardVariant { {{variantType}} }

@Composable
fun CardView(
    image: Painter,
    title: String,
    action: String,
    variant: CardVariant = {{variantDefault}},
    onAction: () -> Unit = {},
) {
    val shape = RoundedCornerShape({{radius.card}})
    val surface = when (variant) {
{{surfaceCases}}
    }
    Column(
        verticalArrangement = Arrangement.spacedBy({{space.sm}}),
        modifier = Modifier
            .widthIn(max = 288.dp)
            .then(surface)
            .padding({{space.md}}),
    ) {
        Image(
            painter = image,
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(16f / 9f)
                .clip(RoundedCornerShape({{radius.card}} / 2)),
        )
        Text(
            text = title,
            color = {{color.text}},
            fontSize = {{fontSize.title}},
            fontWeight = FontWeight.SemiBold,
        )
        Button(
            onClick = onAction,
            shape = RoundedCornerShape({{radius.button}}),
            colors = ButtonDefaults.buttonColors(
                containerColor = {{color.primary}},
                contentColor = {{color.onPrimary}},
            ),
            contentPadding = PaddingValues(horizontal = {{space.sm}}),
        ) {
            Text(action, fontSize = {{fontSize.body}}, fontWeight = FontWeight.Medium)
        }
    }
}

// Usage: {{usage}}
`

// What each variant draws behind the native card. Branches are built from the
// spec's variant list, so a variant missing here fails the type check.
export const SWIFT_SURFACE: Record<CardVariant, string> = {
  elevated: `shape.fill({{color.surface}}).shadow(color: .black.opacity(0.35), radius: 12, y: 8)`,
  outlined: `shape.stroke({{color.border}}, lineWidth: 1)`,
  filled: `// Color.mix(with:by:) needs iOS 18.
            shape.fill({{color.surface}}.mix(with: {{color.primary}}, by: 0.1))`,
}

export const KOTLIN_SURFACE: Record<CardVariant, string> = {
  elevated: `Modifier.shadow(8.dp, shape).background({{color.surface}}, shape)`,
  outlined: `Modifier.border(1.dp, {{color.border}}, shape)`,
  filled: `Modifier.background(lerp({{color.surface}}, {{color.primary}}, 0.1f), shape)`,
}
