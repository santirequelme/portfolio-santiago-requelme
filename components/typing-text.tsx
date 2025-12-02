"use client"

import { useEffect, useState } from "react"

const titles = ["Frontend engineer", "UI specialist", "Problem solver"]

export function TypingText() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    // Blinking cursor effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    const currentTitle = titles[currentIndex]

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing phase
        if (currentText.length < currentTitle.length) {
          setCurrentText(currentTitle.slice(0, currentText.length + 1))
        } else {
          // Wait 3 seconds before deleting
          setTimeout(() => setIsDeleting(true), 3000)
        }
      } else {
        // Deleting phase
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1))
        } else {
          // Move to next title
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % titles.length)
        }
      }
    }

    const typingSpeed = isDeleting ? 50 : 100
    const timeout = setTimeout(handleTyping, typingSpeed)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentIndex])

  return (
    <span className="inline-block">
      {currentText}
      <span
        className={`inline-block w-0.5 h-[1em] bg-foreground ml-1 align-middle ${showCursor ? "opacity-100" : "opacity-0"}`}
      />
    </span>
  )
}
