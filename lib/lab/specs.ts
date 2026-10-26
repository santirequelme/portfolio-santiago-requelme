// The component specs in specs/*.spec.json, typed. They are the source for the
// stack templates' Card API and for the Spec panel in the lab.
// `pnpm specs:validate` keeps them in line with the schema, tokens and code.

import button from "@/specs/button.spec.json"
import card from "@/specs/card.spec.json"
import input from "@/specs/input.spec.json"
import type { ComponentSpec, PropSpec } from "@/specs/schema/component-spec"
import type { ComponentKind } from "./playground"

export const SPECS: Record<ComponentKind, ComponentSpec> = {
  button: button as ComponentSpec,
  card: card as ComponentSpec,
  input: input as ComponentSpec,
}

export const SPEC_FILES: Record<ComponentKind, string> = {
  button: "specs/button.spec.json",
  card: "specs/card.spec.json",
  input: "specs/input.spec.json",
}

export function specProp(spec: ComponentSpec, name: string): PropSpec {
  const prop = spec.props.find((p) => p.name === name)
  if (!prop) throw new Error(`${spec.name} spec has no "${name}" prop`)
  return prop
}

/** Allowed values and default of an enum prop, e.g. Card's variant. */
export function enumProp(spec: ComponentSpec, name: string) {
  const prop = specProp(spec, name)
  if (prop.type !== "enum" || !prop.values || typeof prop.default !== "string")
    throw new Error(`${spec.name}.${name} must be an enum with a default in its spec`)
  return { values: prop.values, default: prop.default }
}
