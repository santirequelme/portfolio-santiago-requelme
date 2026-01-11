"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

interface MenuItem {
  name: string
  href: string
}

interface HamburgerMenuProps {
  items: MenuItem[]
}

export function HamburgerMenu({ items }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

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
              className="mt-8 flex flex-col gap-4"
            >
              <div className="flex items-center justify-center gap-6">
                <Link
                  href="https://www.linkedin.com/in/santiago-requelme/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={toggleMenu}
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                  aria-label="LinkedIn Profile"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </Link>

                <Link
                  href="https://github.com/santirequelme/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={toggleMenu}
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                  aria-label="GitHub Profile"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </Link>
              </div>

              <AnimatePresence mode="wait">
                <motion.a
                  key={t("header.hireMe")}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  href="mailto:santireke37@gmail.com"
                  onClick={toggleMenu}
                  className="w-full rounded-full bg-gradient-to-r from-primary to-accent py-3 text-center text-sm font-medium text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/30"
                >
                  {t("header.hireMe")}
                </motion.a>
              </AnimatePresence>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
