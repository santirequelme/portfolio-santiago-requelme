// Reads AGENTS.md from the repo root. Server only: used at build time by
// /r/rules.json and the /lab page, and by the tests.

import fs from "node:fs"
import path from "node:path"

export function readAgentsGuide() {
  return fs.readFileSync(path.join(process.cwd(), "AGENTS.md"), "utf8")
}
