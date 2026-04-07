"use client"

import { useEffect, useState } from "react"

interface Particle {
  x: number
  y: number
  size: number
  color: string
  speedX: number
  speedY: number
}

export function CursorEffect() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])

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

  useEffect(() => {
    const colors = ["bg-orange-500/20", "bg-red-500/20", "bg-pink-500/20", "bg-fuchsia-500/20", "bg-magenta-500/20"]
    const newParticles: Particle[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
    }))
    setParticles(newParticles)

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: (p.x + p.speedX + window.innerWidth) % window.innerWidth,
          y: (p.y + p.speedY + window.innerHeight) % window.innerHeight,
        })),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_40%,transparent_100%)]" />
      </div>

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
          <div className="absolute inset-0 w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-magenta-500/20 via-magenta-500/10 to-transparent blur-md animate-pulse-medium" />
          <div className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-fuchsia-400/60 rounded-full shadow-[0_0_20px_#ff00ff] animate-pulse" />
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((particle, i) => (
          <div
            key={i}
            className={`absolute ${particle.color} rounded-full blur-sm`}
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              transition: "all 0.05s linear",
            }}
          />
        ))}
      </div>
    </>
  )
}
