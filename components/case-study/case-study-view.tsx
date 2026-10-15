"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getCaseStudy } from "@/lib/case-studies"
import { CaseStudyDemo } from "./demos"
import { buttonClass, chipClass } from "@/lib/ui"

const enter = "animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out fill-mode-both motion-reduce:animate-none"

export function CaseStudyView({ slug }: { slug: string }) {
  const { language, t } = useLanguage()
  const study = getCaseStudy(slug)
  if (!study) return null
  const c = study.content[language]

  return (
    <article className="relative z-10 mx-auto max-w-5xl px-4 pt-28 md:pt-40 pb-24">
      <Link
        href="/#projectList"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("case.back")}
      </Link>

      <header className={`${enter} mt-8`}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t("case.eyebrow")}</p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
          {c.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">{c.summary}</p>

        <dl className="mt-10 grid gap-6 border-t border-border/40 pt-6 sm:grid-cols-3">
          {c.meta.map((m) => (
            <div key={m.label}>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">{m.label}</dt>
              <dd className="mt-1 text-sm md:text-base text-foreground">{m.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <p className="sr-only">{t("case.stack")}</p>
          <ul className="flex flex-wrap gap-2">
            {study.stack.map((s) => (
              <li key={s} className={chipClass}>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className={`${enter} delay-150 mt-14 overflow-hidden rounded-card border border-border`}>
        <Image src={study.cover} alt="" width={1200} height={675} priority className="h-auto w-full" />
      </div>

      <section className="mt-20 grid gap-6 md:grid-cols-[1fr_2fr]">
        <h2 className="font-display text-2xl md:text-3xl font-bold">{c.challenge.title}</h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{c.challenge.body}</p>
      </section>

      <section className="mt-20">
        <h2 className="font-display text-2xl md:text-3xl font-bold">{c.built.title}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {c.built.items.map((item) => (
            <div key={item.title} className="rounded-card border border-border bg-card/70 p-6">
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="font-display text-2xl md:text-3xl font-bold">{c.decisions.title}</h2>
        <ol className="mt-8 space-y-6">
          {c.decisions.items.map((item, i) => (
            <li
              key={item.title}
              className="grid gap-6 rounded-card border border-border bg-card/70 p-6 md:p-8 lg:grid-cols-2 lg:items-start"
            >
              <div>
                <p className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-xl md:text-2xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
              {item.demo && <CaseStudyDemo id={item.demo} />}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-20 rounded-panel border border-border bg-card/70 p-6 md:p-10">
        <h2 className="font-display text-2xl md:text-3xl font-bold">{c.outcome.title}</h2>
        <p className="mt-4 max-w-3xl text-base md:text-lg text-muted-foreground leading-relaxed">{c.outcome.body}</p>
      </section>

      <nav className="mt-16 flex flex-col gap-4 border-t border-border/40 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/design-system"
          className="group inline-flex flex-col rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{t("case.next")}</span>
          <span className="mt-1 inline-flex items-center gap-1 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
            {t("projects.design-system.title")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </Link>
        <a
          href="https://www.linkedin.com/in/santiago-requelme/"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("primary", "lg")}
        >
          {t("about.workWithMe")}
        </a>
      </nav>
    </article>
  )
}
