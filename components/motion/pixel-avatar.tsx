"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { gsap } from "@/lib/gsap"

interface PixelAvatarProps {
  src: string
  hoverSrc: string
  alt: string
  /** Largest block size in CSS px at the midpoint of the transition. */
  maxBlock?: number
}

// Pixel dissolve between two portraits: the first image pixelates into ever
// larger blocks, swaps at the midpoint and resolves into the second one.
// Rendered on a canvas over a regular <Image>, which stays as the no-JS and
// first-paint fallback. A mono readout shows the current block size.
export function PixelAvatar({ src, hoverSrc, alt, maxBlock = 28 }: PixelAvatarProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const readoutRef = useRef<HTMLSpanElement>(null)
  const baseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!root || !canvas || !ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const finePointer = window.matchMedia("(pointer: fine)").matches
    const small = document.createElement("canvas")
    const sctx = small.getContext("2d")!

    const load = (url: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image()
        img.decoding = "async"
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = url
      })

    const state = { p: 0 }
    let images: [HTMLImageElement, HTMLImageElement] | null = null
    let size = { w: 0, h: 0, dpr: 1 }
    let tween: gsap.core.Tween | null = null
    let target = 0
    let disposed = false

    const resize = () => {
      const rect = root.getBoundingClientRect()
      size = { w: rect.width, h: rect.height, dpr: Math.min(window.devicePixelRatio || 1, 2) }
      canvas.width = Math.round(size.w * size.dpr)
      canvas.height = Math.round(size.h * size.dpr)
      draw()
    }

    // object-fit: cover source rectangle for an image into the canvas box.
    const coverRect = (img: HTMLImageElement) => {
      const scale = Math.max(size.w / img.naturalWidth, size.h / img.naturalHeight)
      const sw = size.w / scale
      const sh = size.h / scale
      return { sx: (img.naturalWidth - sw) / 2, sy: (img.naturalHeight - sh) / 2, sw, sh }
    }

    const draw = () => {
      if (!images || !size.w) return
      const { p } = state
      // Block size peaks at the midpoint; the image swaps there.
      const block = Math.max(1, maxBlock * (1 - Math.abs(2 * p - 1)))
      const img = p < 0.5 ? images[0] : images[1]
      const { sx, sy, sw, sh } = coverRect(img)

      // The portraits have transparent backgrounds: hide the static image while
      // the canvas is showing and clear every frame so nothing bleeds through.
      canvas.style.opacity = p > 0 ? "1" : "0"
      if (baseRef.current) baseRef.current.style.opacity = p > 0 ? "0" : "1"
      if (readoutRef.current) {
        readoutRef.current.textContent = `RES ${String(Math.round(block)).padStart(2, "0")}PX`
        readoutRef.current.style.opacity = p > 0 && p < 1 ? "1" : "0"
      }
      if (p === 0) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.imageSmoothingEnabled = block <= 1.5
      if (block <= 1.5) {
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
        return
      }
      // Downsample to a tiny canvas, then scale it back up without smoothing.
      const cols = Math.max(1, Math.round(size.w / block))
      const rows = Math.max(1, Math.round(size.h / block))
      small.width = cols
      small.height = rows
      sctx.clearRect(0, 0, cols, rows)
      sctx.imageSmoothingEnabled = true
      sctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows)
      ctx.drawImage(small, 0, 0, cols, rows, 0, 0, canvas.width, canvas.height)
    }

    const animateTo = (to: number, delay = 0) => {
      target = to
      tween?.kill()
      if (reduced) {
        state.p = to
        draw()
        return
      }
      tween = gsap.to(state, { p: to, duration: 0.9, delay, ease: "power2.inOut", onUpdate: draw })
    }

    const onEnter = (e: PointerEvent) => e.pointerType === "mouse" && animateTo(1)
    const onLeave = (e: PointerEvent) => e.pointerType === "mouse" && animateTo(0)
    const onClick = () => !finePointer && animateTo(target ? 0 : 1)

    Promise.all([load(src), load(hoverSrc)])
      .then((imgs) => {
        if (disposed) return
        images = imgs
        resize()
        // One-time intro so visitors discover the effect.
        if (!reduced) {
          tween = gsap.to(state, {
            p: 1,
            duration: 1.1,
            delay: 1.2,
            ease: "power2.inOut",
            onUpdate: draw,
            onComplete: () => {
              if (target === 0) animateTo(0, 1.4)
            },
          })
        }
      })
      .catch(() => {
        /* keep the static <Image> */
      })

    const ro = new ResizeObserver(resize)
    ro.observe(root)
    root.addEventListener("pointerenter", onEnter)
    root.addEventListener("pointerleave", onLeave)
    root.addEventListener("click", onClick)

    return () => {
      disposed = true
      tween?.kill()
      ro.disconnect()
      root.removeEventListener("pointerenter", onEnter)
      root.removeEventListener("pointerleave", onLeave)
      root.removeEventListener("click", onClick)
    }
  }, [src, hoverSrc, maxBlock])

  return (
    <div ref={rootRef} className="relative h-full w-full">
      <div ref={baseRef} className="absolute inset-0">
        <Image src={src} alt={alt} fill priority sizes="(max-width: 1024px) 90vw, 384px" className="object-cover" />
      </div>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-0 [image-rendering:pixelated]"
      />
      <span
        ref={readoutRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-2 left-2 rounded-tag bg-foreground/85 px-1.5 py-1 font-mono text-[10px] leading-none tracking-[0.1em] text-background opacity-0 transition-opacity duration-200"
      />
    </div>
  )
}
