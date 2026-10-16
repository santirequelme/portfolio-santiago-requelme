"use client"

import { useRef } from "react"
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap"
import { cn } from "@/lib/utils"

// Two rows of skills drifting in opposite directions; scroll velocity speeds
// them up and skews them slightly, then they settle when scrolling stops.
// Screen readers and print get a plain list — the moving rows are decorative.
export function SkillsMarquee({ skills, className }: { skills: string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const half = Math.ceil(skills.length / 2)
  const rows = [skills.slice(0, half), skills.slice(half)]

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const tracks = gsap.utils.toArray<HTMLElement>(".marquee-track")
        const loops = tracks.map((track, i) =>
          gsap.fromTo(
            track,
            { xPercent: i % 2 ? -50 : 0 },
            { xPercent: i % 2 ? 0 : -50, duration: 40, ease: "none", repeat: -1 },
          ),
        )
        const skewTo = gsap.quickTo(tracks, "skewX", { duration: 0.4, ease: "power3.out" })

        gsap.from(tracks, {
          opacity: 0,
          y: 24,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        })

        ScrollTrigger.create({
          trigger: ref.current,
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
        return () => ScrollTrigger.removeEventListener("scrollEnd", settle)
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <ul className="sr-only print:not-sr-only print:flex print:flex-wrap print:gap-2 print:px-4">
        {skills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <div aria-hidden="true" className="space-y-4 print:hidden">
        {rows.map((row, i) => (
          <div key={i} className="marquee-track flex w-max will-change-transform">
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
    </div>
  )
}
