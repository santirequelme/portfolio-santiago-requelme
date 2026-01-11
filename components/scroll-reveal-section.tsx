"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface ScrollRevealSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  variant?: "slide-left" | "blur-fade-up"
}

export function ScrollRevealSection({
  children,
  className = "",
  delay = 0,
  variant = "slide-left",
}: ScrollRevealSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const variants = {
    "slide-left": {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.6, delay, ease: "easeOut" },
    },
    "blur-fade-up": {
      initial: { opacity: 0, y: 50, filter: "blur(10px)" },
      animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      transition: { duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] },
    },
  }

  const selectedVariant = variants[variant]

  return (
    <motion.div
      ref={ref}
      initial={selectedVariant.initial}
      animate={isInView ? selectedVariant.animate : selectedVariant.initial}
      transition={selectedVariant.transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}
