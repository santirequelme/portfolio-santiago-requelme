"use client"

import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

const PHOTOS = [
  "/images/dashboard.webp",
  "/images/experience.webp",
  "/images/booking.webp",
  "/images/homepage.webp",
  "/images/foto1.webp",
  "/images/foto2.webp",
]

export function GalleryDemo() {
  const [open, setOpen] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const go = useCallback(
    (dir: number) => setOpen((prev) => (prev === null ? prev : (prev + dir + PHOTOS.length) % PHOTOS.length)),
    [],
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null)
      if (e.key === "ArrowRight") go(1)
      if (e.key === "ArrowLeft") go(-1)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, go])

  return (
    <>
      <div className="dsx-gallery">
        {PHOTOS.map((src, i) => (
          <button key={src} type="button" className="dsx-gallery__item" onClick={() => setOpen(i)} aria-label={`Open image ${i + 1}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`Gallery item ${i + 1}`} loading="lazy" />
          </button>
        ))}
      </div>

      {mounted && open !== null
        ? createPortal(
            <div className="dsx-lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
              <button className="dsx-lightbox__btn dsx-lightbox__btn--close" aria-label="Close" onClick={() => setOpen(null)}>
                <X size={20} />
              </button>
              <button
                className="dsx-lightbox__btn dsx-lightbox__btn--prev"
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation()
                  go(-1)
                }}
              >
                <ChevronLeft size={22} />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="dsx-lightbox__img" src={PHOTOS[open]} alt={`Gallery item ${open + 1}`} onClick={(e) => e.stopPropagation()} />
              <button
                className="dsx-lightbox__btn dsx-lightbox__btn--next"
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation()
                  go(1)
                }}
              >
                <ChevronRight size={22} />
              </button>
              <span className="dsx-lightbox__count">
                {open + 1} / {PHOTOS.length}
              </span>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
