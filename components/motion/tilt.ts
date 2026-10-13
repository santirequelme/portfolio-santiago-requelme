"use client"

import { gsap } from "@/lib/gsap"

interface TiltOptions {
  /** Maximum rotation in degrees. */
  max?: number
  /** Element whose --mx / --my custom properties follow the cursor (for spotlights). */
  spotlight?: HTMLElement | null
}

// 3D tilt that follows the cursor. Call inside a gsap.matchMedia() context so
// it's skipped for touch and reduced-motion users; returns a cleanup function.
export function attachTilt(el: HTMLElement, { max = 8, spotlight }: TiltOptions = {}) {
  gsap.set(el, { transformPerspective: 900, transformStyle: "preserve-3d" })
  const rxTo = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" })
  const ryTo = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" })

  const onMove = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    ryTo((px - 0.5) * max * 2)
    rxTo((0.5 - py) * max * 2)
    if (spotlight) {
      spotlight.style.setProperty("--mx", `${px * 100}%`)
      spotlight.style.setProperty("--my", `${py * 100}%`)
    }
  }
  const onLeave = () => {
    gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.8, ease: "power3.out", overwrite: true })
  }

  el.addEventListener("pointermove", onMove)
  el.addEventListener("pointerleave", onLeave)
  return () => {
    el.removeEventListener("pointermove", onMove)
    el.removeEventListener("pointerleave", onLeave)
  }
}
