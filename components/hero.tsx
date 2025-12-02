"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { TypingText } from "./typing-text"

export function Hero() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="mx-auto max-w-7xl w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Content Section - 70% */}
        <div className="flex-1 lg:w-[70%] text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Now in Beta
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-balance"
          >
            <TypingText /> <span className="text-muted">with minimal friction</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed text-pretty lg:mx-0 mx-auto"
          >
            A clean, modern framework for building exceptional web experiences. Designed for developers who value
            simplicity and performance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#"
                className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Get Started Free
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border px-8 text-sm font-medium text-foreground transition-colors hover:bg-card"
              >
                View Documentation
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16"
          >
            <p className="text-sm text-muted mb-6">Trusted by teams at leading companies</p>
            <div className="flex flex-wrap items-center lg:justify-start justify-center gap-8 opacity-50">
              {["Acme Inc", "Globex", "Initech", "Umbrella", "Hooli"].map((company) => (
                <span key={company} className="text-lg font-semibold tracking-tight">
                  {company}
                </span>
              ))}
            </div>
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
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl">
            <motion.div
              animate={{ opacity: isHovered ? 0 : 1 }}
              transition={{ duration: 0.3 }}
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />
      </div>
    </section>
  )
}
