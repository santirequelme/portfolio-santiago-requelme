"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

// Extracted so that hover state changes don't re-render the entire Header
function NavItems({ navItems }: { navItems: { name: string; href: string }[] }) {
  const [activeNavItem, setActiveNavItem] = useState(0)

  return (
    <nav className="flex items-center gap-1 flex-shrink-0">
      {navItems.map((item, index) => (
        <motion.div key={item.href} layout="position" className="relative"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Link
            href={item.href}
            onMouseEnter={() => setActiveNavItem(index)}
            className="relative flex px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground z-10"
          >
            <motion.span layout="size" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
              {item.name}
            </motion.span>
          </Link>

          <AnimatePresence>
            {activeNavItem === index && (
              <motion.div
                layoutId="navIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-lg bg-foreground/5 -z-10"
              />
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      <div
        onMouseLeave={() => setActiveNavItem(-1)}
        className="absolute inset-0 -z-20"
      />
    </nav>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  const navItems = [
    { name: t("nav.projects"), href: "#projectList" },
    { name: t("nav.about"), href: "#about" },
    { name: t("nav.contact"), href: "mailto:santireke37@gmail.com" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Desktop Floating Command Bar
  return (
    <>
      {/* Desktop Navigation */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden md:block fixed top-6 left-1/2 z-50 -translate-x-1/2 pointer-events-none"
      >
        <motion.div
          layout
          animate={{
            scale: scrolled ? 0.92 : 1,
            y: scrolled ? 8 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "pointer-events-auto rounded-full border backdrop-blur-xl",
            scrolled
              ? "bg-background/80 border-border/60 shadow-xl shadow-primary/10"
              : "bg-background/60 border-border/50 shadow-lg shadow-primary/5"
          )}
        >
          <div className="flex items-center justify-between px-6 py-3 gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
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
            </Link>

            {/* Nav Items with Hover Indicator */}
            <NavItems navItems={navItems} />

            {/* Actions: Theme, Language, Social, CTA */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <ThemeToggle />

              {/* Social Icons */}
              <Link
                href="https://www.linkedin.com/in/santiago-requelme/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn Profile"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
                  width="18"
                  height="18"
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

              <LanguageToggle />

              {/* Hire CTA Button */}
              <a
                href="mailto:santireke37@gmail.com"
                className="inline-flex h-9 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent px-5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/40 relative overflow-hidden group"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg" />
                <span className="relative">{t("header.hireMe")}</span>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Mobile Navigation - Top Fixed */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="md:hidden fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/60"
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
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
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageToggle />

            {/* Hamburger Menu — stepped lines icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex flex-col gap-[5px] items-start justify-center w-6 h-6"
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              {/* Line 1: full width */}
              <motion.span
                animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 7 : 0, width: mobileMenuOpen ? 20 : 20 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="h-[2px] bg-foreground rounded-full"
                style={{ width: 20 }}
              />
              {/* Line 2: medium — slides out on open */}
              <motion.span
                animate={{ opacity: mobileMenuOpen ? 0 : 1, x: mobileMenuOpen ? 8 : 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="h-[2px] bg-foreground rounded-full"
                style={{ width: 14 }}
              />
              {/* Line 3: short — grows to full and crosses on open */}
              <motion.span
                animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -7 : 0, width: mobileMenuOpen ? 20 : 8 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="h-[2px] bg-foreground rounded-full"
                style={{ width: 8 }}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Full-Screen Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-black/20"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 top-0 z-40 backdrop-blur-xl bg-gradient-to-b from-background/95 via-background/90 to-background/85"
            >
              <div className="flex flex-col h-full px-6 py-24">
                {/* Logo */}
                <Link
                  href="/"
                  className="flex items-center gap-3 mb-16 group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-accent to-primary bg-[length:200%_200%] animate-gradient-shift group-hover:shadow-lg group-hover:shadow-primary/50 transition-all duration-300"
                  >
                    <span className="text-lg font-bold text-primary-foreground">SR</span>
                  </motion.div>
                  <span className="text-lg font-semibold">Santiago Requelme</span>
                </Link>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-6 mb-12 flex-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-2xl font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Social Icons */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="flex items-center gap-5 mb-10"
                >
                  <Link
                    href="https://www.linkedin.com/in/santiago-requelme/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-150"
                    aria-label="LinkedIn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    <span className="text-sm font-medium">LinkedIn</span>
                  </Link>

                  <Link
                    href="https://github.com/santirequelme/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-150"
                    aria-label="GitHub"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                    <span className="text-sm font-medium">GitHub</span>
                  </Link>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="mb-8"
                >
                  <a
                    href="mailto:santireke37@gmail.com"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent px-8 text-base font-medium text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/40 w-full text-center justify-center group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg" />
                    <span className="relative">{t("header.hireMe")}</span>
                  </a>
                </motion.div>

                {/* Footer Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="text-center text-sm text-muted-foreground border-t border-border/50 pt-8"
                >
                  <p>Santiago Requelme - Full Stack Developer</p>
                  <p className="mt-2">Creating exceptional digital experiences since 2020</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
