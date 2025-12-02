"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface MenuItem {
  name: string
  href: string
}

interface HamburgerMenuProps {
  items: MenuItem[]
}

export function HamburgerMenu({ items }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const lineVariants = {
    closed: { rotate: 0, y: 0 },
    open: (custom: number) => ({
      rotate: custom === 1 ? 45 : custom === 3 ? -45 : 0,
      y: custom === 1 ? 6 : custom === 3 ? -6 : 0,
      opacity: custom === 2 ? 0 : 1,
    }),
  }

  const menuVariants = {
    closed: {
      x: "100%",
      transition: { type: "spring", stiffness: 400, damping: 40 },
    },
    open: {
      x: 0,
      transition: { type: "spring", stiffness: 400, damping: 40 },
    },
  }

  const itemVariants = {
    closed: { x: 20, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  }

  return (
    <>
      <button
        onClick={toggleMenu}
        className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {[1, 2, 3].map((line) => (
          <motion.span
            key={line}
            custom={line}
            variants={lineVariants}
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.3 }}
            className="block h-0.5 w-6 bg-foreground"
          />
        ))}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 z-40 h-full w-72 bg-background border-l border-border p-6 pt-20"
          >
            <ul className="flex flex-col gap-4">
              {items.map((item, i) => (
                <motion.li key={item.name} custom={i} variants={itemVariants} initial="closed" animate="open">
                  <Link
                    href={item.href}
                    onClick={toggleMenu}
                    className="block py-3 text-lg font-medium text-muted-foreground transition-colors hover:text-foreground hover:translate-x-2 duration-200"
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex flex-col gap-3"
            >
              <Link
                href="#"
                onClick={toggleMenu}
                className="w-full py-3 text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Log in
              </Link>
              <Link
                href="#"
                onClick={toggleMenu}
                className="w-full rounded-full bg-foreground py-3 text-center text-sm font-medium text-background transition-all hover:opacity-90"
              >
                Get Started
              </Link>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
