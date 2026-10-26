// Turns user input ("Button", "card.json", "Angular") into a known component
// or stack, or a structured error that lists the valid options.

import { SPECS } from "@/lib/lab/specs"
import { STACKS } from "@/lib/lab/stacks"
import type { ComponentKind, Result, StackId } from "./types"

export const COMPONENT_IDS = Object.keys(SPECS) as ComponentKind[]
export const STACK_IDS = STACKS.map((s) => s.id)
export const BASE_PATH = "/r"

const normalise = (input: unknown) => (typeof input === "string" ? input.trim().toLowerCase().replace(/\.json$/, "") : "")

export function parseComponent(input: unknown): Result<ComponentKind> {
  const id = normalise(input)
  const match = COMPONENT_IDS.find((c) => c === id)
  if (match) return { ok: true, data: match }
  return {
    ok: false,
    error: { code: "unknown_component", message: `Unknown component "${String(input)}".`, received: input, valid: [...COMPONENT_IDS] },
  }
}

export function parseStack(input: unknown): Result<StackId> {
  const id = normalise(input)
  const match = STACK_IDS.find((s) => s === id)
  if (match) return { ok: true, data: match }
  return {
    ok: false,
    error: { code: "unknown_stack", message: `Unknown stack "${String(input)}".`, received: input, valid: [...STACK_IDS] },
  }
}
