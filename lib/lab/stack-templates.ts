// Card templates, one per stack. Plain strings with three kinds of placeholder:
//   {{color.primary}}  a design token, printed with the stack's generated name
//   {{styles}}         web only: the card's style rules (see stack-card.ts)
//   {{surface}}        native only: the modifiers for the selected variant
// Angular and Vue interpolation keeps its spaces ({{ title }}), so it never
// matches a placeholder.

import type { CardVariant } from "./stack-card"

export const REACT = `import type { CSSProperties } from "react"

// Reads the CSS variables from tokens.css (generated), loaded once globally.

type CardProps = {
  image: string
  title: string
  action: string
  onAction?: () => void
}

const styles = {
{{styles}}
} satisfies Record<string, CSSProperties>

export function Card({ image, title, action, onAction }: CardProps) {
  return (
    <article style={styles.card}>
      <img src={image} alt="" style={styles.media} />
      <h3 style={styles.title}>{title}</h3>
      <button type="button" style={styles.button} onClick={onAction}>
        {action}
      </button>
    </article>
  )
}
`

export const ANGULAR = `import { Component, EventEmitter, Input, Output } from "@angular/core"

// Reads the CSS variables from tokens.css (generated), loaded once globally
// through the "styles" entry in angular.json.

@Component({
  selector: "ui-card",
  standalone: true,
  template: \`
    <article class="card">
      <img class="media" [src]="image" alt="" />
      <h3 class="title">{{ title }}</h3>
      <button type="button" class="button" (click)="action.emit()">
        {{ actionLabel }}
      </button>
    </article>
  \`,
  styles: \`
{{styles}}
  \`,
})
export class CardComponent {
  @Input({ required: true }) image!: string
  @Input({ required: true }) title!: string
  @Input({ required: true }) actionLabel!: string
  @Output() action = new EventEmitter<void>()
}
`

export const VUE = `<script setup lang="ts">
// Reads the CSS variables from tokens.css (generated), imported once in main.ts.
defineProps<{ image: string; title: string; actionLabel: string }>()
defineEmits<{ action: [] }>()
</script>

<template>
  <article class="card">
    <img class="media" :src="image" alt="" />
    <h3 class="title">{{ title }}</h3>
    <button type="button" class="button" @click="$emit('action')">
      {{ actionLabel }}
    </button>
  </article>
</template>

<style scoped>
{{styles}}
</style>
`

export const SWIFT = `import SwiftUI

// Uses the generated Tokens enum (Tokens.swift).

struct CardView: View {
    let image: Image
    let title: String
    let action: String
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
{{surface}}
    }
}
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

@Composable
fun CardView(
    image: Painter,
    title: String,
    action: String,
    onAction: () -> Unit = {},
) {
    val shape = RoundedCornerShape({{radius.card}})
    Column(
        verticalArrangement = Arrangement.spacedBy({{space.sm}}),
        modifier = Modifier
            .widthIn(max = 288.dp)
{{surface}}
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
`

// Variant modifiers for the native templates, already indented for {{surface}}.
export const SWIFT_SURFACE: Record<CardVariant, string> = {
  elevated: `        .background({{color.surface}}, in: RoundedRectangle(cornerRadius: {{radius.card}}))
        .shadow(color: .black.opacity(0.35), radius: 12, y: 8)`,
  outlined: `        .overlay(RoundedRectangle(cornerRadius: {{radius.card}}).stroke({{color.border}}, lineWidth: 1))`,
  filled: `        // Color.mix(with:by:) needs iOS 18.
        .background({{color.surface}}.mix(with: {{color.primary}}, by: 0.1), in: RoundedRectangle(cornerRadius: {{radius.card}}))`,
}

export const KOTLIN_SURFACE: Record<CardVariant, string> = {
  elevated: `            .shadow(8.dp, shape)
            .background({{color.surface}}, shape)`,
  outlined: `            .border(1.dp, {{color.border}}, shape)`,
  filled: `            .background(lerp({{color.surface}}, {{color.primary}}, 0.1f), shape)`,
}
