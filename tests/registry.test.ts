// Tests for the registry core (lib/registry). Run with `pnpm test`.

import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { codeTokenPaths } from "@/lib/lab/stacks"
import { COMPONENT_IDS, getComponent, getRules, getTokens, listComponents, STACK_IDS, validateUsage } from "@/lib/registry"
import { readAgentsGuide } from "@/lib/registry/guide"

const tokenPaths = new Set(getTokens().flat.map((t) => t.path))
const tokenHex = getTokens()
  .flat.filter((t) => t.type === "color")
  .map((t) => t.value.toLowerCase())

describe("listComponents", () => {
  it("lists Button, Card and Input with all five stacks", () => {
    const { components, stacks } = listComponents()
    assert.deepEqual(components.map((c) => c.name), ["Button", "Card", "Input"])
    assert.deepEqual(stacks.map((s) => s.id), ["react", "angular", "vue", "swift", "kotlin"])
    for (const c of components) assert.deepEqual(c.stacks, STACK_IDS)
  })
})

describe("getComponent", () => {
  for (const component of COMPONENT_IDS) {
    for (const stack of STACK_IDS) {
      it(`returns code for ${component} in ${stack}`, () => {
        const result = getComponent(component, stack)
        assert.ok(result.ok, "expected a component")
        const code = result.data.code
        assert.ok(code, "expected code")
        assert.equal(code.stack, stack)
        assert.ok(code.files.length > 0)
        for (const file of code.files) {
          assert.ok(file.code.trim().length > 0, `${file.name} is empty`)
          assert.doesNotMatch(file.code, /\{\{\w+(\.\w+)?\}\}/, `${file.name} has an unfilled placeholder`)
          for (const hex of tokenHex) assert.ok(!file.code.toLowerCase().includes(hex), `${file.name} hardcodes the token value ${hex}`)
        }
        assert.ok(code.tokenFile.code.length > 0)
      })
    }
  }

  it("returns the spec and tokens without code when no stack is given", () => {
    const result = getComponent("Button")
    assert.ok(result.ok)
    assert.equal(result.data.spec.name, "Button")
    assert.equal(result.data.code, null)
  })

  it("accepts names in any case and with .json", () => {
    assert.ok(getComponent("CARD.json", "Angular").ok)
  })

  it("returns a structured error for an unknown stack", () => {
    const result = getComponent("button", "flutter")
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.equal(result.error.code, "unknown_stack")
    assert.equal(result.error.received, "flutter")
    assert.deepEqual(result.error.valid, ["react", "angular", "vue", "swift", "kotlin"])
    assert.match(result.error.message, /flutter/)
  })

  it("returns a structured error for an unknown component", () => {
    const result = getComponent("modal", "react")
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.equal(result.error.code, "unknown_component")
    assert.deepEqual(result.error.valid, ["button", "card", "input"])
  })
})

describe("tokens", () => {
  for (const component of COMPONENT_IDS) {
    it(`every token path in the ${component} spec resolves`, () => {
      const result = getComponent(component)
      assert.ok(result.ok)
      for (const t of result.data.tokens) {
        assert.ok(tokenPaths.has(t.path), `${t.path} is not a token`)
        assert.ok(t.value.length > 0)
        assert.match(t.css, /^var\(--ds-[a-z-]+\)$/)
        assert.match(t.swift, /^Tokens\.[a-zA-Z]+$/)
      }
    })

    it(`the ${component} code only reads tokens its spec lists`, () => {
      const result = getComponent(component)
      assert.ok(result.ok)
      const listed = new Set(result.data.tokens.map((t) => t.path))
      for (const path of codeTokenPaths(component)) assert.ok(listed.has(path), `code uses ${path}, missing from the spec's tokens`)
    })
  }

  it("serves the generated files for CSS, Swift and Kotlin", () => {
    const { files } = getTokens()
    assert.match(files.css.code, /--ds-color-primary: #e23a0d;/)
    assert.match(files.swift.code, /static let colorPrimary = Color\(/)
    assert.match(files.kotlin.code, /val colorPrimary = Color\(0xffe23a0d\)/)
  })
})

describe("getRules", () => {
  const rules = getRules(readAgentsGuide())

  it("reads the numbered rules from AGENTS.md", () => {
    assert.equal(rules.rules.length, 4)
    assert.match(rules.rules[0].title, /Always use tokens/)
    assert.match(rules.rules[1].title, /accessibility/)
  })

  it("adds each spec's accessibility rules", () => {
    assert.match(rules.components.input.accessibility.labels, /label is required/)
    assert.ok(rules.components.button.whenNotToUse.length > 0)
  })
})

describe("validateUsage", () => {
  const report = (component: string, props: Record<string, unknown>) => {
    const result = validateUsage(component, props)
    assert.ok(result.ok)
    return result.data
  }

  it("accepts a valid Button", () => {
    const r = report("button", { variant: "secondary", size: "lg", children: "Cancel" })
    assert.equal(r.valid, true)
    assert.deepEqual(r.issues, [])
  })

  it("catches a hardcoded colour and points to the token", () => {
    const r = report("button", { children: "Save", style: { background: "#E23A0D" } })
    assert.equal(r.valid, false)
    const issue = r.issues.find((i) => i.kind === "hardcoded_value")
    assert.ok(issue)
    assert.equal(issue.prop, "style.background")
    assert.match(issue.suggestion ?? "", /color\.primary/)
  })

  it("catches hardcoded colours in class names", () => {
    const r = report("button", { children: "Save", className: "bg-[#3b82f6] text-white" })
    assert.equal(r.issues.filter((i) => i.kind === "hardcoded_value").length, 2)
  })

  it("catches an invalid variant and lists the allowed ones", () => {
    const r = report("button", { variant: "danger", children: "Delete" })
    assert.equal(r.valid, false)
    const issue = r.issues.find((i) => i.kind === "invalid_value")
    assert.ok(issue)
    assert.equal(issue.prop, "variant")
    assert.match(issue.suggestion ?? "", /primary, secondary, ghost/)
  })

  it("applies the spec's accessibility rules", () => {
    assert.ok(report("button", { variant: "ghost" }).issues.some((i) => i.kind === "accessibility"))
    // A placeholder used as the label: one accessibility error, not a second "required" one.
    const input = report("input", { placeholder: "Email" })
    assert.deepEqual(input.issues.filter((i) => i.prop === "label").map((i) => i.kind), ["accessibility"])
    assert.ok(report("input", {}).issues.some((i) => i.kind === "missing_required" && i.prop === "label"))
  })

  it("flags props the spec does not describe", () => {
    const r = report("card", { variant: "elevated", elevation: 3 })
    assert.ok(r.issues.some((i) => i.kind === "unknown_prop" && i.prop === "elevation"))
  })

  it("returns a structured error for an unknown component", () => {
    const result = validateUsage("tooltip", {})
    assert.equal(result.ok, false)
    if (!result.ok) assert.equal(result.error.code, "unknown_component")
  })
})
