// Checks the design system's own values: contrast pairs from the specs, touch
// targets per platform and token scope. Runs before every build
// (`pnpm build`), and alone with `pnpm tokens:audit`. Exits with code 1 if any
// check fails, so a wrong token stops the deploy instead of shipping.

import { auditPlayground, auditTokens, type AuditCheck } from "@/lib/lab/audit"
import { flatTokens, SOURCE_TOKENS } from "@/lib/lab/stack-tokens"

function report(title: string, checks: AuditCheck[]) {
  console.log(`\n${title}`)
  for (const c of checks) console.log(`${c.pass ? "  ✓" : "  ✗"} ${c.label}: ${c.detail}`)
  return checks.filter((c) => !c.pass).length
}

const failed =
  report("tokens/lab.tokens.json", auditTokens(flatTokens(SOURCE_TOKENS))) +
  report("Playground recipes (lib/lab/playground.ts)", auditPlayground())

if (failed) {
  console.error(`\n${failed} check(s) failed. Fix the token values (or the spec's contrastChecks) before building.`)
  process.exit(1)
}
console.log("\nEvery token passes its contrast, touch target and scope checks.")
