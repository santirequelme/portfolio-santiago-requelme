"use client"

import { useEffect, useState, useRef } from "react"

export function CursorEffect() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Mouse tracking — listeners attached once, stable cleanup
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.body.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  // Canvas particle animation — requestAnimationFrame, zero React state updates
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const w = window.innerWidth
    const h = window.innerHeight

    canvas.width = w * dpr
    canvas.height = h * dpr

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.scale(dpr, dpr)

    // Colors match original intent: orange → red → pink → fuchsia (magenta fixed)
    const colors = [
      "rgba(249, 115, 22, 0.5)",  // orange-500
      "rgba(239, 68,  68,  0.5)", // red-500
      "rgba(236, 72,  153, 0.5)", // pink-500
      "rgba(217, 70,  239, 0.5)", // fuchsia-500 (replaces invalid magenta-500)
    ]

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
    }))

    let rafId: number

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Apply blur once for all particles — matches original blur-sm (4px)
      ctx.filter = "blur(2px)"

      for (const p of particles) {
        p.x = (p.x + p.speedX + w) % w
        p.y = (p.y + p.speedY + h) % h

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
      }

      ctx.filter = "none"

      rafId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <>
      {/* Subtle grid overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_40%,transparent_100%)]" />
      </div>

      {/* Cursor glow — magenta-500 replaced with fuchsia-500 */}
      {isVisible && (
        <div
          className="fixed pointer-events-none z-0 transition-all duration-300 ease-out"
          style={{
            left: position.x,
            top: position.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="absolute inset-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-orange-500/10 via-orange-500/5 to-transparent blur-3xl animate-pulse-slow" />
          <div className="absolute inset-0 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-red-500/12 via-red-500/6 to-transparent blur-2xl animate-pulse-medium" />
          <div className="absolute inset-0 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-pink-500/15 via-pink-500/8 to-transparent blur-xl animate-pulse-fast" />
          <div className="absolute inset-0 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-fuchsia-500/15 via-fuchsia-500/8 to-transparent blur-lg animate-pulse-slow" />
          <div className="absolute inset-0 w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-fuchsia-500/20 via-fuchsia-500/10 to-transparent blur-md animate-pulse-medium" />
          <div className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-fuchsia-400/60 rounded-full shadow-[0_0_20px_#ff00ff] animate-pulse" />
        </div>
      )}

      {/* Canvas for floating particles — no React state, requestAnimationFrame */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ width: "100%", height: "100%" }}
      />
    </>
  )
}
