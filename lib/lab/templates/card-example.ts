// The Card composition shown in the lab ("One system, every stack"): a Card
// with an image, a title and a primary Button as its action. Placeholders:
// {{variant}} and {{size}} (Card), {{title}} and {{action}} (sample text).

import type { StackId, TemplateFile } from "./shared"

export const CARD_EXAMPLE: Record<StackId, TemplateFile> = {
  react: {
    name: "CardExample.tsx",
    language: "tsx",
    code: `import type { CSSProperties } from "react"
import { Button } from "./Button"
import { Card, cardParts } from "./Card"

// The card in the lab: an image, a title and a primary Button as its action.

const media: CSSProperties = {
  width: "100%",
  aspectRatio: "16 / 9",
  objectFit: "cover",
  borderRadius: "calc(var(--ds-radius-card) / 2)",
}

export function CardExample() {
  return (
    <Card variant="{{variant}}" size="{{size}}">
      <img src="/cover.jpg" alt="" style={media} />
      <h3 className={cardParts.title}>{{title}}</h3>
      <Button variant="primary">{{action}}</Button>
    </Card>
  )
}
`,
  },
  angular: {
    name: "card-example.component.ts",
    language: "ts",
    code: `import { Component } from "@angular/core"
import { ButtonComponent } from "./button.component"
import { CardComponent } from "./card.component"

// The card in the lab: an image, a title and a primary Button as its action.
@Component({
  selector: "app-card-example",
  standalone: true,
  imports: [CardComponent, ButtonComponent],
  template: \`
    <ds-card variant="{{variant}}" size="{{size}}">
      <img class="media" src="/cover.jpg" alt="" />
      <h3 class="ds-card__title">{{title}}</h3>
      <button dsButton variant="primary">{{action}}</button>
    </ds-card>
  \`,
  styles: \`
    .media {
      width: 100%;
      aspect-ratio: 16 / 9;
      object-fit: cover;
      border-radius: calc(var(--ds-radius-card) / 2);
    }
  \`,
})
export class CardExampleComponent {}
`,
  },
  vue: {
    name: "CardExample.vue",
    language: "vue",
    code: `<script setup lang="ts">
import Button from "./Button.vue"
import Card from "./Card.vue"
</script>

<!-- The card in the lab: an image, a title and a primary Button as its action. -->
<template>
  <Card variant="{{variant}}" size="{{size}}">
    <img class="media" src="/cover.jpg" alt="" />
    <h3 class="ds-card__title">{{title}}</h3>
    <Button variant="primary">{{action}}</Button>
  </Card>
</template>

<style scoped>
.media {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: calc(var(--ds-radius-card) / 2);
}
</style>
`,
  },
  swift: {
    name: "CardExample.swift",
    language: "swift",
    code: `import SwiftUI

// The card in the lab: an image, a title and a primary DSButton as its action.
struct CardExample: View {
    var body: some View {
        DSCard(variant: .{{variant}}, size: .{{size}}) {
            Image("cover")
                .resizable()
                .aspectRatio(16 / 9, contentMode: .fill)
                .clipShape(RoundedRectangle(cornerRadius: {{radius.card}} / 2))
            Text("{{title}}").cardTitle()
            DSButton(label: "{{action}}", variant: .primary) {}
        }
    }
}
`,
  },
  kotlin: {
    name: "CardExample.kt",
    language: "kotlin",
    code: `import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import dev.santirequelme.tokens.Tokens

// The card in the lab: an image, a title and a primary DSButton as its action.
@Composable
fun CardExample() {
    DSCard(variant = DSCardVariant.{{variant}}, size = DSCardSize.{{size}}) {
        Image(
            painter = painterResource(R.drawable.cover),
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxWidth().aspectRatio(16f / 9f).clip(RoundedCornerShape({{radius.card}} / 2)),
        )
        Text("{{title}}", style = CardParts.title)
        DSButton(label = "{{action}}", onClick = {}, variant = DSButtonVariant.Primary)
    }
}
`,
  },
}
