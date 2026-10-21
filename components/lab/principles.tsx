import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LabCopy } from "@/lib/lab/content"

export function Principles({ copy }: { copy: LabCopy["principles"] }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {copy.items.map((p, i) => (
        <li
          key={p.title}
          className={cn(
            "flex flex-col gap-3 bg-card p-5 md:p-6",
            // Seven items: the last one closes the final row at every breakpoint.
            i === copy.items.length - 1 && "sm:col-span-2 lg:col-span-3",
          )}
        >
          <span className="font-mono text-[11px] text-[var(--lab-violet)]">P{String(i + 1).padStart(2, "0")}</span>
          <h3 className="text-base font-semibold leading-snug font-sans">{p.title}</h3>
          <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
          <a
            href={p.link.href}
            className="group inline-flex w-fit items-center gap-1 rounded-tag text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {p.link.label}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  )
}
