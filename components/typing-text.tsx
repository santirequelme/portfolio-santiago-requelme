"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { motion, AnimatePresence } from "framer-motion"

export function TypingText() {
  const { t } = useLanguage()
  const titles = [t("hero.role1"), t("hero.role2"), t("hero.role3")]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    const currentTitle = titles[currentIndex]

    const handleTyping = () => {
      if (!isDeleting) {
        if (currentText.length < currentTitle.length) {
          setCurrentText(currentTitle.slice(0, currentText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 3000)
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % titles.length)
        }
      }
    }

    const typingSpeed = isDeleting ? 20 : 50
    const timeout = setTimeout(handleTyping, typingSpeed)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentIndex])

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={currentText}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="inline-block"
      >
        {currentText}
        <span
          className={`inline-block w-0.5 h-[1em] bg-foreground ml-1 align-middle ${showCursor ? "opacity-100" : "opacity-0"}`}
        />
      </motion.span>
    </AnimatePresence>
  )
}
