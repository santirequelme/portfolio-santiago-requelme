"use client"

import { useRef, type ReactNode } from "react"
import { gsap, useGSAP, FINE_POINTER } from "@/lib/gsap"

interface MagneticProps {
  children: ReactNode
  /** How far the element follows the cursor, as a fraction of the offset. */
  strength?: number
  className?: string
}

// Pulls its child towards the cursor while hovered and springs back on leave.
export function Magnetic({ children, strength = 0.35, className = "inline-block" }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const mm = gsap.matchMedia()
      mm.add(FINE_POINTER, () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" })
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" })

        const onMove = (e: PointerEvent) => {
          const rect = el.getBoundingClientRect()
          xTo((e.clientX - (rect.left + rect.width / 2)) * strength)
          yTo((e.clientY - (rect.top + rect.height / 2)) * strength)
        }
        const onLeave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)", overwrite: true })
        }

        el.addEventListener("pointermove", onMove)
        el.addEventListener("pointerleave", onLeave)
        return () => {
          el.removeEventListener("pointermove", onMove)
          el.removeEventListener("pointerleave", onLeave)
        }
      })
      return () => mm.revert()
    },
    { scope: ref, dependencies: [strength] },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
