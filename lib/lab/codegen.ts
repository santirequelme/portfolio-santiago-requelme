// Code generation for the playground. Everything printed here comes from
// RECIPES, SAMPLE and resolveTokens() in ./playground — the same values the
// live preview renders — so the code always matches the current settings.

import { RECIPES, SAMPLE, resolveTokens, type PlaygroundConfig } from "./playground"

export interface GeneratedFile {
  name: string
  language: "tsx" | "ts" | "html" | "css"
  code: string
  /** True when the file is not what runs on this page (illustrative only). */
  illustrative?: boolean
}

const q = (s: string) => JSON.stringify(s)

function recordLiteral(obj: Record<string, string>, indent = "  ") {
  return Object.entries(obj)
    .map(([k, v]) => `${indent}${/^[a-z]+$/.test(k) ? k : q(k)}: ${q(v)},`)
    .join("\n")
}

function tokensComment(config: PlaygroundConfig) {
  return `theme: ${config.theme} · radius: ${config.radius}px · accent: ${config.accent.toUpperCase()}`
}

function tokensObject(config: PlaygroundConfig) {
  return recordLiteral(resolveTokens(config))
}

function tokensCss(config: PlaygroundConfig, selector: string) {
  const lines = Object.entries(resolveTokens(config)).map(([k, v]) => `  ${k}: ${v};`)
  return `${selector} {\n${lines.join("\n")}\n}`
}

function stateAttrsJsx(config: PlaygroundConfig, disabledProp: "disabled" | "disabled") {
  const attrs: string[] = []
  if (config.state === "disabled") attrs.push(disabledProp)
  if (config.state === "hover") attrs.push(`data-force="hover"`)
  return attrs.length ? " " + attrs.join(" ") : ""
}

// ─── React (runs on this page) ──────────────────────────────────────────────

function reactButton(config: PlaygroundConfig): GeneratedFile[] {
  const r = RECIPES.button
  return [
    {
      name: "button.tsx",
      language: "tsx",
      code: `import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

const base = ${q(r.base)}

const sizes = {
${recordLiteral(r.sizes)}
} as const

const variants = {
${recordLiteral(r.variants)}
} as const

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", type = "button", className, ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    />
  ),
)
Button.displayName = "Button"`,
    },
    {
      name: "example.tsx",
      language: "tsx",
      code: `import type { CSSProperties } from "react"
import { Button } from "./button"

// ${tokensComment(config)}
const tokens = {
${tokensObject(config)}
} as CSSProperties

export function Example() {
  return (
    <div style={tokens}>${config.state === "hover" ? "\n      {/* data-force pins the hover style for docs and visual tests */}" : ""}
      <Button variant=${q(config.variant)} size=${q(config.size)}${stateAttrsJsx(config, "disabled")}>
        ${SAMPLE.button.label}
      </Button>
    </div>
  )
}`,
    },
  ]
}

function reactCard(config: PlaygroundConfig): GeneratedFile[] {
  const r = RECIPES.card
  const disabled = config.state === "disabled" ? " disabled" : ""
  const force = config.state === "hover" ? ` data-force="hover"` : ""
  return [
    {
      name: "card.tsx",
      language: "tsx",
      code: `import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

const base = ${q(r.base)}

const sizes = {
${recordLiteral(r.sizes)}
} as const

const variants = {
${recordLiteral(r.variants)}
} as const

export const cardParts = {
${recordLiteral(r.parts)}
} as const

export type CardProps = HTMLAttributes<HTMLElement> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  /** Visually dims the card and removes it from interaction. */
  disabled?: boolean
}

export function Card({ variant = "elevated", size = "md", disabled, className, ...props }: CardProps) {
  return (
    <article
      aria-disabled={disabled || undefined}
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    />
  )
}`,
    },
    {
      name: "example.tsx",
      language: "tsx",
      code: `import type { CSSProperties } from "react"
import { Card, cardParts } from "./card"

// ${tokensComment(config)}
const tokens = {
${tokensObject(config)}
} as CSSProperties

export function Example() {
  return (
    <div style={tokens}>
      <Card variant=${q(config.variant)} size=${q(config.size)}${disabled}${force}>
        <p className={cardParts.eyebrow}>${SAMPLE.card.eyebrow}</p>
        <h3 className={cardParts.title}>${SAMPLE.card.title}</h3>
        <p className={cardParts.body}>${SAMPLE.card.body}</p>
        <a href="/system" className={cardParts.action}${config.state === "disabled" ? " tabIndex={-1}" : ""}>
          ${SAMPLE.card.action} →
        </a>
      </Card>
    </div>
  )
}`,
    },
  ]
}

