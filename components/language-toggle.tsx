"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="relative flex items-center gap-1 rounded-full bg-background/40 backdrop-blur-md border border-border/50 p-1">
      <motion.div
        className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/30"
        animate={{
          x: language === "en" ? 2 : "calc(100% + 0.25rem)",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        layoutId="language-indicator"
      />

      <button
        onClick={() => setLanguage("en")}
        className={`relative z-10 px-3 py-1.5 text-sm font-medium transition-colors rounded-full ${
          language === "en" ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>

      <button
        onClick={() => setLanguage("es")}
        className={`relative z-10 px-3 py-1.5 text-sm font-medium transition-colors rounded-full ${
          language === "es" ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
    </div>
  )
}
