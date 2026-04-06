"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView } from "framer-motion"

interface ScrollRevealSectionProps {
  children: ReactNode
  className?: string
  delay?: number
}

const variants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(4px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
}

export function ScrollRevealSection({
  children,
  className = "",
  delay = 0,
}: ScrollRevealSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, {
    once: true,
    margin: "-80px",
  })

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 20,
        mass: 0.6,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
