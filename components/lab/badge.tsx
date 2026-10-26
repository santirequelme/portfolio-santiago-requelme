import { cn } from "@/lib/utils"

/** "Live" marks what really works (the registry); "illustrative" marks the simulated parts. */
export function Badge({ tone, children }: { tone: "live" | "illustrative"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-tag border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]",
        tone === "live"
          ? "border-[var(--lab-green)]/40 bg-[var(--lab-green)]/10 text-[var(--lab-green)]"
          : "border-dashed border-[var(--lab-violet)]/60 bg-[var(--lab-violet)]/10 text-[var(--lab-violet)]",
      )}
    >
      {tone === "live" && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
