"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { setHalloweenEnabled, useHalloween } from "@/lib/halloween"
import { cn } from "@/lib/utils"
import { Bat, Cobweb, Pumpkin, Spider, Witch } from "./shapes"
import "./halloween.css"

const WITCHES = [
  { y: "15vh", w: "clamp(120px, 13vw, 190px)", dur: "26s", delay: "1.5s", o: 0.92, far: false },
  { y: "6vh", w: "clamp(70px, 7vw, 105px)", dur: "39s", delay: "15s", o: 0.5, far: true },
]

const BATS = [
  { r: "clamp(110px, 15vw, 230px)", s: "36px", dur: "16s", dir: "normal" },
  { r: "clamp(140px, 19vw, 280px)", s: "26px", dur: "23s", dir: "reverse" },
  { r: "clamp(95px, 12vw, 190px)", s: "20px", dur: "12s", dir: "normal" },
]

export function HalloweenEffects() {
  const { enabled } = useHalloween()
  const pathname = usePathname()
  // Keep the scene mounted while it fades out after the candle is blown out.
  const [mounted, setMounted] = useState(enabled)
  useEffect(() => {
    if (enabled) {
      setMounted(true)
      return
    }
    const id = setTimeout(() => setMounted(false), 800)
    return () => clearTimeout(id)
  }, [enabled])

  return (
    <>
      <div aria-hidden="true" className={cn("hw-sky print:hidden", !enabled && "hw-off")}>
        {mounted && (
          <>
            <div className="hw-moon" />
            {BATS.map((b, i) => (
              <div
                key={i}
                className={`hw-orbit hw-orbit--${i + 1}`}
                style={{ "--dur": b.dur, "--dir": b.dir } as React.CSSProperties}
              >
                <div className="hw-bat" style={{ "--r": b.r, "--s": b.s, "--dur": b.dur } as React.CSSProperties}>
                  <Bat />
                </div>
              </div>
            ))}
            {WITCHES.map((w, i) => (
              <div
                key={i}
                className={cn("hw-witch", w.far && "hw-witch--far")}
                style={{ "--y": w.y, "--w": w.w, "--dur": w.dur, "--delay": w.delay, "--o": w.o } as React.CSSProperties}
              >
                <Witch />
              </div>
            ))}
          </>
        )}
      </div>

      <div className="hw-overlay print:hidden">
        {mounted && (
          <div aria-hidden="true" className={cn("hw-scene", !enabled && "hw-off")}>
            <Cobweb className="hw-web hw-web--left" />
            <Cobweb className="hw-web hw-web--right" />
            {/* Re-mount per page so the spider drops in again after navigation. */}
            <DanglingSpider key={pathname} />
          </div>
        )}
        <PumpkinSwitch lit={enabled} />
      </div>
    </>
  )
}

/** Hangs from the right-hand web; scurries up when the pointer gets close. */
function DanglingSpider() {
  const rigRef = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const flee = () => {
    const rig = rigRef.current
    if (!rig || busy.current || !rig.animate) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    busy.current = true
    const from = getComputedStyle(rig).transform
    rig.classList.add("is-holding")
    const up = rig.animate([{ transform: from }, { transform: "translate3d(0, -70px, 0)" }], {
      duration: 420,
      easing: "cubic-bezier(.2,.8,.2,1)",
      fill: "forwards",
    })
    timers.current.push(
      setTimeout(() => {
        // Come back down to where the idle loop starts, then hand over to it.
        const down = rig.animate([{ transform: "translate3d(0, -70px, 0)" }, { transform: "translate3d(0, 14vh, 0)" }], {
          duration: 1600,
          easing: "cubic-bezier(.3,.1,.3,1)",
          fill: "forwards",
        })
        down.onfinish = () => {
          up.cancel()
          down.cancel()
          rig.classList.remove("is-holding")
          busy.current = false
        }
      }, 2600),
    )
  }

  return (
    <div ref={rigRef} className="hw-spider-rig" aria-hidden="true">
      <span className="hw-thread" />
      <span onPointerEnter={flee} onPointerDown={flee}>
        <Spider className="hw-spider" />
      </span>
    </div>
  )
}

/** The pumpkin is the on/off switch: blow out the candle to turn the effects off. */
function PumpkinSwitch({ lit }: { lit: boolean }) {
  const { language } = useLanguage()
  const [puffs, setPuffs] = useState(0)
  const label =
    language === "es"
      ? lit
        ? "Apagar la vela (desactiva Halloween)"
        : "Encender la vela (activa Halloween)"
      : lit
        ? "Blow out the candle (turns Halloween off)"
        : "Light the candle (turns Halloween on)"

  return (
    <button
      type="button"
      aria-pressed={lit}
      aria-label={label}
      onClick={() => {
        if (lit) setPuffs((n) => n + 1)
        setHalloweenEnabled(!lit)
      }}
      className={cn("hw-pumpkin-btn", lit && "is-lit")}
    >
      <span className="hw-glow" aria-hidden="true" />
      {puffs > 0 && !lit && <span key={puffs} className="hw-smoke" aria-hidden="true" />}
      <Pumpkin lit={lit} />
      <span className="hw-tip" aria-hidden="true">
        {label}
      </span>
    </button>
  )
}
