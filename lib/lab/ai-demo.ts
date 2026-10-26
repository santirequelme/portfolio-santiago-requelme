// Data for the simulated MCP conversation and the before/after panel in
// "Use it with AI". No MCP server is involved: every "tool response" here is
// computed from the same registry core that serves /r, so the data is real
// even though the conversation is a demonstration.

import { getComponent, validateUsage, type RulesEntry, type UsageReport } from "@/lib/registry"
import { cardExampleFile } from "./stacks"

export const DEMO_TEXT = { title: "Notification settings", action: "Save changes" }

export interface ToolStep {
  tool: "get_rules" | "get_component" | "validate_usage"
  args: Record<string, unknown>
  /** A trimmed copy of the real response. */
  response: unknown
  /** Where the full response lives in the public registry, when there is one. */
  source?: string
}

function report(component: string, props: Record<string, unknown>): UsageReport {
  const result = validateUsage(component, props)
  if (!result.ok) throw new Error(result.error.message)
  return result.data
}

function componentExcerpt(id: "card" | "button", stack: "angular") {
  const result = getComponent(id, stack)
  if (!result.ok || !result.data.code) throw new Error(`No ${id} for ${stack}`)
  const { spec, tokens, code } = result.data
  const variant = spec.props.find((p) => p.name === "variant")
  return {
    name: spec.name,
    variants: spec.variants,
    default: { variant: variant?.default ?? null },
    tokens: tokens.slice(0, 4).map(({ path, value, css }) => ({ path, value, css })),
    "tokens (more)": `${tokens.length - 4} more`,
    accessibility: { role: spec.accessibility.role, labels: spec.accessibility.labels },
    files: [...code.files.map((f) => f.name), code.tokenFile.name, ...(code.example ? [code.example.name] : [])],
  }
}

// The agent's first draft of the save button, before it checks the spec.
export const DRAFT_BUTTON = { variant: "brand", children: "Save", style: { background: "#E23A0D", padding: "10px 16px" } }
export const FINAL_BUTTON = { variant: "primary", children: DEMO_TEXT.action }

export function toolSteps(rules: RulesEntry): ToolStep[] {
  return [
    {
      tool: "get_rules",
      args: {},
      response: {
        rules: rules.rules.map((r) => r.title),
        card: { keyboard: rules.components.card.accessibility.keyboard[1] },
        button: { labels: rules.components.button.accessibility.labels },
      },
      source: "/r/rules.json",
    },
    { tool: "get_component", args: { component: "card", stack: "angular" }, response: componentExcerpt("card", "angular"), source: "/r/card.json?stack=angular" },
    { tool: "get_component", args: { component: "button", stack: "angular" }, response: componentExcerpt("button", "angular"), source: "/r/button.json?stack=angular" },
    { tool: "validate_usage", args: { component: "button", props: DRAFT_BUTTON }, response: report("button", DRAFT_BUTTON) },
    { tool: "validate_usage", args: { component: "button", props: FINAL_BUTTON }, response: report("button", FINAL_BUTTON) },
  ]
}

/** The answer the agent would give: the registry's Angular Card example, with the requested text. */
export const finalAnswer = () => cardExampleFile("angular", undefined, DEMO_TEXT)

// ─── Before / after ─────────────────────────────────────────────────────────

/** Written by hand: a typical generic answer to the same request. */
export const WITHOUT_SYSTEM = `<!-- settings-card.component.html -->
<div class="card" style="background: #1e1e1e; border-radius: 12px; padding: 20px">
  <img src="cover.jpg" />
  <h3 style="color: #ffffff; font-size: 18px">${DEMO_TEXT.title}</h3>
  <input placeholder="Email" style="border: 1px solid #333333" />
  <div class="btn bg-blue-600" style="color: #ffffff; padding: 10px 16px" (click)="save()">
    Save
  </div>
</div>`

/** The same answer's button and input, as props, so validate_usage can check them. */
export const WITHOUT_PROPS = {
  button: { children: "Save", className: "btn bg-blue-600", style: { color: "#ffffff", padding: "10px 16px" } },
  input: { placeholder: "Email", style: { border: "1px solid #333333" } },
}

export function beforeAfterReports() {
  return {
    without: { button: report("button", WITHOUT_PROPS.button), input: report("input", WITHOUT_PROPS.input) },
    with: { button: report("button", FINAL_BUTTON) },
  }
}
