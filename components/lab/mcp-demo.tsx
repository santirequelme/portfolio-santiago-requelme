"use client"

import { useId, useMemo, useState } from "react"
import { Bot, ChevronLeft, ChevronRight, UserRound } from "lucide-react"
import { finalAnswer, toolSteps } from "@/lib/lab/ai-demo"
import { MCP_CONFIG, type AiCopy } from "@/lib/lab/ai-copy"
import type { LabCopy } from "@/lib/lab/content"
import type { RulesEntry } from "@/lib/registry"
import { cn } from "@/lib/utils"
import { Badge } from "./badge"
import { CodeLines, CopyButton } from "./code-block"

type Copy = AiCopy["mcp"]

const panel = "overflow-hidden rounded-card border border-border bg-[var(--lab-editor)]"
const header = "flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2"
const label = "font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground"

/** A scripted MCP session. No server is called: the tool responses come from lib/registry. */
export function McpDemo({ copy, codeLabels, rules }: { copy: Copy; codeLabels: LabCopy["code"]; rules: RulesEntry }) {
  const tools = useMemo(() => toolSteps(rules), [rules])
  const answer = useMemo(() => finalAnswer(), [])
  const total = tools.length + 2 // prompt, tool calls, answer
  const [step, setStep] = useState(0)
  const baseId = useId()

  const tabLabel = (i: number) => (i === 0 ? copy.developer : i === total - 1 ? copy.answer : tools[i - 1].tool)
  const go = (i: number) => setStep(Math.max(0, Math.min(total - 1, i)))

  return (
    <section aria-labelledby={`${baseId}-title`} className="space-y-4 rounded-card border border-dashed border-[var(--lab-violet)]/50 p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <h3 id={`${baseId}-title`} className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">
          {copy.title}
        </h3>
        <Badge tone="illustrative">{copy.badge}</Badge>
      </div>

      {/* 1. Example config */}
      <div className={panel}>
        <div className={header}>
          <span className="flex items-center gap-2">
            <span className={label}>{copy.configLabel}</span>
            <Badge tone="illustrative">{copy.example}</Badge>
          </span>
          <CopyButton text={MCP_CONFIG} labels={codeLabels} />
        </div>
        <p className="border-b border-border px-4 py-2 text-xs text-muted-foreground">{copy.configNote}</p>
        <div className="overflow-x-auto">
          <CodeLines code={MCP_CONFIG} />
        </div>
      </div>

      {/* 2. Guided conversation */}
      <div className={panel}>
        <div className={header}>
          <span className={label}>{copy.conversation}</span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {copy.step} {step + 1}/{total}
          </span>
        </div>
        <p className="border-b border-border px-4 py-2 text-xs text-muted-foreground">{copy.conversationNote}</p>

        <div role="tablist" aria-label={copy.steps} className="flex gap-1 overflow-x-auto border-b border-border px-2 py-1.5">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              id={`${baseId}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={i === step}
              aria-controls={`${baseId}-panel`}
              tabIndex={i === step ? 0 : -1}
              onClick={() => go(i)}
              onKeyDown={(e) => {
                const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? total - 1 : -1
                if (next < 0 || next >= total) return
                e.preventDefault()
                go(next)
                document.getElementById(`${baseId}-tab-${next}`)?.focus()
              }}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-[6px] px-2.5 py-1 font-mono text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
                i === step ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {i + 1} · {tabLabel(i)}
            </button>
          ))}
        </div>

        <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${step}`} className="space-y-3 p-4">
          {step === 0 && (
            <div className="flex gap-3">
              <Avatar who="developer" label={copy.developer} />
              <div className="min-w-0 flex-1 rounded-inner border border-border bg-card p-3">
                <p className="text-sm leading-relaxed text-foreground">{copy.prompt}</p>
                <div className="mt-2 flex justify-end">
                  <CopyButton text={copy.prompt} labels={codeLabels} />
                </div>
              </div>
            </div>
          )}

          {step > 0 && step < total - 1 && (
            <ToolCall copy={copy} index={step - 1} step={tools[step - 1]} />
          )}

          {step === total - 1 && (
            <div className="flex gap-3">
              <Avatar who="agent" label={copy.agent} />
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-sm leading-relaxed text-foreground/90">{copy.notes[copy.notes.length - 1]}</p>
                <div className="overflow-hidden rounded-inner border border-border">
                  <p className="flex items-center justify-between gap-2 border-b border-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
                    {answer.name}
                    <CopyButton text={answer.code} labels={codeLabels} />
                  </p>
                  <div className="max-h-80 overflow-auto">
                    <CodeLines code={answer.code} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between gap-2 pt-1">
            <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className={navButton}>
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
              {copy.prev}
            </button>
            <button type="button" onClick={() => go(step + 1)} disabled={step === total - 1} className={navButton}>
              {copy.next}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

const navButton =
  "inline-flex h-8 items-center gap-1 rounded-control border border-border px-3 font-mono text-[11px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"

function Avatar({ who, label: text }: { who: "developer" | "agent"; label: string }) {
  const Icon = who === "developer" ? UserRound : Bot
  return (
    <span className="flex w-16 shrink-0 flex-col items-center gap-1 pt-1">
      <span
        aria-hidden="true"
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border",
          who === "developer" ? "border-border bg-card text-foreground" : "border-[var(--lab-violet)]/50 bg-[var(--lab-violet)]/15 text-[var(--lab-violet)]",
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="font-mono text-[10px] text-muted-foreground">{text}</span>
    </span>
  )
}

function ToolCall({ copy, index, step }: { copy: Copy; index: number; step: ReturnType<typeof toolSteps>[number] }) {
  const call = `${step.tool}(${Object.keys(step.args).length ? JSON.stringify(step.args) : ""})`
  const response = JSON.stringify(step.response, null, 2)
  return (
    <div className="flex gap-3">
      <Avatar who="agent" label={copy.agent} />
      <div className="min-w-0 flex-1 space-y-2">
        <p className="text-sm leading-relaxed text-foreground/90">{copy.notes[index]}</p>
        <p className="overflow-x-auto whitespace-nowrap rounded-inner border border-border bg-card px-3 py-2 font-mono text-[12px]">
          <span className="text-muted-foreground">{copy.calls} </span>
          <span className="text-[var(--lab-violet)]">{call}</span>
        </p>
        <div className="overflow-hidden rounded-inner border border-border">
          <p className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
            <span>{copy.returns}</span>
            {step.source && (
              <span>
                {copy.excerpt}{" "}
                <a href={step.source} target="_blank" rel="noreferrer" className="text-foreground underline-offset-4 hover:underline">
                  {step.source}
                </a>
              </span>
            )}
          </p>
          <div className="max-h-80 overflow-auto">
            <CodeLines code={response} />
          </div>
        </div>
      </div>
    </div>
  )
}
