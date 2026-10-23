"use client"

import { useSyncExternalStore } from "react"

// Halloween mode: on automatically during Halloween week, off the rest of the
// year. Visitors can blow out the pumpkin to turn the effects off; the choice
// is remembered. `?halloween=1` (or `=0`) previews it on any date for the
// current tab.

const PREF_KEY = "halloween"
const PREVIEW_KEY = "halloween-preview"
const EVENT = "halloween-change"

/** October 23 to November 3, in the visitor's local time. */
export function isHalloweenWeek(now = new Date()) {
  const month = now.getMonth()
  const day = now.getDate()
  return (month === 9 && day >= 23) || (month === 10 && day <= 3)
}

function readSeason() {
  try {
    const param = new URLSearchParams(window.location.search).get("halloween")
    if (param === "1" || param === "0") sessionStorage.setItem(PREVIEW_KEY, param)
    const preview = sessionStorage.getItem(PREVIEW_KEY)
    if (preview) return preview === "1"
  } catch {
    /* storage blocked: fall back to the date */
  }
  return isHalloweenWeek()
}

// Fallback for when storage is blocked, so the toggle still works for the visit.
let memoryEnabled = true

function readEnabled() {
  try {
    return localStorage.getItem(PREF_KEY) !== "off"
  } catch {
    return memoryEnabled
  }
}

// Snapshot as a string so useSyncExternalStore can compare it by value.
const snapshot = () => `${readSeason() ? 1 : 0}${readEnabled() ? 1 : 0}`
const serverSnapshot = () => "01"

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange)
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener(EVENT, onChange)
    window.removeEventListener("storage", onChange)
  }
}

export function setHalloweenEnabled(enabled: boolean) {
  memoryEnabled = enabled
  try {
    if (enabled) localStorage.removeItem(PREF_KEY)
    else localStorage.setItem(PREF_KEY, "off")
  } catch {
    /* storage blocked: memoryEnabled covers this visit */
  }
  window.dispatchEvent(new Event(EVENT))
}

export function useHalloween() {
  const s = useSyncExternalStore(subscribe, snapshot, serverSnapshot)
  const season = s[0] === "1"
  const enabled = s[1] === "1"
  return { season, enabled, active: season && enabled }
}
