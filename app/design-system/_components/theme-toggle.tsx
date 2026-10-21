"use client"

import { Moon, Sun } from "lucide-react"

/**
 * Animated light/dark toggle - a day/night pill with a morphing sun↔moon thumb
 * and twinkling stars that appear at night. Accessible (role=switch).
 */
export function ThemeToggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? "Switch to light mode" : "Switch to dark mode"}
      className="dsx-theme"
      data-on={checked}
      onClick={onChange}
    >
      {/* Night sky decorations */}
      <span className="dsx-theme__stars" aria-hidden>
        <span /><span /><span />
      </span>

      {/* Sliding thumb with morphing icon */}
      <span className="dsx-theme__thumb">
        <Sun size={14} className="dsx-theme__sun" />
        <Moon size={13} className="dsx-theme__moon" />
      </span>
    </button>
  )
}
