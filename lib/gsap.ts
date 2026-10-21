"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

// Shared media queries - animations only run when the user allows motion,
// pointer effects only run on a real mouse.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)"
export const FINE_POINTER = "(pointer: fine) and (prefers-reduced-motion: no-preference)"

export { gsap, ScrollTrigger, useGSAP }