function reactInput(config: PlaygroundConfig): GeneratedFile[] {
  const r = RECIPES.input
  return [
    {
      name: "input.tsx",
      language: "tsx",
      code: `import { forwardRef, useId, type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

const base = ${q(r.base)}

const sizes = {
${recordLiteral(r.sizes)}
} as const

const variants = {
${recordLiteral(r.variants)}
} as const

const parts = {
${recordLiteral(r.parts)}
} as const

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label: string
  hint?: string
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, id, variant = "outline", size = "md", className, ...props }, ref) => {
    const autoId = useId()
    const inputId = id ?? autoId
    const hintId = hint ? \`\${inputId}-hint\` : undefined

    return (
      <div className={parts.field}>
        <label htmlFor={inputId} className={parts.label}>
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-describedby={hintId}
          className={cn(base, sizes[size], variants[variant], className)}
          {...props}
        />
        {hint && (
          <p id={hintId} className={parts.hint}>
            {hint}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = "Input"`,
    },
    {
      name: "example.tsx",
      language: "tsx",
      code: `import type { CSSProperties } from "react"
import { Input } from "./input"

// ${tokensComment(config)}
const tokens = {
${tokensObject(config)}
} as CSSProperties

export function Example() {
  return (
    <div style={tokens}>
      <Input
        type="email"
        label=${q(SAMPLE.input.label)}
        hint=${q(SAMPLE.input.hint)}
        placeholder=${q(SAMPLE.input.placeholder)}
        variant=${q(config.variant)}
        size=${q(config.size)}${config.state === "disabled" ? "\n        disabled" : ""}${config.state === "hover" ? `\n        data-force="hover"` : ""}
      />
    </div>
  )
}`,
    },
  ]
}

// ─── Angular (illustrative mapping of the same API) ─────────────────────────

const ANGULAR_NOTE = "// Illustrative Angular equivalent — same recipes and API, not executed on this page."

function angularCommon(name: string, recipes: { base: string; sizes: Record<string, string>; variants: Record<string, string> }) {
  return `const BASE = ${q(recipes.base)}

const SIZES = {
${recordLiteral(recipes.sizes)}
} as const

const VARIANTS = {
${recordLiteral(recipes.variants)}
} as const

export type ${name}Size = keyof typeof SIZES
export type ${name}Variant = keyof typeof VARIANTS`
}

function angularButton(config: PlaygroundConfig): GeneratedFile[] {
  const attrs = [`variant="${config.variant}"`, `size="${config.size}"`]
  if (config.state === "disabled") attrs.push("disabled")
  if (config.state === "hover") attrs.push(`data-force="hover"`)
  return [
    {
      name: "button.component.ts",
      language: "ts",
      illustrative: true,
      code: `${ANGULAR_NOTE}
import { Component, Input, booleanAttribute } from "@angular/core"

${angularCommon("Button", RECIPES.button)}

@Component({
  selector: "ui-button",
  standalone: true,
  template: \`
    <button [attr.type]="type" [disabled]="disabled" [class]="classes">
      <ng-content />
    </button>
  \`,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = "primary"
  @Input() size: ButtonSize = "md"
  @Input() type: "button" | "submit" | "reset" = "button"
  @Input({ transform: booleanAttribute }) disabled = false

  get classes() {
    return [BASE, SIZES[this.size], VARIANTS[this.variant]].join(" ")
  }
}`,
    },
    {
      name: "example.component.html",
      language: "html",
      illustrative: true,
      code: `<!-- ${tokensComment(config)} -->
<ui-button ${attrs.join(" ")}>${SAMPLE.button.label}</ui-button>`,
    },
    { name: "styles.css", language: "css", illustrative: true, code: tokensCss(config, ":root") },
  ]
}

