// Input in five stacks. API from specs/input.spec.json.

import { entry, kotlinNumber, pascal, swiftNumber, type ComponentTemplates } from "./shared"

const REACT = `import { forwardRef, useId, type InputHTMLAttributes } from "react"
import "./input.css"

// {{doc}}
// API from specs/input.spec.json. Styles: input.css, which reads tokens.css (generated).

export type InputVariant = {{variantType}}
export type InputSize = {{sizeType}}

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  /** Visible label. Required: never replace it with the placeholder. */
  label: string
  hint?: string
  variant?: InputVariant
  size?: InputSize
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, id, variant = "{{variantDefault}}", size = "{{sizeDefault}}", className, ...props }, ref) => {
    const autoId = useId()
    const inputId = id ?? autoId
    const hintId = hint ? \`\${inputId}-hint\` : undefined
    return (
      <div className="ds-field">
        <label htmlFor={inputId} className="ds-field__label">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-describedby={hintId}
          data-variant={variant}
          data-size={size}
          className={["ds-input", className].filter(Boolean).join(" ")}
          {...props}
        />
        {hint && (
          <p id={hintId} className="ds-field__hint">
            {hint}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = "Input"

// Usage: <Input type="email" label="Email" hint="We'll only use it to reply." placeholder="you@company.com" />
`

const ANGULAR = `import { Component, EventEmitter, Input, Output, ViewEncapsulation, booleanAttribute } from "@angular/core"

// {{doc}}
// API from specs/input.spec.json. Styles: input.css, which reads tokens.css
// (generated, loaded once globally).

export type InputVariant = {{variantType}}
export type InputSize = {{sizeType}}

let nextId = 0

@Component({
  selector: "ds-input",
  standalone: true,
  template: \`
    <div class="ds-field">
      <label class="ds-field__label" [for]="id">{{ label }}</label>
      <input
        class="ds-input"
        [id]="id"
        [type]="type"
        [value]="value"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [attr.data-variant]="variant"
        [attr.data-size]="size"
        [attr.aria-describedby]="hint ? id + '-hint' : null"
        (input)="onInput($event)"
      />
      @if (hint) {
        <p class="ds-field__hint" [id]="id + '-hint'">{{ hint }}</p>
      }
    </div>
  \`,
  styleUrl: "./input.css",
  encapsulation: ViewEncapsulation.None,
})
export class InputComponent {
  @Input({ required: true }) label!: string
  @Input() hint?: string
  @Input() id = \`ds-input-\${nextId++}\`
  @Input() type = "text"
  @Input() value = ""
  @Input() placeholder = ""
  @Input() variant: InputVariant = "{{variantDefault}}"
  @Input() size: InputSize = "{{sizeDefault}}"
  @Input({ transform: booleanAttribute }) disabled = false
  @Output() valueChange = new EventEmitter<string>()

  onInput(event: Event) {
    this.valueChange.emit((event.target as HTMLInputElement).value)
  }
}

// Usage: <ds-input label="Email" type="email" hint="We'll only use it to reply." [(value)]="email" />
`

const VUE = `<script setup lang="ts">
// {{doc}}
// API from specs/input.spec.json. Reads the CSS variables from tokens.css
// (generated), imported once in main.ts.
import { computed, useId } from "vue"

type InputVariant = {{variantType}}
type InputSize = {{sizeType}}

const props = withDefaults(
  defineProps<{
    label: string
    hint?: string
    id?: string
    placeholder?: string
    disabled?: boolean
    variant?: InputVariant
    size?: InputSize
  }>(),
  { variant: "{{variantDefault}}", size: "{{sizeDefault}}", disabled: false },
)
const model = defineModel<string>({ default: "" })
const autoId = useId()
const inputId = computed(() => props.id ?? autoId)
const hintId = computed(() => (props.hint ? \`\${inputId.value}-hint\` : undefined))
</script>

<template>
  <div class="ds-field">
    <label class="ds-field__label" :for="inputId">{{ label }}</label>
    <input
      v-model="model"
      class="ds-input"
      :id="inputId"
      :placeholder="placeholder"
      :disabled="disabled"
      :data-variant="variant"
      :data-size="size"
      :aria-describedby="hintId"
    />
    <p v-if="hint" :id="hintId" class="ds-field__hint">{{ hint }}</p>
  </div>
</template>

<!-- Not scoped: the classes are prefixed with ds-. -->
<style>
{{css}}
</style>

<!-- Usage: <Input v-model="email" label="Email" hint="We'll only use it to reply." /> -->
`

