"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  hue: number
  opacity: number
}

export function SpatialBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Canvas particle animation — no mouse physics, just drift
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const dpr = window.devicePixelRatio || 1
    const w = window.innerWidth
    const h = window.innerHeight

    canvas.width = w * dpr
    canvas.height = h * dpr

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.scale(dpr, dpr)

    const particles: Particle[] = Array.from({ length: 25 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.2 + 0.4,
      hue: Math.random() > 0.5 ? 295 : 265,
      opacity: Math.random() * 0.4 + 0.2,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        ctx.fillStyle = `oklch(0.6 0.2 ${p.hue} / ${p.opacity})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  // Cursor glow — direct DOM manipulation, zero React re-renders
  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return

    let rafId: number
    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let currentX = targetX
    let currentY = targetY

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const update = () => {
      currentX = lerp(currentX, targetX, 0.08)
      currentY = lerp(currentY, targetY, 0.08)
      glow.style.transform = `translate3d(${currentX - 300}px, ${currentY - 300}px, 0)`
      rafId = requestAnimationFrame(update)
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true })
    rafId = requestAnimationFrame(update)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      {/* Static ambient gradient orbs — no animation, pure CSS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 20% 20%, oklch(0.65 0.28 295 / 0.18), transparent)," +
              "radial-gradient(ellipse 50% 60% at 80% 80%, oklch(0.62 0.25 265 / 0.14), transparent)",
          }}
        />
      </div>

      {/* Subtle grid — only top portion, no mask animation */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.18 0.03 275 / 0.15) 1px, transparent 1px)," +
            "linear-gradient(90deg, oklch(0.18 0.03 275 / 0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 40%)",
        }}
      />

      {/* Canvas for particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Cursor glow — single element, GPU transform, no React state */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none z-0"
        style={{
          width: 600,
          height: 600,
          willChange: "transform",
          background:
            "radial-gradient(circle at center, oklch(0.65 0.28 295 / 0.12) 0%, oklch(0.62 0.25 265 / 0.06) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </>
  )
}