function angularCard(config: PlaygroundConfig): GeneratedFile[] {
  const attrs = [`variant="${config.variant}"`, `size="${config.size}"`]
  if (config.state === "disabled") attrs.push("disabled")
  if (config.state === "hover") attrs.push(`data-force="hover"`)
  return [
    {
      name: "card.component.ts",
      language: "ts",
      illustrative: true,
      code: `${ANGULAR_NOTE}
import { Component, Input, booleanAttribute } from "@angular/core"

${angularCommon("Card", RECIPES.card)}

@Component({
  selector: "ui-card",
  standalone: true,
  host: {
    role: "article",
    "[class]": "classes",
    "[attr.aria-disabled]": "disabled || null",
  },
  template: \`<ng-content />\`,
})
export class CardComponent {
  @Input() variant: CardVariant = "elevated"
  @Input() size: CardSize = "md"
  @Input({ transform: booleanAttribute }) disabled = false

  get classes() {
    return [BASE, SIZES[this.size], VARIANTS[this.variant]].join(" ")
  }
}`,
    },
    {
      name: "example.component.html",
      language: "html",
      illustrative: true,
      code: `<!-- ${tokensComment(config)} -->
<ui-card ${attrs.join(" ")}>
  <p class="${RECIPES.card.parts.eyebrow}">${SAMPLE.card.eyebrow}</p>
  <h3 class="${RECIPES.card.parts.title}">${SAMPLE.card.title}</h3>
  <p class="${RECIPES.card.parts.body}">${SAMPLE.card.body}</p>
  <a routerLink="/system" class="${RECIPES.card.parts.action}">${SAMPLE.card.action} →</a>
</ui-card>`,
    },
    { name: "styles.css", language: "css", illustrative: true, code: tokensCss(config, ":root") },
  ]
}

function angularInput(config: PlaygroundConfig): GeneratedFile[] {
  const attrs = [
    `type="email"`,
    `label="${SAMPLE.input.label}"`,
    `hint="${SAMPLE.input.hint}"`,
    `placeholder="${SAMPLE.input.placeholder}"`,
    `variant="${config.variant}"`,
    `size="${config.size}"`,
  ]
  if (config.state === "disabled") attrs.push("disabled")
  if (config.state === "hover") attrs.push(`data-force="hover"`)
  return [
    {
      name: "input.component.ts",
      language: "ts",
      illustrative: true,
      code: `${ANGULAR_NOTE}
import { Component, Input, booleanAttribute } from "@angular/core"

${angularCommon("Input", RECIPES.input)}

let nextId = 0

@Component({
  selector: "ui-input",
  standalone: true,
  template: \`
    <div class="${RECIPES.input.parts.field}">
      <label [for]="id" class="${RECIPES.input.parts.label}">{{ label }}</label>
      <input
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [attr.aria-describedby]="hint ? id + '-hint' : null"
        [class]="classes"
      />
      @if (hint) {
        <p [id]="id + '-hint'" class="${RECIPES.input.parts.hint}">{{ hint }}</p>
      }
    </div>
  \`,
})
export class InputComponent {
  @Input({ required: true }) label!: string
  @Input() hint?: string
  @Input() type = "text"
  @Input() placeholder = ""
  @Input() variant: InputVariant = "outline"
  @Input() size: InputSize = "md"
  @Input({ transform: booleanAttribute }) disabled = false

  readonly id = \`ui-input-\${nextId++}\`

  get classes() {
    return [BASE, SIZES[this.size], VARIANTS[this.variant]].join(" ")
  }
}`,
    },
    {
      name: "example.component.html",
      language: "html",
      illustrative: true,
      code: `<!-- ${tokensComment(config)} -->
<ui-input
  ${attrs.join("\n  ")}
/>`,
    },
    { name: "styles.css", language: "css", illustrative: true, code: tokensCss(config, ":root") },
  ]
}

export function generateCode(config: PlaygroundConfig): GeneratedFile[] {
  if (config.framework === "angular") {
    if (config.component === "button") return angularButton(config)
    if (config.component === "card") return angularCard(config)
    return angularInput(config)
  }
  if (config.component === "button") return reactButton(config)
  if (config.component === "card") return reactCard(config)
  return reactInput(config)
}
