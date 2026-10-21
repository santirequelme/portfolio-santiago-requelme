"use client"

import { useEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"

// Technical backdrop: a fine drafting grid, a ruler on the left edge and, on
// pointer devices, snapped crosshair guides with live coordinates plus a
// "loupe" that reveals grid intersections around the cursor.
// Everything is driven by CSS custom properties from one rAF loop that only
// runs while something changes - no React re-renders, no canvas.

const MINOR = 24 // px, minor grid step (crosshair snaps to it)
const MAJOR = 120 // px, major grid step and ruler label step

export function SpatialBackground() {
  const rootRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const coordRef = useRef<HTMLSpanElement>(null)
  const rulerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const finePointer = window.matchMedia("(pointer: fine)").matches

    let raf: number | null = null
    let mouseX = -1
    let mouseY = -1
    let idleTimer: ReturnType<typeof setTimeout> | null = null

    const render = () => {
      raf = null
      const scroll = window.scrollY

      // Major grid drifts slower than the page for a hint of depth.
      root.style.setProperty("--major-y", `${(-scroll * 0.08) % MAJOR}px`)

      // Ruler: ticks slide with the page, labels show page-space Y.
      root.style.setProperty("--ruler-y", `${-(scroll % MAJOR)}px`)
      const base = Math.floor(scroll / MAJOR) * MAJOR
      rulerRef.current?.querySelectorAll<HTMLSpanElement>("[data-ruler-label]").forEach((label, i) => {
        label.textContent = String(base + i * MAJOR).padStart(4, "0")
      })

      if (mouseX >= 0) {
        const sx = Math.round(mouseX / MINOR) * MINOR
        const sy = Math.round(mouseY / MINOR) * MINOR
        root.style.setProperty("--cx", `${mouseX}px`)
        root.style.setProperty("--cy", `${mouseY}px`)
        root.style.setProperty("--sx", `${sx}px`)
        root.style.setProperty("--sy", `${sy}px`)
        if (coordRef.current) {
          coordRef.current.textContent = `X ${String(sx).padStart(4, "0")}  Y ${String(Math.round(sy + scroll)).padStart(4, "0")}`
        }
      }
    }
    const schedule = () => {
      if (raf === null) raf = requestAnimationFrame(render)
    }

    render()
    window.addEventListener("scroll", schedule, { passive: true })

    // Grid "boots" from the centre on first load.
    let intro: gsap.core.Tween | null = null
    if (!reduced && gridRef.current) {
      intro = gsap.fromTo(
        gridRef.current,
        { clipPath: "circle(0% at 50% 40%)" },
        { clipPath: "circle(150% at 50% 40%)", duration: 1.8, ease: "power2.inOut", clearProps: "clipPath" },
      )
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      mouseX = e.clientX
      mouseY = e.clientY
      root.dataset.cursor = "on"
      if (idleTimer) clearTimeout(idleTimer)
      idleTimer = setTimeout(() => (root.dataset.cursor = "idle"), 1600)
      schedule()
    }
    const onLeave = () => (root.dataset.cursor = "off")

    const pointerFx = finePointer && !reduced
    if (pointerFx) {
      window.addEventListener("pointermove", onMove, { passive: true })
      document.documentElement.addEventListener("pointerleave", onLeave)
    }

    return () => {
      window.removeEventListener("scroll", schedule)
      if (pointerFx) {
        window.removeEventListener("pointermove", onMove)
        document.documentElement.removeEventListener("pointerleave", onLeave)
      }
      if (raf !== null) cancelAnimationFrame(raf)
      if (idleTimer) clearTimeout(idleTimer)
      intro?.kill()
    }
  }, [])

  return (
    <div ref={rootRef} aria-hidden="true" data-cursor="off" className="tech-bg pointer-events-none fixed inset-0 z-0 print:hidden">
      {/* Drafting grid: minor + major lines, faded towards the edges */}
      <div ref={gridRef} className="tech-grid absolute inset-0" />

      {/* Loupe: intersection points revealed around the cursor */}
      <div className="tech-loupe absolute inset-0" />

      {/* Crosshair guides snapped to the minor grid */}
      <div className="tech-cross-x absolute left-0 right-0 top-0 h-px" />
      <div className="tech-cross-y absolute bottom-0 top-0 left-0 w-px" />
      <span ref={coordRef} className="tech-coord absolute left-0 top-0 font-mono text-[10px] tracking-[0.08em]" />

      {/* Left ruler (desktop) */}
      <div ref={rulerRef} className="tech-ruler absolute bottom-0 left-0 top-0 hidden w-5 overflow-hidden lg:block">
        <div className="tech-ruler-ticks absolute inset-x-0 -bottom-[120px] top-0" />
        {Array.from({ length: 14 }, (_, i) => (
          <span
            key={i}
            data-ruler-label
            className="tech-ruler-label absolute left-[5px] rotate-180 font-mono text-[8px] leading-none [writing-mode:vertical-rl]"
            style={{ top: `calc(${i * MAJOR}px + var(--ruler-y, 0px) + 5px)` }}
          />
        ))}
        <span className="tech-ruler-marker absolute left-0 h-px w-5" />
      </div>
    </div>
  )
}
