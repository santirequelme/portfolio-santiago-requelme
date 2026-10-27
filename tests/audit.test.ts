// Tests for the token audit (lib/lab/audit.ts): the source tokens pass, and
// the values the system shipped before this check would have failed it.

import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { auditPlayground, auditTokens, PRIMARY_AS_TEXT } from "@/lib/lab/audit"
import { flatTokens, SOURCE_TOKENS, type LabTokens } from "@/lib/lab/stack-tokens"
import { componentFiles } from "@/lib/lab/stacks"
import { formatSwift, formatKotlin, TOKEN_NS } from "@/lib/lab/token-outputs"

const failing = (tokens: LabTokens) => auditTokens(flatTokens(tokens)).filter((c) => !c.pass)
const edit = (change: (t: LabTokens) => void) => {
  const t = structuredClone(SOURCE_TOKENS)
  change(t)
  return t
}

describe("token audit", () => {
  it("passes for the source tokens and every playground theme and accent", () => {
    assert.deepEqual(failing(SOURCE_TOKENS).map((c) => c.detail), [])
    assert.deepEqual(auditPlayground().filter((c) => !c.pass).map((c) => c.label), [])
  })

  it("fails the old text on primary (#111111, 4.35:1)", () => {
    const fails = failing(edit((t) => (t.color.onPrimary.$value = "#111111")))
    assert.equal(fails.length, 1)
    assert.match(fails[0].detail, /4\.35:1, needs 4\.5:1/)
  })

  it("fails the old input border (#2E3037, about 1.3:1)", () => {
    const fails = failing(edit((t) => (t.color.controlBorder.$value = t.color.border.$value)))
    assert.deepEqual(fails.map((c) => c.id), ["contrast.input.2"])
  })

  it("fails a touch target below a platform's guideline", () => {
    const fails = failing(edit((t) => (t.control.minTarget.$extensions = { [TOKEN_NS]: { scope: "platform", ios: "2rem", android: "3rem" } })))
    assert.deepEqual(fails.map((c) => c.id), ["target.ios"])
  })

  it("fails a token that does not say whether it is shared", () => {
    const fails = failing(edit((t) => delete t.radius.card.$extensions))
    assert.deepEqual(fails.map((c) => c.id), ["scope.declared"])
    assert.match(fails[0].detail, /radius\.card/)
  })

  it("spots color.primary used as text in each language", () => {
    const old: Record<string, string> = {
      "web CSS": ".ds-button[data-variant=\"ghost\"] {\n  background: transparent;\n  color: var(--ds-color-primary);\n}",
      playground: "bg-transparent text-[var(--ui-accent)]",
      Swift: "case .ghost: return (.clear, Tokens.colorPrimary, .clear)",
      Kotlin: "DSButtonVariant.Ghost -> Triple(Color.Transparent, Tokens.colorPrimary, null)",
    }
    for (const [where, , re] of PRIMARY_AS_TEXT) assert.match(old[where], re, where)
    // Fills, underlines and focus rings are fine.
    const [, , web] = PRIMARY_AS_TEXT[0]
    assert.doesNotMatch("text-decoration-color: var(--ds-color-primary);\noutline: 2px solid var(--ds-color-primary);", web)
  })
})

describe("platform-local tokens", () => {
  it("give each platform its own minimum touch target", () => {
    const flat = flatTokens(SOURCE_TOKENS)
    assert.match(formatSwift(flat), /controlMinTarget = CGFloat\(44\.00\)/)
    assert.match(formatKotlin(flat), /controlMinTarget = 48\.00\.dp/)
    assert.match(formatSwift(flat), /controlSm = CGFloat\(32\.00\)/)
  })

  it("native Button and Input pad their tap area to it", () => {
    for (const kind of ["button", "input"] as const)
      for (const stack of ["swift", "kotlin"] as const)
        assert.ok(componentFiles(kind, stack).some((f) => f.code.includes("Tokens.controlMinTarget")), `${kind} ${stack}`)
  })
})
