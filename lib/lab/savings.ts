// The numbers behind "What it saves" in the lab. Server only: measured once at
// build time from the registry and the source files, never typed by hand.

import fs from "node:fs"
import path from "node:path"
import { getComponent } from "@/lib/registry"
import { beforeAfterReports } from "./ai-demo"

/** What an agent would read to build the same thing without the registry. */
export const SOURCE_FILES = [
  "AGENTS.md",
  "tokens/lab.tokens.json",
  "specs/card.spec.json",
  "specs/button.spec.json",
  "lib/lab/stacks.ts",
  "lib/lab/component-css.ts",
  "lib/lab/templates/shared.ts",
  "lib/lab/templates/card.ts",
  "lib/lab/templates/button.ts",
]

export interface Savings {
  /** Bytes of the registry answers for the Angular Card and Button. */
  registryBytes: number
  sourceBytes: number
  sourceFiles: string[]
  cardLines: number
  cssLines: number
  caught: number
}

const lines = (code: string) => code.trimEnd().split("\n").length

export function measureSavings(): Savings {
  const entries = (["card", "button"] as const).map((id) => {
    const result = getComponent(id, "angular")
    if (!result.ok || !result.data.code) throw new Error(`No ${id} for angular`)
    return result.data
  })
  const card = entries[0].code
  const file = (name: string) => card?.files.find((f) => f.name === name)?.code ?? ""
  const reports = beforeAfterReports().without
  return {
    registryBytes: entries.reduce((sum, entry) => sum + JSON.stringify(entry).length, 0),
    sourceBytes: SOURCE_FILES.reduce((sum, f) => sum + fs.statSync(path.join(process.cwd(), f)).size, 0),
    sourceFiles: SOURCE_FILES,
    cardLines: lines(file("card.component.ts")),
    cssLines: lines(file("card.css")),
    caught: [reports.button, reports.input].reduce((sum, r) => sum + r.issues.filter((i) => i.severity === "error").length, 0),
  }
}
