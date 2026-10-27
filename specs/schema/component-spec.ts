// A machine-readable description of one design-system component: what it is,
// how to use it and which tokens it reads. Mirrors component-spec.schema.json;
// `pnpm specs:validate` checks every spec against that schema.

export type StateName = "default" | "hover" | "focus" | "disabled" | "loading" | "error"

export interface PropSpec {
  name: string
  /** "enum" props list their allowed `values`. */
  type: "enum" | "string" | "boolean" | "function" | "node"
  values?: string[]
  /** null when the prop has no default. */
  default: string | boolean | null
  required: boolean
  description: string
}

export interface ComponentSpec {
  $schema?: string
  name: string
  /** One sentence. */
  description: string
  /** Where the implementation lives, relative to the repo root. */
  source: string
  /** Root element the web component renders, e.g. "button". */
  element: string
  /** Native props passed through to that element, if any. */
  extends: string | null
  whenToUse: string[]
  whenNotToUse: string[]
  props: PropSpec[]
  variants: string[]
  sizes: string[]
  states: { name: StateName; description: string }[]
  /** Token paths from tokens/lab.tokens.json, e.g. "color.primary". Never raw values. */
  tokens: { path: string; usage: string }[]
  accessibility: {
    role: string
    keyboard: string[]
    focus: string
    contrast: string
    /** The colour pairs behind `contrast`, checked against the tokens by `pnpm tokens:audit`. */
    contrastChecks: ContrastCheck[]
    labels: string
  }
  composition: string[]
  example: { language: "tsx"; code: string }
}

export interface ContrastCheck {
  label: string
  /** Token paths, e.g. "color.onPrimary" on "color.primary". */
  foreground: string
  background: string
  /** WCAG 2.2: 4.5 for text, 3 for non-text (borders, focus rings), 7 for AAA text. */
  min: 3 | 4.5 | 7
}
