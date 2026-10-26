// Button in five stacks. API from specs/button.spec.json.

import { entry, kotlinNumber, pascal, swiftNumber, type ComponentTemplates } from "./shared"

const REACT = `import { forwardRef, type ButtonHTMLAttributes } from "react"
import "./button.css"

// {{doc}}
// API from specs/button.spec.json. Styles: button.css, which reads tokens.css (generated).

export type ButtonVariant = {{variantType}}
export type ButtonSize = {{sizeType}}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "{{variantDefault}}", size = "{{sizeDefault}}", type = "button", className, ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      data-variant={variant}
      data-size={size}
      className={["ds-button", className].filter(Boolean).join(" ")}
      {...props}
    />
  ),
)
Button.displayName = "Button"

// Usage: <Button variant="primary" onClick={save}>Save changes</Button>
`

const ANGULAR = `import { Component, Input, ViewEncapsulation, booleanAttribute } from "@angular/core"

// {{doc}}
// API from specs/button.spec.json. Styles: button.css, which reads tokens.css
// (generated, loaded once globally).

export type ButtonVariant = {{variantType}}
export type ButtonSize = {{sizeType}}

// An attribute selector on the native <button>, so it keeps its role,
// keyboard behaviour and form semantics.
@Component({
  selector: "button[dsButton]",
  standalone: true,
  template: "<ng-content />",
  styleUrl: "./button.css",
  encapsulation: ViewEncapsulation.None,
  host: {
    class: "ds-button",
    "[attr.data-variant]": "variant",
    "[attr.data-size]": "size",
    "[attr.type]": "type",
    "[disabled]": "disabled",
  },
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = "{{variantDefault}}"
  @Input() size: ButtonSize = "{{sizeDefault}}"
  @Input() type: "button" | "submit" | "reset" = "button"
  @Input({ transform: booleanAttribute }) disabled = false
}

// Usage: <button dsButton variant="primary" (click)="save()">Save changes</button>
`

const VUE = `<script setup lang="ts">
// {{doc}}
// API from specs/button.spec.json. Reads the CSS variables from tokens.css
// (generated), imported once in main.ts.
type ButtonVariant = {{variantType}}
type ButtonSize = {{sizeType}}

withDefaults(
  defineProps<{ variant?: ButtonVariant; size?: ButtonSize; type?: "button" | "submit" | "reset"; disabled?: boolean }>(),
  { variant: "{{variantDefault}}", size: "{{sizeDefault}}", type: "button", disabled: false },
)
</script>

<template>
  <button class="ds-button" :type="type" :disabled="disabled" :data-variant="variant" :data-size="size">
    <slot />
  </button>
</template>

<!-- Not scoped: the classes are prefixed with ds-. -->
<style>
{{css}}
</style>

<!-- Usage: <Button variant="primary" @click="save">Save changes</Button> -->
`

const SWIFT = `import SwiftUI

// {{doc}}
// API from specs/button.spec.json. Uses the generated Tokens enum (Tokens.swift).
// Heights and the sm and lg text sizes have no token yet.

enum DSButtonVariant {
    case {{variantType}}
}

enum DSButtonSize {
    case {{sizeType}}
}

struct DSButton: View {
    let label: String
    var variant: DSButtonVariant = .{{variantDefault}}
    var size: DSButtonSize = .{{sizeDefault}}
    var isDisabled = false
    let action: () -> Void

    var body: some View {
        let shape = RoundedRectangle(cornerRadius: {{radius.button}})
        Button(action: action) {
            Text(label)
                .font(.system(size: metrics.fontSize, weight: .medium))
                .foregroundStyle(colors.foreground)
                .padding(.horizontal, metrics.padding)
                .frame(height: metrics.height)
                .background(colors.background, in: shape)
                .overlay(shape.stroke(colors.border, lineWidth: 1))
        }
        .buttonStyle(.plain)
        .disabled(isDisabled)
        .opacity(isDisabled ? 0.5 : 1)
    }

    private var colors: (background: Color, foreground: Color, border: Color) {
        switch variant {
{{colorCases}}
        }
    }

    private var metrics: (height: CGFloat, padding: CGFloat, fontSize: CGFloat) {
        switch size {
{{sizeCases}}
        }
    }
}

// Usage: DSButton(label: "Save changes", variant: .primary) { save() }
`

