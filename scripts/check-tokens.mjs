// Verifies that lib/lab/token-outputs.ts (what the lab renders live) matches
// what Style Dictionary really generates, for the source tokens and for a
// couple of edited copies (primary colour and radius changed).
// Run with `pnpm tokens:check` (Node 22.6+ runs the .ts file directly).

import fs from "node:fs"
import StyleDictionary from "style-dictionary"
import { platforms } from "./tokens.config.mjs"
import { TOKEN_FILES, flattenTokens } from "../lib/lab/token-outputs.ts"

const source = JSON.parse(fs.readFileSync("tokens/lab.tokens.json", "utf8"))

function edited(primary, radius) {
  const copy = structuredClone(source)
  copy.color.primary.$value = primary
  for (const key of Object.keys(copy.radius)) copy.radius[key].$value = radius
  return copy
}

const cases = [
  ["source tokens", source],
  ["violet primary, 0.75rem radius", edited("#7C5CFC", "0.75rem")],
  ["green primary, 0rem radius", edited("#16A361", "0rem")],
]

let failed = 0
for (const [label, tokens] of cases) {
  const sd = new StyleDictionary({ tokens, usesDtcg: true, platforms, log: { verbosity: "silent" } })
  for (const id of Object.keys(TOKEN_FILES)) {
    const [{ output }] = await sd.formatPlatform(id)
    const mirror = TOKEN_FILES[id].format(flattenTokens(tokens))
    const ok = output === mirror
    if (!ok) failed++
    console.log(`${ok ? "ok  " : "FAIL"} ${TOKEN_FILES[id].name.padEnd(13)} ${label}`)
    if (!ok) console.log(`--- style dictionary\n${output}\n--- lab\n${mirror}`)
  }
}

if (failed) {
  console.error(`\n${failed} file(s) differ. Update lib/lab/token-outputs.ts to match Style Dictionary.`)
  process.exit(1)
}
console.log("\nThe lab's live token files match Style Dictionary.")