const SWIFT = `import SwiftUI

// {{doc}}
// API from specs/input.spec.json. Uses the generated Tokens enum (Tokens.swift).
// The visible height is shared with the web; the tap area is platform-local
// (Tokens.controlMinTarget, 44pt on iOS). The sm and lg text sizes have no token yet.

enum DSInputVariant {
    case {{variantType}}
}

enum DSInputSize {
    case {{sizeType}}
}

struct DSInput: View {
    let label: String
    @Binding var text: String
    let hint: String?
    let placeholder: String
    let variant: DSInputVariant
    let size: DSInputSize
    let isDisabled: Bool
    @FocusState private var focused: Bool

    init(
        _ label: String,
        text: Binding<String>,
        hint: String? = nil,
        placeholder: String = "",
        variant: DSInputVariant = .{{variantDefault}},
        size: DSInputSize = .{{sizeDefault}},
        isDisabled: Bool = false
    ) {
        self.label = label
        self._text = text
        self.hint = hint
        self.placeholder = placeholder
        self.variant = variant
        self.size = size
        self.isDisabled = isDisabled
    }

    var body: some View {
        let shape = RoundedRectangle(cornerRadius: {{radius.input}})
        VStack(alignment: .leading, spacing: 6) {
            Text(label)
                .font(.system(size: {{fontSize.body}}, weight: .medium))
                .foregroundStyle({{color.text}})
            // The label is also the field's accessibility label.
            TextField(label, text: $text, prompt: Text(placeholder).foregroundColor({{color.muted}}))
                .focused($focused)
                .font(.system(size: metrics.fontSize))
                .foregroundStyle({{color.text}})
                .padding(.horizontal, metrics.padding)
                .frame(height: metrics.height)
                .background(background, in: shape)
                .overlay(shape.stroke(focused ? {{color.primary}} : border, lineWidth: focused ? 2 : 1))
                // Tap area: at least Tokens.controlMinTarget (platform-local, 44pt on iOS).
                .frame(minHeight: {{control.minTarget}})
                .contentShape(Rectangle())
                .onTapGesture { focused = true }
                .accessibilityHint(hint ?? "")
                .disabled(isDisabled)
                .opacity(isDisabled ? 0.5 : 1)
            if let hint {
                Text(hint)
                    .font(.system(size: 12))
                    .foregroundStyle({{color.muted}})
            }
        }
        .frame(maxWidth: 288, alignment: .leading)
    }

    private var metrics: (height: CGFloat, padding: CGFloat, fontSize: CGFloat) {
        switch size {
{{sizeCases}}
        }
    }

    private var background: Color {
        switch variant {
{{backgroundCases}}
        }
    }

    private var border: Color {
        switch variant {
{{borderCases}}
        }
    }
}

// Usage: DSInput("Email", text: $email, hint: "We'll only use it to reply.")
`

