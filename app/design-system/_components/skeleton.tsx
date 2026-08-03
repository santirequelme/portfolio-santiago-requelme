"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"

/* ── Skeleton primitive ────────────────────────────────────────────────── */
export function Skeleton({
  w = "100%",
  h = 12,
  radius,
  circle = false,
  style,
}: {
  w?: number | string
  h?: number | string
  radius?: number | string
  circle?: boolean
  style?: CSSProperties
}) {
  return (
    <span
      className={`dsx-skel${circle ? " dsx-skel--circle" : ""}`}
      style={{ width: w, height: h, borderRadius: circle ? "50%" : radius, ...style }}
      aria-hidden
    />
  )
}

/* ── Section skeleton — three layouts that roughly mirror real content ──── */
export type SkeletonVariant = "grid" | "list" | "controls"

export function SectionSkeleton({ variant = "controls" }: { variant?: SkeletonVariant }) {
  if (variant === "grid") {
    return (
      <div className="ds-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="dsx-skel-card">
            <Skeleton h={58} radius={8} />
            <Skeleton w="60%" h={10} style={{ marginTop: 12 }} />
            <Skeleton w="38%" h={9} style={{ marginTop: 8 }} />
          </div>
        ))}
      </div>
    )
  }

  if (variant === "list") {
    return (
      <div className="ds-panel">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "13px 0",
              borderBottom: i < 4 ? "1px solid var(--ds-border)" : "none",
            }}
          >
            <Skeleton w={88} h={10} />
            <Skeleton h={12} style={{ flex: 1, maxWidth: `${70 - i * 8}%` }} />
            <Skeleton w={40} h={10} style={{ marginLeft: "auto" }} />
          </div>
        ))}
      </div>
    )
  }

  // controls
  return (
    <div className="ds-panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="ds-row">
        {[104, 128, 92, 116, 84].map((w, i) => (
          <Skeleton key={i} w={w} h={38} radius={10} />
        ))}
      </div>
      <div className="ds-row">
        {[76, 108, 64].map((w, i) => (
          <Skeleton key={i} w={w} h={30} radius={999} />
        ))}
      </div>
    </div>
  )
}

/* ── Lazy body — shows the skeleton, reveals children when in view ─────── */
export function LazyBody({ skeleton, children }: { skeleton: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let timer: ReturnType<typeof setTimeout>
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect()
          timer = setTimeout(() => setLoaded(true), 600)
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      clearTimeout(timer)
    }
  }, [])

  return (
    <div ref={ref} className="ds-lazy">
      {loaded ? <div className="ds-fade-in">{children}</div> : skeleton}
    </div>
  )
}
