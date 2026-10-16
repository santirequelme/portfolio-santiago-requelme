"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="relative inline-flex items-center rounded-control bg-secondary p-0.5 border border-border">
      <motion.div
        className="absolute left-0 inset-y-0.5 w-[calc(50%-2px)] rounded-[6px] bg-card shadow-[0_1px_2px_rgb(0_0_0/0.1)] border border-border"
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
        className={`relative z-10 px-2.5 py-1 font-mono text-[11px] font-medium transition-colors duration-300 ${
          language === "en" ? "text-primary" : "text-muted-foreground"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>

      <button
        onClick={() => setLanguage("es")}
        className={`relative z-10 px-2.5 py-1 font-mono text-[11px] font-medium transition-colors duration-300 ${
          language === "es" ? "text-primary" : "text-muted-foreground"
        }`}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
    </div>
  )
}