const KOTLIN = `import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import dev.santirequelme.tokens.Tokens

// {{doc}}
// API from specs/button.spec.json. Uses the generated Tokens object (Tokens.kt).
// Heights and the sm and lg text sizes have no token yet.

enum class DSButtonVariant { {{variantType}} }
enum class DSButtonSize { {{sizeType}} }

@Composable
fun DSButton(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: DSButtonVariant = DSButtonVariant.{{variantDefault}},
    size: DSButtonSize = DSButtonSize.{{sizeDefault}},
    enabled: Boolean = true,
) {
    val (container, content, border) = when (variant) {
{{colorCases}}
    }
    val (height, padding, fontSize) = when (size) {
{{sizeCases}}
    }
    Button(
        onClick = onClick,
        enabled = enabled,
        shape = RoundedCornerShape({{radius.button}}),
        border = border?.let { BorderStroke(1.dp, it) },
        colors = ButtonDefaults.buttonColors(
            containerColor = container,
            contentColor = content,
            disabledContainerColor = container.copy(alpha = 0.5f),
            disabledContentColor = content.copy(alpha = 0.5f),
        ),
        contentPadding = PaddingValues(horizontal = padding),
        modifier = modifier.height(height),
    ) {
        Text(label, fontSize = fontSize, fontWeight = FontWeight.Medium)
    }
}

// Usage: DSButton(label = "Save changes", onClick = ::save, variant = DSButtonVariant.Primary)
`

// Per variant: background, text, border. null means transparent (no border).
const COLORS: Record<string, [string | null, string, string | null]> = {
  primary: ["{{color.primary}}", "{{color.onPrimary}}", null],
  secondary: ["{{color.surface}}", "{{color.text}}", "{{color.border}}"],
  ghost: [null, "{{color.primary}}", null],
}

// Per size: height, horizontal padding, text size.
const SIZES: Record<string, [string | number, string | number, string | number]> = {
  sm: [32, 12, 13],
  md: [40, "{{space.sm}}", "{{fontSize.body}}"],
  lg: [48, "{{space.md}}", 16],
}

export const BUTTON: ComponentTemplates = {
  files: {
    react: [
      { name: "Button.tsx", language: "tsx", code: REACT },
      { name: "button.css", language: "css", code: "{{css}}\n" },
    ],
    angular: [
      { name: "button.component.ts", language: "ts", code: ANGULAR },
      { name: "button.css", language: "css", code: "{{css}}\n" },
    ],
    vue: [{ name: "Button.vue", language: "vue", code: VUE }],
    swift: [{ name: "DSButton.swift", language: "swift", code: SWIFT }],
    kotlin: [{ name: "DSButton.kt", language: "kotlin", code: KOTLIN }],
  },
  swift: ({ variants, sizes }) => ({
    colorCases: variants
      .map((v) => {
        const [bg, fg, border] = entry(COLORS, v, "Button colours")
        return `        case .${v}: return (${bg ?? ".clear"}, ${fg}, ${border ?? ".clear"})`
      })
      .join("\n"),
    sizeCases: sizes
      .map((s) => `        case .${s}: return (${entry(SIZES, s, "Button size").map(swiftNumber).join(", ")})`)
      .join("\n"),
  }),
  kotlin: ({ variants, sizes }) => ({
    colorCases: variants
      .map((v) => {
        const [bg, fg, border] = entry(COLORS, v, "Button colours")
        return `        DSButtonVariant.${pascal(v)} -> Triple(${bg ?? "Color.Transparent"}, ${fg}, ${border ?? "null"})`
      })
      .join("\n"),
    sizeCases: sizes
      .map((s) => {
        const [height, padding, font] = entry(SIZES, s, "Button size")
        return `        DSButtonSize.${pascal(s)} -> Triple(${kotlinNumber(height, "dp")}, ${kotlinNumber(padding, "dp")}, ${kotlinNumber(font, "sp")})`
      })
      .join("\n"),
  }),
}
