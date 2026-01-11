"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { HamburgerMenu } from "./hamburger-menu"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { useLanguage } from "@/contexts/language-context"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const { t } = useLanguage()

  const navItems = [
    { name: t("nav.projects"), href: "#projectList" },
    { name: t("nav.about"), href: "#about" },
    { name: t("nav.contact"), href: "#contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: 0.2,
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-accent to-primary bg-[length:200%_200%] animate-gradient-shift group-hover:shadow-lg group-hover:shadow-primary/50 transition-all duration-300"
            >
              <span className="text-sm font-bold text-primary-foreground group-hover:font-extrabold transition-all duration-300">
                SR
              </span>
            </motion.div>
            <span className="text-xl font-semibold tracking-tight">Santiago Requelme</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <AnimatePresence mode="wait">
              {navItems.map((item) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className="relative text-sm text-muted-foreground transition-colors hover:text-foreground group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <LanguageToggle />
            <ThemeToggle />

            <Link
              href="https://www.linkedin.com/in/santiago-requelme/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
              aria-label="LinkedIn Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
              aria-label="GitHub Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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

            <AnimatePresence mode="wait">
              <motion.a
                key={t("nav.hireMe")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                href="mailto:santireke37@gmail.com"
                className="inline-flex h-9 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent px-5 text-sm font-medium text-primary-foreground transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
              >
                {t("nav.hireMe")}
              </motion.a>
            </AnimatePresence>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <HamburgerMenu items={navItems} />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
