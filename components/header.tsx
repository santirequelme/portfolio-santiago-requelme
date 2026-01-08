"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { HamburgerMenu } from "./hamburger-menu"
import { ThemeToggle } from "./theme-toggle"

const navItems = [
  { name: "Projects", href: "#projectList" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)

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
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <span className="text-sm font-bold text-background">SR</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Santiago Requelme</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-sm text-muted-foreground transition-colors hover:text-foreground group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </Link>
            <Link
              href="#"
              className="inline-flex h-9 items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-all hover:scale-105 hover:opacity-90"
            >
              Get Started
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <HamburgerMenu items={navItems} />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