const KOTLIN = `import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material3.LocalMinimumInteractiveComponentSize
import androidx.compose.material3.Text
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import dev.santirequelme.tokens.Tokens

// {{doc}}
// API from specs/input.spec.json. Uses the generated Tokens object (Tokens.kt).
// The visible height is shared with the web; the touch target is platform-local
// (Tokens.controlMinTarget, 48dp on Android). The sm and lg text sizes have no token yet.

enum class DSInputVariant { {{variantType}} }
enum class DSInputSize { {{sizeType}} }

@Composable
fun DSInput(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    hint: String? = null,
    placeholder: String? = null,
    variant: DSInputVariant = DSInputVariant.{{variantDefault}},
    size: DSInputSize = DSInputSize.{{sizeDefault}},
    enabled: Boolean = true,
) {
    val interaction = remember { MutableInteractionSource() }
    val focused by interaction.collectIsFocusedAsState()
    val shape = RoundedCornerShape({{radius.input}})
    val (height, padding, fontSize) = when (size) {
{{sizeCases}}
    }
    val (background, border) = when (variant) {
{{variantCases}}
    }
    Column(modifier = modifier.widthIn(max = 288.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Text(label, color = {{color.text}}, fontSize = {{fontSize.body}}, fontWeight = FontWeight.Medium)
        CompositionLocalProvider(LocalMinimumInteractiveComponentSize provides {{control.minTarget}}) {
            BasicTextField(
                value = value,
                onValueChange = onValueChange,
                enabled = enabled,
                singleLine = true,
                interactionSource = interaction,
                textStyle = TextStyle(color = {{color.text}}, fontSize = fontSize),
                cursorBrush = SolidColor({{color.primary}}),
                modifier = Modifier
                    .minimumInteractiveComponentSize()
                    .fillMaxWidth()
                    .height(height)
                    .alpha(if (enabled) 1f else 0.5f)
                    .background(background, shape)
                    .border(if (focused) 2.dp else 1.dp, if (focused) {{color.primary}} else border, shape)
                    .semantics { contentDescription = label },
                decorationBox = { inner ->
                    Box(Modifier.fillMaxSize().padding(horizontal = padding), contentAlignment = Alignment.CenterStart) {
                        if (value.isEmpty() && placeholder != null) Text(placeholder, color = {{color.muted}}, fontSize = fontSize)
                        inner()
                    }
                },
            )
        }
        if (hint != null) Text(hint, color = {{color.muted}}, fontSize = 12.sp)
    }
}

// Usage: DSInput(label = "Email", value = email, onValueChange = { email = it }, hint = "We'll only use it to reply.")
`

// Per size: height, horizontal padding, text size.
const SIZES: Record<string, [string | number, string | number, string | number]> = {
  sm: ["{{control.sm}}", 10, 13],
  md: ["{{control.md}}", 12, "{{fontSize.body}}"],
  lg: ["{{control.lg}}", "{{space.sm}}", 16],
}

const SWIFT_BACKGROUND: Record<string, string> = {
  outline: "return {{color.surface}}",
  filled: `// Color.mix(with:by:) needs iOS 18.
            return {{color.surface}}.mix(with: {{color.text}}, by: 0.07)`,
}
// Both variants keep a 3:1 boundary: the filled tint alone is not enough.
const SWIFT_BORDER: Record<string, string> = { outline: "return {{color.controlBorder}}", filled: "return {{color.controlBorder}}" }
const KOTLIN_VARIANT: Record<string, string> = {
  outline: "Pair({{color.surface}}, {{color.controlBorder}})",
  filled: "Pair(lerp({{color.surface}}, {{color.text}}, 0.07f), {{color.controlBorder}})",
}

export const INPUT: ComponentTemplates = {
  files: {
    react: [
      { name: "Input.tsx", language: "tsx", code: REACT },
      { name: "input.css", language: "css", code: "{{css}}\n" },
    ],
    angular: [
      { name: "input.component.ts", language: "ts", code: ANGULAR },
      { name: "input.css", language: "css", code: "{{css}}\n" },
    ],
    vue: [{ name: "Input.vue", language: "vue", code: VUE }],
    swift: [{ name: "DSInput.swift", language: "swift", code: SWIFT }],
    kotlin: [{ name: "DSInput.kt", language: "kotlin", code: KOTLIN }],
  },
  swift: ({ variants, sizes }) => ({
    sizeCases: sizes.map((s) => `        case .${s}: return (${entry(SIZES, s, "Input size").map(swiftNumber).join(", ")})`).join("\n"),
    backgroundCases: variants.map((v) => `        case .${v}:\n            ${entry(SWIFT_BACKGROUND, v, "Input background")}`).join("\n"),
    borderCases: variants.map((v) => `        case .${v}: ${entry(SWIFT_BORDER, v, "Input border")}`).join("\n"),
  }),
  kotlin: ({ variants, sizes }) => ({
    sizeCases: sizes
      .map((s) => {
        const [height, padding, font] = entry(SIZES, s, "Input size")
        return `        DSInputSize.${pascal(s)} -> Triple(${kotlinNumber(height, "dp")}, ${kotlinNumber(padding, "dp")}, ${kotlinNumber(font, "sp")})`
      })
      .join("\n"),
    variantCases: variants.map((v) => `        DSInputVariant.${pascal(v)} -> ${entry(KOTLIN_VARIANT, v, "Input variant")}`).join("\n"),
  }),
}
