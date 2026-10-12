"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"

export function TypingText() {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentText, setCurrentText] = useState(() => t("hero.role1"))
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  const titles = [t("hero.role1"), t("hero.role2"), t("hero.role3")]

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    setCurrentText(t("hero.role1"))
    setCurrentIndex(0)
    setIsDeleting(false)
  }, [t("hero.role1")]) // Reset when language changes

  useEffect(() => {
    const currentTitle = titles[currentIndex]
    const isComplete = !isDeleting && currentText === currentTitle
    const delay = isComplete ? 3000 : isDeleting ? 20 : 60

    const timeout = setTimeout(() => {
      if (isComplete) {
        setIsDeleting(true)
      } else if (!isDeleting) {
        setCurrentText(currentTitle.slice(0, currentText.length + 1))
      } else if (currentText.length > 0) {
        setCurrentText(currentText.slice(0, -1))
      } else {
        setIsDeleting(false)
        setCurrentIndex((prev) => (prev + 1) % titles.length)
      }
    }, delay)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentIndex]) // Removed titles from dependencies

  return (
    <span className="inline-block">
      {currentText}
      <span
        className={`inline-block w-0.5 h-[1em] bg-foreground ml-1 align-middle transition-opacity duration-100 ${showCursor ? "opacity-100" : "opacity-0"}`}
      />
    </span>
  )
}
