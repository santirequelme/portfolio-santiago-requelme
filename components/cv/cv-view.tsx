"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Download, Mail } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap"
import { Magnetic } from "@/components/motion/magnetic"
import { buttonClass, chipAccentClass } from "@/lib/ui"
import { ACHIEVEMENTS, ROLES, WORK, SKILLS, EDUCATION, LANGUAGES } from "@/lib/cv"

function SectionTitle({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="cv-section-title flex items-baseline gap-4 mb-12 md:mb-16">
      <span className="font-mono text-sm text-primary">{index}</span>
      <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight overflow-hidden">
        <span className="cv-title-inner inline-block">{children}</span>
      </h2>
      <span className="cv-title-line hidden md:block flex-1 h-px bg-border origin-left" />
    </div>
  )
}

export function CvView() {
  const { language, t } = useLanguage()
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        // ── Intro: name letters fall into place, then the rest cascades.
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(".cv-char", { yPercent: 120, rotate: 8, duration: 1, stagger: 0.035 })
          .from(".cv-intro-fade", { y: 24, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.6")

        // ── Achievements: cards rise in and each number counts from its
        // "before" value to its "after" value. The final value is what's in
        // the markup, so print and no-JS still show the real figure.
        gsap.utils.toArray<HTMLElement>(".cv-stat").forEach((card, i) => {
          const el = card.querySelector<HTMLElement>(".cv-stat-value")!
          const counter = { v: Number(el.dataset.from) }
          gsap
            .timeline({ scrollTrigger: { trigger: card, start: "top 88%" }, delay: (i % 3) * 0.12 })
            .from(card, { y: 50, opacity: 0, duration: 0.8, ease: "power3.out" })
            .to(
              counter,
              {
                v: Number(el.dataset.to),
                duration: 1.8,
                ease: "power2.out",
                onStart: () => {
                  el.textContent = String(counter.v)
                },
                onUpdate: () => {
                  el.textContent = String(Math.round(counter.v))
                },
              },
              0,
            )
            .from(card.querySelector(".cv-stat-bar"), { scaleX: 0, duration: 1.8, ease: "power2.out" }, 0)
        })

        // ── Section titles: text rises from its mask, rule draws across.
        gsap.utils.toArray<HTMLElement>(".cv-section-title").forEach((title) => {
          gsap
            .timeline({ scrollTrigger: { trigger: title, start: "top 85%" } })
            .from(title.querySelector(".cv-title-inner"), { yPercent: 110, duration: 0.9, ease: "power4.out" })
            .from(title.querySelector(".cv-title-line"), { scaleX: 0, duration: 1.2, ease: "power3.inOut" }, "<0.1")
        })

        // ── Timeline: the rail fills with scroll, each dot ignites as it's reached.
        gsap.fromTo(
          ".cv-rail-fill",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: ".cv-timeline", start: "top 60%", end: "bottom 60%", scrub: true },
          },
        )
        gsap.utils.toArray<HTMLElement>(".cv-role").forEach((role) => {
          // The dot stays lit once reached and only switches off when scrolling back above it.
          ScrollTrigger.create({
            trigger: role,
            start: "top 60%",
            onEnter: () => role.classList.add("is-active"),
            onLeaveBack: () => role.classList.remove("is-active"),
          })
          gsap
            .timeline({ scrollTrigger: { trigger: role, start: "top 80%" } })
            .from(role.querySelector(".cv-role-card"), { x: 80, opacity: 0, duration: 0.9, ease: "power3.out" })
            .from(role.querySelectorAll(".cv-highlight"), { x: 30, opacity: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }, "-=0.5")
            .from(role.querySelectorAll(".cv-chip"), { scale: 0, opacity: 0, duration: 0.4, stagger: 0.04, ease: "back.out(2)" }, "-=0.3")
        })

        // ── Skills marquee: two rows drifting in opposite directions,
        // nudged faster and skewed by scroll velocity.
        const rows = gsap.utils.toArray<HTMLElement>(".cv-marquee-track")
        const loops = rows.map((row, i) =>
          gsap.fromTo(
            row,
            { xPercent: i % 2 ? -50 : 0 },
            { xPercent: i % 2 ? 0 : -50, duration: 40, ease: "none", repeat: -1 },
          ),
        )
        const skewTo = gsap.quickTo(".cv-marquee-track", "skewX", { duration: 0.4, ease: "power3.out" })
        ScrollTrigger.create({
          trigger: ".cv-marquee",
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = self.getVelocity()
            loops.forEach((loop) => loop.timeScale(1 + Math.min(Math.abs(v) / 300, 4)))
            skewTo(gsap.utils.clamp(-8, 8, v / -200))
          },
          onLeave: () => loops.forEach((loop) => loop.timeScale(1)),
        })
        const settle = () => {
          loops.forEach((loop) => gsap.to(loop, { timeScale: 1, duration: 0.8, overwrite: true }))
          skewTo(0)
        }
        ScrollTrigger.addEventListener("scrollEnd", settle)

        // ── Education / languages / CTA.
        gsap.from(".cv-edu-card", {
          y: 60,
          opacity: 0,
          rotateX: -20,
          transformPerspective: 800,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".cv-edu", start: "top 80%" },
        })
        gsap.from(".cv-cta-word", {
          yPercent: 110,
          duration: 1,
          stagger: 0.06,
          ease: "power4.out",
          scrollTrigger: { trigger: ".cv-cta", start: "top 80%" },
        })

        return () => ScrollTrigger.removeEventListener("scrollEnd", settle)
      })

      // ── Selected work: pinned section that scrolls horizontally (desktop only).
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const track = document.querySelector<HTMLElement>(".cv-work-track")
        if (!track) return
        const distance = () => track.scrollWidth - window.innerWidth
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".cv-work",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            refreshPriority: 1,
            invalidateOnRefresh: true,
          },
        })
        // Each card tilts and scales slightly as it passes the centre.
        gsap.utils.toArray<HTMLElement>(".cv-work-card").forEach((card) => {
          gsap.fromTo(
            card,
            { rotateY: -18, scale: 0.88, opacity: 0.5 },
            {
              rotateY: 0,
              scale: 1,
              opacity: 1,
              ease: "power1.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: "left right",
                end: "center center",
                scrub: true,
              },
            },
          )
        })
        gsap.to(".cv-work-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: ".cv-work", start: "top top", end: () => `+=${distance()}`, scrub: true },
        })
      })

      // The pinned section adds scroll distance; make sure triggers below it
      // are measured after it.
      ScrollTrigger.sort()
      ScrollTrigger.refresh()

      return () => mm.revert()
    },
    { scope: rootRef },
  )

  const name = "Santiago Requelme"

  return (
    <div ref={rootRef} className="relative z-10">
      {/* ── Intro ─────────────────────────────────────────────── */}
      <header className="mx-auto max-w-6xl px-4 pt-32 md:pt-44 pb-20">
        <p className="cv-intro-fade text-xs font-semibold uppercase tracking-[0.25em] text-primary">{t("cv.eyebrow")}</p>
        <h1
          aria-label={name}
          className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1]"
        >
          {name.split(" ").map((word) => (
            <span key={word} aria-hidden="true" className="block overflow-hidden pb-2">
              {word.split("").map((char, i) => (
                <span key={i} className="cv-char inline-block">
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p className="cv-intro-fade mt-8 text-2xl md:text-3xl font-semibold text-primary">
          {t("cv.role")}
        </p>
        <p className="cv-intro-fade mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
          {t("cv.summary")}
        </p>
        <div className="cv-intro-fade mt-10 flex flex-wrap items-center gap-4 print:hidden">
          <Magnetic>
            <button
              type="button"
              onClick={() => window.print()}
              className={buttonClass("primary", "lg")}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {t("cv.download")}
            </button>
          </Magnetic>
          <a
            href="https://www.linkedin.com/in/santiago-requelme/"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("secondary", "lg")}
          >
            LinkedIn
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </a>
        </div>

      </header>

      {/* ── Key achievements ──────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-24" aria-labelledby="cv-achievements">
        <SectionTitle index="01">
          <span id="cv-achievements">{t("cv.achievements")}</span>
        </SectionTitle>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a) => (
            <li
              key={a.label.en}
              className="cv-stat group relative overflow-hidden rounded-card border border-border bg-card/70 p-8 transition-colors duration-300 hover:border-foreground/25"
            >
              <p className="font-display text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                {a.from > 0 && (
                  <span className="mr-3 text-2xl md:text-3xl font-semibold text-muted-foreground line-through decoration-primary/60">
                    {a.from}
                  </span>
                )}
                <span className="text-primary">{a.prefix}</span>
                <span className="cv-stat-value tabular-nums" data-from={a.from} data-to={a.to}>
                  {a.to}
                </span>
                <span className="text-primary">{a.suffix}</span>
              </p>
              <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">{a.label[language]}</p>
              <span
                aria-hidden="true"
                className="cv-stat-bar absolute bottom-0 left-0 h-[2px] w-full origin-left bg-primary"
              />
            </li>
          ))}
        </ul>
      </section>

      {/* ── Experience timeline ───────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-24 overflow-x-clip" aria-labelledby="cv-experience">
        <SectionTitle index="02">
          <span id="cv-experience">{t("cv.experience")}</span>
        </SectionTitle>

        <ol className="cv-timeline relative space-y-16 md:space-y-24 pl-10 md:pl-16">
          {/* Rail */}
          <span aria-hidden="true" className="absolute left-3 md:left-5 top-2 bottom-2 w-px bg-border/60" />
          <span
            aria-hidden="true"
            className="cv-rail-fill absolute left-3 md:left-5 top-2 bottom-2 w-px origin-top bg-primary"
          />

          {ROLES.map((role) => (
            <li key={role.company} className="cv-role group relative">
              <span
                aria-hidden="true"
                className="absolute -left-10 md:-left-16 top-2 ml-[5px] md:ml-[13px] h-3.5 w-3.5 rotate-45 rounded-[2px] border-2 border-border bg-background transition-all duration-500 group-[.is-active]:border-primary group-[.is-active]:bg-primary group-[.is-active]:shadow-[0_0_0_6px_oklch(0.68_0.2_38/0.2),0_0_24px_oklch(0.68_0.2_38/0.6)]"
              />
              <article className="cv-role-card rounded-card border border-border bg-card/70 p-6 md:p-10 backdrop-blur-sm transition-colors duration-500 group-[.is-active]:border-primary/30">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">{role.title[language]}</h3>
                  {role.period[language] && (
                    <span className="font-mono text-sm text-muted-foreground">{role.period[language]}</span>
                  )}
                </div>
                <p className="mt-1 text-lg font-medium text-primary">
                  {role.url ? (
                    <a href={role.url} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
                      {role.company}
                    </a>
                  ) : (
                    role.company
                  )}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{role.meta[language]}</p>
                <ul className="mt-6 space-y-3">
                  {role.highlights[language].map((h) => (
                    <li key={h} className="cv-highlight flex gap-3 text-foreground/90">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-[1px] bg-primary" />
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
                <ul className="mt-8 flex flex-wrap gap-2" aria-label="Stack">
                  {role.stack.map((s) => (
                    <li
                      key={s}
                      className={`cv-chip ${chipAccentClass}`}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Selected work: horizontal pinned scroll ───────────── */}
      <section className="cv-work relative overflow-hidden py-24 md:py-0 md:h-screen md:flex md:flex-col md:justify-center print:hidden">
        <div className="mx-auto w-full max-w-6xl px-4">
          <SectionTitle index="03">{t("cv.work")}</SectionTitle>
        </div>
        <div className="cv-work-track flex gap-6 md:gap-10 px-4 md:px-[max(1rem,calc((100vw-72rem)/2+1rem))] overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-4 [perspective:1200px]">
          {WORK.map((w) => {
            const internal = w.url.startsWith("/")
            return (
              <Link
                key={w.title}
                href={w.url}
                target={internal ? undefined : "_blank"}
                rel={internal ? undefined : "noopener noreferrer"}
                className="cv-work-card group relative flex-shrink-0 w-[80vw] md:w-[38vw] lg:w-[30vw] snap-center rounded-card border border-border bg-card/80 p-1.5"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-inner bg-secondary">
                  <Image
                    src={w.image}
                    alt={w.title}
                    fill
                    sizes="(max-width: 768px) 80vw, 38vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 rounded-tag bg-black/50 px-2 py-1 font-mono text-[11px] uppercase tracking-wide text-white backdrop-blur">
                    {w.tag[language]}
                  </span>
                </div>
                <div className="flex items-center justify-between p-5">
                  <h3 className="text-lg font-semibold text-foreground">{w.title}</h3>
                  <ArrowUpRight
                    className="h-5 w-5 text-primary transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            )
          })}
        </div>
        <div className="mx-auto mt-10 hidden md:flex w-full max-w-6xl items-center gap-4 px-4">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("cv.workHint")}</span>
          <span className="relative h-px flex-1 bg-border/60">
            <span className="cv-work-progress absolute inset-0 origin-left scale-x-0 bg-primary" />
          </span>
        </div>
      </section>

      {/* ── Skills marquee ────────────────────────────────────── */}
      <section className="cv-marquee py-24 overflow-hidden" aria-labelledby="cv-skills">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle index="04">
            <span id="cv-skills">{t("cv.skills")}</span>
          </SectionTitle>
        </div>
        {/* Screen readers and print get a plain list; the marquee is decorative. */}
        <ul className="sr-only print:not-sr-only print:flex print:flex-wrap print:gap-2 print:px-4">
          {SKILLS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div aria-hidden="true" className="space-y-4 print:hidden">
          {[SKILLS.slice(0, 13), SKILLS.slice(13)].map((row, i) => (
            <div key={i} className="flex w-max cv-marquee-track will-change-transform">
              {[...row, ...row].map((s, j) => (
                <span
                  key={`${s}-${j}`}
                  className={`mx-2 whitespace-nowrap rounded-control border px-6 py-3 font-display text-2xl md:text-4xl font-bold transition-colors ${
                    (j + i) % 3 === 0
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border bg-card/70 text-foreground/80 hover:text-primary"
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Education & languages ─────────────────────────────── */}
      <section className="cv-edu mx-auto max-w-6xl px-4 py-24 grid gap-6 md:grid-cols-2 overflow-x-clip" aria-label={t("cv.education")}>
        <div className="cv-edu-card rounded-card border border-border bg-card/70 p-8 md:p-10">
          <p className="font-mono text-sm text-primary">05</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">{t("cv.education")}</h2>
          <ul className="mt-6 space-y-5">
            {EDUCATION.map((e) => (
              <li key={e.school} className="border-b border-border/40 pb-4 last:border-0">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="min-w-0 text-lg font-semibold text-foreground">{e.title[language]}</p>
                  <span className="flex-shrink-0 font-mono text-sm text-muted-foreground">{e.period}</span>
                </div>
                <p className="mt-1 text-muted-foreground">{e.school}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="cv-edu-card rounded-card border border-border bg-card/70 p-8 md:p-10">
          <p className="font-mono text-sm text-primary">06</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">{t("cv.languages")}</h2>
          <ul className="mt-6 space-y-4">
            {LANGUAGES.map((l) => (
              <li key={l.name.en} className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-lg font-semibold text-foreground">{l.name[language]}</span>
                <span className="text-muted-foreground">{l.level[language]}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="cv-cta mx-auto max-w-6xl px-4 pt-12 pb-32 text-center print:hidden">
        <h2
          aria-label={t("cv.ctaTitle")}
          className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          {t("cv.ctaTitle")
            .split(" ")
            .map((word, i) => (
              <span key={`${word}-${i}`} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-2">
                <span className="cv-cta-word inline-block">{word}&nbsp;</span>
              </span>
            ))}
        </h2>
        <div className="mt-12 flex justify-center">
          <Magnetic strength={0.4}>
            <a
              href="mailto:santireke37@gmail.com"
              className={buttonClass("primary", "lg", "px-8")}
            >
              <Mail className="h-5 w-5" aria-hidden="true" />
              {t("cv.ctaButton")}
            </a>
          </Magnetic>
        </div>
      </section>
    </div>
  )
}
