"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { TypingText } from "./typing-text"
import { useLanguage } from "@/contexts/language-context"

export function Hero() {
  const [isHovered, setIsHovered] = useState(false)
  const { t } = useLanguage()

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    },
  }


  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 md:pt-32 pb-16">
      <div className="mx-auto max-w-7xl w-full flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
        {/* Left side: Text content */}
        <motion.div
          className="flex-1 lg:w-[70%] text-center lg:text-left z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Heading + Subtitle inside h1 — same display size, contrasted by color */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-10"
          >
            <TypingText />
            <AnimatePresence mode="wait">
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
          </motion.h1>

          {/* Description with language animation */}
          <motion.div variants={itemVariants}>
            <AnimatePresence mode="wait">
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
          </motion.div>

          {/* CTA Button with glass effect */}
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <AnimatePresence mode="wait">
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
          </motion.div>
        </motion.div>

        {/* Right side: Profile image with spatial treatment */}
        <motion.div
          className="lg:w-[30%] w-full max-w-sm"
          variants={itemVariants}
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
                  src="/images/foto1.png"
                  alt="Profile"
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
                  src="/images/foto2.png"
                  alt="Profile alternate"
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
        </motion.div>
      </div>
    </section>
  )
}
