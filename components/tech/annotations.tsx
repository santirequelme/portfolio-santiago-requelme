"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"
import { cn } from "@/lib/utils"

// Design-tool annotations: registration corners, dimension lines, section
// markers and a Figma-like selection box. All decorative (aria-hidden) and
// drawn in with GSAP when they scroll into view.

// Tracks the rendered size of an element's parent.
function useParentSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const parent = ref.current?.parentElement
    if (!parent) return
    const ro = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize?.[0]
      setSize({
        w: Math.round(box ? box.inlineSize : entry.contentRect.width),
        h: Math.round(box ? box.blockSize : entry.contentRect.height),
      })
    })
    ro.observe(parent)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

/** L-shaped registration marks just outside each corner of the parent. */
export function CornerMarks({ offset = 8, size = 10, className }: { offset?: number; size?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from(ref.current!.children, {
          scale: 0,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: ref.current, start: "top 90%" },
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  const corners = [
    { pos: { top: -offset, left: -offset }, border: "border-l border-t", origin: "top left" },
    { pos: { top: -offset, right: -offset }, border: "border-r border-t", origin: "top right" },
    { pos: { bottom: -offset, left: -offset }, border: "border-b border-l", origin: "bottom left" },
    { pos: { bottom: -offset, right: -offset }, border: "border-b border-r", origin: "bottom right" },
  ]

  return (
    <span ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      {corners.map((c, i) => (
        <span
          key={i}
          className={cn("absolute border-foreground/50", c.border)}
          style={{ ...c.pos, width: size, height: size, transformOrigin: c.origin }}
        />
      ))}
    </span>
  )
}

/**
 * A dimension line ("cota") along one side of the parent, labelled with the
 * parent's live size in px.
 */
export function Dimension({
  axis = "x",
  side = axis === "x" ? "bottom" : "right",
  offset = 20,
  label,
  className,
}: {
  axis?: "x" | "y"
  side?: "top" | "bottom" | "left" | "right"
  offset?: number
  label?: string
  className?: string
}) {
  const [ref, size] = useParentSize<HTMLSpanElement>()
  const value = label ?? String(axis === "x" ? size.w : size.h)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 92%" } })
        tl.from(ref.current!.querySelector(".dim-line"), {
          [axis === "x" ? "scaleX" : "scaleY"]: 0,
          duration: 0.9,
          ease: "power3.inOut",
        }).from(ref.current!.querySelector(".dim-label"), { opacity: 0, y: axis === "x" ? 4 : 0, duration: 0.4 }, "-=0.3")
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  const horizontal = axis === "x"
  const placement: React.CSSProperties = horizontal
    ? { left: 0, right: 0, [side]: -offset, height: 9 }
    : { top: 0, bottom: 0, [side]: -offset, width: 9 }

  return (
    <span ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute", className)} style={placement}>
      <span
        className={cn(
          "dim-line absolute text-muted-foreground/70",
          horizontal
            ? "inset-x-0 top-1/2 h-px border-t border-current before:absolute before:-top-[5px] before:left-0 before:h-[9px] before:border-l before:border-current after:absolute after:-top-[5px] after:right-0 after:h-[9px] after:border-r after:border-current"
            : "inset-y-0 left-1/2 w-px border-l border-current before:absolute before:-left-[5px] before:top-0 before:w-[9px] before:border-t before:border-current after:absolute after:-left-[5px] after:bottom-0 after:w-[9px] after:border-b after:border-current",
        )}
      />
      <span
        className={cn(
          "dim-label absolute bg-background px-1.5 font-mono text-[10px] leading-none tracking-wide text-primary",
          horizontal
            ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90",
        )}
      >
        {value}
      </span>
    </span>
  )
}

/** Section index + label + a rule that draws across, with optional meta. */
export function SectionMarker({
  index,
  label,
  meta,
  className,
}: {
  index: string
  label: ReactNode
  meta?: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: "top 90%" } })
          .from(ref.current!.querySelectorAll(".marker-text"), { opacity: 0, y: 6, duration: 0.5, stagger: 0.08 })
          .from(ref.current!.querySelector(".marker-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" }, "<0.1")
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground", className)}
    >
      <span className="marker-text text-primary">{index}</span>
      <span className="marker-text">{label}</span>
      <span aria-hidden="true" className="marker-rule h-px flex-1 origin-left bg-border" />
      {meta && <span className="marker-text">{meta}</span>}
    </div>
  )
}

/**
 * Figma-style selection: outline, four handles and a W × H badge. Shown when
 * an ancestor with the `group` class is hovered or focused.
 */
export function SelectionOverlay({ className }: { className?: string }) {
  const [ref, size] = useParentSize<HTMLSpanElement>()

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -inset-px z-30 rounded-[inherit] border border-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100",
        className,
      )}
    >
      {["-left-[4px] -top-[4px]", "-right-[4px] -top-[4px]", "-bottom-[4px] -left-[4px]", "-bottom-[4px] -right-[4px]"].map((pos) => (
        <span key={pos} className={cn("absolute h-[7px] w-[7px] border border-primary bg-background", pos)} />
      ))}
      <span className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 translate-y-1/2 whitespace-nowrap rounded-[3px] bg-primary px-1.5 py-[3px] font-mono text-[10px] leading-none text-primary-foreground">
        {size.w} × {size.h}
      </span>
    </span>
  )
}
