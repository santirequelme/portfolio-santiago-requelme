// Shapes returned by the design-system registry (lib/registry) and the
// public JSON routes under /r. Everything here is read-only data.

import type { ComponentSpec } from "@/specs/schema/component-spec"
import type { ComponentKind } from "@/lib/lab/playground"
import type { GeneratedFile, StackId } from "@/lib/lab/stacks"
import type { TokenType } from "@/lib/lab/token-outputs"

export type { ComponentKind, GeneratedFile, StackId }

export interface RegistryError {
  code: "unknown_component" | "unknown_stack" | "invalid_props"
  message: string
  received: unknown
  /** The values that would have been accepted. */
  valid: string[]
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: RegistryError }

/** One token with its value and its name in every output. */
export interface ResolvedToken {
  path: string
  type: TokenType
  value: string
  description?: string
  css: string
  swift: string
  kotlin: string
}

export interface ComponentSummary {
  id: ComponentKind
  name: string
  description: string
  variants: string[]
  sizes: string[]
  stacks: StackId[]
  href: string
}

export interface ComponentEntry {
  id: ComponentKind
  name: string
  description: string
  stacks: StackId[]
  spec: ComponentSpec
  /** The tokens the spec lists, with resolved values. */
  tokens: (ResolvedToken & { usage: string })[]
  /** Present when a stack was requested. */
  code: { stack: StackId; files: GeneratedFile[]; tokenFile: GeneratedFile; example?: GeneratedFile } | null
}

export interface RulesEntry {
  source: "AGENTS.md"
  /** The full guide, as Markdown. */
  guide: string
  /** The numbered rules from the guide's "Rules" section. */
  rules: { id: string; title: string; text: string }[]
  /** Per-component rules taken from each spec. */
  components: Record<ComponentKind, { accessibility: ComponentSpec["accessibility"]; whenNotToUse: string[] }>
}

export interface UsageIssue {
  severity: "error" | "warning"
  kind: "unknown_prop" | "invalid_value" | "invalid_type" | "missing_required" | "accessibility" | "hardcoded_value"
  prop?: string
  message: string
  suggestion?: string
}

export interface UsageReport {
  component: ComponentKind
  valid: boolean
  issues: UsageIssue[]
}
