"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="relative inline-flex items-center rounded-full bg-muted/30 backdrop-blur-md p-1 border border-border/50">
      <motion.div
        className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/30"
        initial={false}
        animate={{
          x: language === "en" ? 2 : "calc(100% + 2px)",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      />

      <button
        onClick={() => setLanguage("en")}
        className={`relative z-10 px-3 py-1 text-xs font-medium transition-colors duration-300 ${
          language === "en" ? "text-primary" : "text-muted-foreground"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>

      <button
        onClick={() => setLanguage("es")}
        className={`relative z-10 px-3 py-1 text-xs font-medium transition-colors duration-300 ${
          language === "es" ? "text-primary" : "text-muted-foreground"
        }`}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
    </div>
  )
}
