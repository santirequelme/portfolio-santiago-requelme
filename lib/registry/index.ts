// The design-system registry: one typed core, read by the public JSON routes
// under /r and by the lab's "Use it with AI" demo. It only reads the sources
// of truth: tokens/lab.tokens.json, specs/*.spec.json, lib/lab/templates and
// AGENTS.md. Nothing here is written or stored.

import { auditPlayground, auditTokens } from "@/lib/lab/audit"
import { SPECS } from "@/lib/lab/specs"
import { platformValue } from "@/lib/lab/token-outputs"
import { cardExampleFile, componentFiles, STACKS, tokenFile } from "@/lib/lab/stacks"
import { BASE_PATH, COMPONENT_IDS, parseComponent, parseStack, STACK_IDS } from "./parse"
import { camelName, cssVarName, flatTokens, SOURCE_TOKENS } from "@/lib/lab/stack-tokens"
import type { ComponentEntry, ComponentSummary, ResolvedToken, Result, RulesEntry, StackId } from "./types"

export * from "./types"
export { validateUsage } from "./validate"

export { BASE_PATH, COMPONENT_IDS, parseComponent, parseStack, STACK_IDS } from "./parse"

// ─── Tokens ─────────────────────────────────────────────────────────────────

export function resolvedTokens(): ResolvedToken[] {
  return flatTokens(SOURCE_TOKENS).map((t) => ({
    path: t.path.join("."),
    type: t.type,
    value: t.value,
    ...(t.description ? { description: t.description } : {}),
    css: `var(${cssVarName(t.path)})`,
    swift: `Tokens.${camelName(t.path)}`,
    kotlin: `Tokens.${camelName(t.path)}`,
    scope: t.scope ?? "shared",
    ...(t.scope === "platform"
      ? { platforms: { web: platformValue(t, "web"), ios: platformValue(t, "ios"), android: platformValue(t, "android") } }
      : {}),
  }))
}

/** The audit that gates every build (lib/lab/audit.ts), on the source tokens. */
export function getAudit() {
  const checks = [...auditTokens(flatTokens(SOURCE_TOKENS)), ...auditPlayground()]
  return { command: "pnpm tokens:audit", passed: checks.filter((c) => c.pass).length, failed: checks.filter((c) => !c.pass).length, checks }
}

export function getTokens() {
  return {
    source: "tokens/lab.tokens.json",
    format: "W3C Design Tokens (DTCG)",
    tokens: SOURCE_TOKENS,
    flat: resolvedTokens(),
    audit: getAudit(),
    files: {
      css: tokenFile("css", SOURCE_TOKENS),
      swift: tokenFile("swift", SOURCE_TOKENS),
      kotlin: tokenFile("kotlin", SOURCE_TOKENS),
    },
  }
}

// ─── Components ─────────────────────────────────────────────────────────────

export function listComponents(): { components: ComponentSummary[]; stacks: { id: StackId; label: string }[] } {
  return {
    components: COMPONENT_IDS.map((id) => {
      const spec = SPECS[id]
      return {
        id,
        name: spec.name,
        description: spec.description,
        variants: spec.variants,
        sizes: spec.sizes,
        stacks: [...STACK_IDS],
        href: `${BASE_PATH}/${id}.json`,
      }
    }),
    stacks: STACKS.map(({ id, label }) => ({ id, label })),
  }
}

/** One component: its spec, the tokens it uses and, when a stack is given, its code. */
export function getComponent(component: unknown, stack?: unknown): Result<ComponentEntry> {
  const parsed = parseComponent(component)
  if (!parsed.ok) return parsed
  const id = parsed.data
  const spec = SPECS[id]

  let code: ComponentEntry["code"] = null
  if (stack !== undefined && stack !== null && stack !== "") {
    const s = parseStack(stack)
    if (!s.ok) return s
    const def = STACKS.find((x) => x.id === s.data) ?? STACKS[0]
    code = {
      stack: s.data,
      files: componentFiles(id, s.data),
      tokenFile: tokenFile(def.tokenFile, SOURCE_TOKENS),
      ...(id === "card" ? { example: cardExampleFile(s.data) } : {}),
    }
  }

  const byPath = new Map(resolvedTokens().map((t) => [t.path, t]))
  const tokens = spec.tokens.map(({ path, usage }) => {
    const token = byPath.get(path)
    if (!token) throw new Error(`${spec.name} spec uses "${path}", which is not in tokens/lab.tokens.json`)
    return { ...token, usage }
  })

  return { ok: true, data: { id, name: spec.name, description: spec.description, stacks: [...STACK_IDS], spec, tokens, code } }
}

// ─── Rules ──────────────────────────────────────────────────────────────────

const plain = (md: string) => md.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1").trim()

/** The agent rules: AGENTS.md (passed in as text) plus the rules in each spec. */
export function getRules(agentsGuide: string): RulesEntry {
  const section = agentsGuide.split(/^## /m).find((s) => s.startsWith("Rules")) ?? ""
  const rules = [...section.matchAll(/^(\d+)\.\s+(.+)$/gm)].map(([, n, line]) => {
    const title = /\*\*(.+?)\*\*/.exec(line)?.[1] ?? line
    return { id: `rule-${n}`, title: plain(title), text: plain(line) }
  })
  const components = Object.fromEntries(
    COMPONENT_IDS.map((id) => [id, { accessibility: SPECS[id].accessibility, whenNotToUse: SPECS[id].whenNotToUse }]),
  ) as RulesEntry["components"]
  return { source: "AGENTS.md", guide: agentsGuide, rules, components }
}
