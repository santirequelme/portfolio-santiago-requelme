"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"
import { TypingText } from "./typing-text"
import { useLanguage } from "@/contexts/language-context"

export function Hero() {
  const [isHovered, setIsHovered] = useState(false)
  const { t } = useLanguage()

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
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 md:pt-32 pb-16">
      <div className="mx-auto max-w-7xl w-full flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
        {/* Left side: Text content */}
        <div className="flex-1 lg:w-[70%] text-center lg:text-left z-10">
          {/* Heading + Subtitle inside h1 — same display size, contrasted by color */}
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
                className="block text-muted text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2"
              >
                {t("hero.subtitle")}
              </motion.span>
            </AnimatePresence>
          </h1>

          {/* Description with language animation */}
          <div className={`${enter} delay-200`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={t("hero.description")}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-pretty mb-10 max-w-xl lg:mx-0 mx-auto"
              >
                {t("hero.description")}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* CTA Button with glass effect */}
          <div className={`${enter} delay-300`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={t("hero.viewProjects")}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="#projectList"
                    onClick={handleScrollToProjects}
                    className="inline-flex items-center justify-center px-8 py-4 font-semibold rounded-full
                      bg-primary/10 backdrop-blur-xl border border-primary/40
                      text-primary transition-all duration-300 ease-out
                      hover:bg-primary/20 hover:border-primary/60 hover:shadow-[0_0_30px_rgba(164,88,255,0.4)]
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2
                      focus-visible:ring-offset-background active:scale-95"
                  >
                    {t("hero.viewProjects")}
                    <svg
                      className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Right side: Profile image with spatial treatment */}
        <div
          className={`${enter} delay-300 lg:w-[30%] w-full max-w-sm`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative">
            {/* Glow backdrop behind image */}
            <motion.div
              animate={{
                opacity: isHovered ? 1 : 0.7,
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10 blur-2xl -z-10"
            />

            {/* Image container with ring and hover glow */}
            <div
              className="relative aspect-square w-full overflow-hidden rounded-2xl ring-1 ring-primary/30
                transition-[box-shadow,ring-color] duration-150 ease-out
                hover:ring-primary/60 hover:shadow-[0_0_40px_rgba(164,88,255,0.3)]"
            >
              {/* Primary image */}
              <motion.div
                animate={{ opacity: isHovered ? 0 : 1 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src="/images/foto1.webp"
                  alt="Santiago Requelme"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>

              {/* Hover image — lazy loaded, only needed on interaction */}
              <motion.div
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src="/images/foto2.webp"
                  alt=""
                  fill
                  loading="lazy"
                  className="object-cover"
                />
              </motion.div>

              {/* Subtle overlay on hover for cinematic effect */}
              <motion.div
                animate={{
                  opacity: isHovered ? 0.15 : 0,
                }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
