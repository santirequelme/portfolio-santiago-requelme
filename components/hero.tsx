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

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="mx-auto max-w-7xl w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div className="flex-1 lg:w-[70%] text-center lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-balance"
          >
            <TypingText />
            <AnimatePresence mode="wait">
              <motion.span
                key={t("hero.subtitle")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-muted block"
              >
                {t("hero.subtitle")}
              </motion.span>
            </AnimatePresence>
          </motion.h1>

          <AnimatePresence mode="wait">
            <motion.p
              key={t("hero.description")}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed text-pretty lg:mx-0 mx-auto"
            >
              {t("hero.description")}
            </motion.p>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={t("hero.cta")}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="#projectList"
                    onClick={handleScrollToProjects}
                    className="px-8 py-3 bg-[#af52de]/10 border border-[#af52de]/50 text-[#af52de] font-semibold rounded-full
               hover:bg-[#af52de] hover:text-white hover:shadow-[0_0_20px_rgba(175,82,222,0.4)] 
               transition-all duration-300"
                  >
                    {t("hero.cta")}
                  </Link>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:w-[30%] w-full max-w-md"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl ring-1 ring-border hover:ring-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/20">
            <motion.div
              animate={{ opacity: isHovered ? 0 : 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image src="/images/foto1.png" alt="Profile" fill className="object-cover" priority />
            </motion.div>
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image src="/images/foto2.png" alt="Profile hover" fill className="object-cover" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-full blur-3xl" />
      </div>
    </section>
  )
}
