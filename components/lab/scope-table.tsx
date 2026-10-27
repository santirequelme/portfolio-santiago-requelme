import { flatTokens, SOURCE_TOKENS } from "@/lib/lab/stack-tokens"
import type { StacksCopy } from "@/lib/lab/stacks-copy"
import { platformValue } from "@/lib/lab/token-outputs"

const UNITS = { web: "px", ios: "pt", android: "dp" } as const
const PLATFORMS = Object.keys(UNITS) as (keyof typeof UNITS)[]
const LABELS = { web: "Web", ios: "iOS", android: "Android" }

/** Which tokens are shared and which follow each platform, read from tokens/lab.tokens.json. */
export function ScopeTable({ copy }: { copy: StacksCopy["scope"] }) {
  const tokens = flatTokens(SOURCE_TOKENS)
  const shared = new Map<string, string[]>()
  for (const t of tokens.filter((t) => t.scope !== "platform")) {
    const [group, ...rest] = t.path
    shared.set(group, [...(shared.get(group) ?? []), rest.join(".")])
  }
  const local = tokens.filter((t) => t.scope === "platform")
  const cell = "px-3 py-2 align-top"

  return (
    <section aria-labelledby="scope-title" className="overflow-hidden rounded-card border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 id="scope-title" className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">
          {copy.title}
        </h3>
        <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-muted-foreground">{copy.note}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left font-mono text-[11.5px]">
          <thead className="text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground">
            <tr className="border-b border-border">
              <th scope="col" className={cell}>{copy.tokens}</th>
              <th scope="col" className={cell}>{copy.scope}</th>
              <th scope="col" className={cell}>{copy.value}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[...shared].map(([group, names]) => (
              <tr key={group}>
                <th scope="row" className={`${cell} break-words font-normal text-foreground`}>
                  {group}.{names.length > 1 ? `{${names.join(", ")}}` : names[0]}
                </th>
                <td className={`${cell} text-muted-foreground`}>{copy.shared}</td>
                <td className={`${cell} font-sans text-xs text-muted-foreground`}>{copy.same}</td>
              </tr>
            ))}
            {local.map((t) => (
              <tr key={t.path.join(".")} className="bg-[var(--lab-violet)]/[0.06]">
                <th scope="row" className={`${cell} font-normal text-foreground`}>{t.path.join(".")}</th>
                <td className={`${cell} text-[var(--lab-violet)]`}>{copy.platform}</td>
                <td className={cell}>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {PLATFORMS.map((p) => (
                      <li key={p} className="whitespace-nowrap">
                        <span className="text-muted-foreground">{LABELS[p]} </span>
                        <span className="text-foreground">
                          {Number.parseFloat(platformValue(t, p)) * 16}
                          {UNITS[p]}
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-border px-4 py-2 font-mono text-[10.5px] text-muted-foreground">{copy.file}</p>
    </section>
  )
}
