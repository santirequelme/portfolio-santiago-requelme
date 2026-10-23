"use client"

import dynamic from "next/dynamic"
import { useHalloween } from "@/lib/halloween"

// The effects (SVGs, CSS and logic) live in their own chunk, requested only
// during Halloween week. The rest of the year this renders nothing.
const HalloweenEffects = dynamic(() => import("./effects").then((m) => m.HalloweenEffects), { ssr: false })

export function HalloweenLayer() {
  const { season } = useHalloween()
  return season ? <HalloweenEffects /> : null
}
