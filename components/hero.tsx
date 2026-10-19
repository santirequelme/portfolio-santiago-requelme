"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { TypingText } from "./typing-text"
import { useLanguage } from "@/contexts/language-context"
import { Magnetic } from "./motion/magnetic"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { buttonClass } from "@/lib/ui"
import { CornerMarks, Dimension } from "./tech/annotations"
import { gsap, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap"

export function Hero() {
  const [isHovered, setIsHovered] = useState(false)
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const marksRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Scroll-out parallax: text and photo leave at different speeds.
      mm.add(MOTION_OK, () => {
        const scrollTrigger = {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
        gsap.to(textRef.current, { yPercent: -18, opacity: 0.2, ease: "none", scrollTrigger })
        gsap.to(imageRef.current, { yPercent: 12, ease: "none", scrollTrigger })

        // Type metric guides draw in under the headline.
        gsap.from(".hero-guide", { scaleX: 0, duration: 1.4, ease: "power3.inOut", stagger: 0.15, delay: 0.4 })
        gsap.from(".hero-guide-label", { opacity: 0, duration: 0.6, stagger: 0.15, delay: 1.2 })
      })

      // Portrait card tilts towards the cursor; the annotation layer drifts the
      // other way for depth, and a soft highlight follows the pointer.
      mm.add(FINE_POINTER, () => {
        const stage = stageRef.current
        const card = cardRef.current
        const marks = marksRef.current
        const shine = shineRef.current
        if (!stage || !card || !marks || !shine) return

        const MAX = 6
        gsap.set(card, { transformPerspective: 1000, transformOrigin: "center" })
        const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" })
        const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" })
        const mx = gsap.quickTo(marks, "x", { duration: 0.8, ease: "power3.out" })
        const my = gsap.quickTo(marks, "y", { duration: 0.8, ease: "power3.out" })

        const onMove = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect()
          const px = (e.clientX - r.left) / r.width - 0.5
          const py = (e.clientY - r.top) / r.height - 0.5
          ry(px * MAX * 2)
          rx(-py * MAX * 2)
          mx(-px * 12)
          my(-py * 12)
          shine.style.setProperty("--mx", `${(px + 0.5) * 100}%`)
          shine.style.setProperty("--my", `${(py + 0.5) * 100}%`)
        }
        const onEnter = () => gsap.to(shine, { opacity: 1, duration: 0.4 })
        const onLeave = () => {
          rx(0)
          ry(0)
          mx(0)
          my(0)
          gsap.to(shine, { opacity: 0, duration: 0.4 })
        }

        stage.addEventListener("pointermove", onMove)
        stage.addEventListener("pointerenter", onEnter)
        stage.addEventListener("pointerleave", onLeave)
        return () => {
          stage.removeEventListener("pointermove", onMove)
          stage.removeEventListener("pointerenter", onEnter)
          stage.removeEventListener("pointerleave", onLeave)
        }
      })

      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  useEffect(() => {
    setIsHovered(true)
    const timer = setTimeout(() => setIsHovered(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleScrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const element = document.getElementById("projectList")
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const enter =
    "animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out fill-mode-both motion-reduce:animate-none"

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center px-4 pt-20 md:pt-32 pb-16">
      <div className="mx-auto max-w-7xl w-full flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
        {/* Left side: Text content */}
        <div ref={textRef} className="flex-1 lg:w-[70%] text-center lg:text-left z-10">
          <p className={`${enter} font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-8`}>
            <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] bg-primary align-middle" aria-hidden="true" />
            {t("cv.role")}
          </p>

          {/* Heading + Subtitle inside h1 — same display size, contrasted by color.
              Cap-height and baseline guides sit behind the first line. */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 hidden md:block text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {[
                { top: "0.2em", label: "cap" },
                { top: "0.9em", label: "base" },
              ].map((g) => (
                <span key={g.label} className="absolute -left-4 -right-4 flex items-center" style={{ top: g.top }}>
                  <span className="hero-guide h-px flex-1 origin-left bg-[repeating-linear-gradient(90deg,var(--primary)_0_3px,transparent_3px_6px)] opacity-40" />
                  <span className="hero-guide-label ml-2 font-mono text-[10px] uppercase tracking-widest text-primary/70">{g.label}</span>
                </span>
              ))}
            </div>
          <h1
            className={`${enter} delay-100 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-10`}
          >
            <TypingText />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={t("hero.subtitle")}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="block text-foreground/25 dark:text-foreground/40 text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2"
              >
                {t("hero.subtitle")}
              </motion.span>
            </AnimatePresence>
          </h1>
          </div>

          {/* Description with language animation */}
          <div className={`${enter} delay-200`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={t("hero.description")}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-lg sm:text-xl text-muted-foreground dark:text-foreground/85 leading-relaxed text-pretty mb-10 max-w-xl lg:mx-0 mx-auto"
              >
                {t("hero.description")}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Actions: primary + secondary */}
          <div className={`${enter} delay-300 flex flex-wrap items-center justify-center gap-3 lg:justify-start`}>
            <Magnetic strength={0.2}>
              <Link href="#projectList" onClick={handleScrollToProjects} className={buttonClass("primary", "lg", "group")}>
                {t("hero.viewProjects")}
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
              </Link>
            </Magnetic>
            <Link href="/cv" className={buttonClass("secondary", "lg", "group")}>
              {t("hero.viewCv")}
              <ArrowUpRight
                className="h-4 w-4 text-muted-foreground transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {/* Right side: profile photo presented as a design-tool frame */}
        <div
          className={`${enter} delay-300 lg:w-[30%] w-full max-w-sm pr-8 pb-10`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div ref={imageRef} className="relative">
            <p className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <span>
                <span className="text-primary">#</span> Frame 01 — Portrait
              </span>
              <span>1:1</span>
            </p>

            <div ref={stageRef} className="relative">
            <div
              ref={cardRef}
              className="relative rounded-card border border-border bg-card p-1.5 shadow-[0_30px_60px_-40px_rgb(0_0_0/0.35)] will-change-transform"
            >

              <div className="relative aspect-square w-full overflow-hidden rounded-inner bg-secondary">
                <motion.div
                  animate={{ opacity: isHovered ? 0 : 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image src="/images/foto1.webp" alt="Santiago Requelme" fill className="object-cover" priority />
                </motion.div>
                <motion.div
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image src="/images/foto2.webp" alt="" fill loading="lazy" className="object-cover" />
                </motion.div>

                {/* Soft highlight that follows the pointer (driven by GSAP) */}
                <div
                  ref={shineRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light"
                  style={{
                    background:
                      "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgb(255 255 255 / 0.55), transparent 55%)",
                  }}
                />
              </div>
            </div>

            {/* Annotation layer: sits outside the tilting card and drifts the
                opposite way, so the marks read as a separate plane. */}
            <div ref={marksRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
              <CornerMarks offset={10} />
              <Dimension axis="x" offset={26} />
              <Dimension axis="y" offset={26} />
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
