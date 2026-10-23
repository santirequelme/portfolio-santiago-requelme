"use client"

// Dracula costume for the hero portrait. The portrait is a transparent PNG,
// so the night sky and the high collar go *behind* it and the cape, medallion
// and fangs go on top. Coordinates are in the photo's own 1080 × 1080 space.

import { Bat } from "./shapes"
import "./halloween.css"

const STARS = [
  [120, 140, 4],
  [960, 120, 3],
  [880, 260, 2.5],
  [200, 320, 2.5],
  [60, 470, 3],
  [1010, 430, 2.5],
  [300, 90, 2],
  [770, 70, 2],
] as const

// Bats over the moon, as HTML so their flapping stays on the compositor
// (animating elements inside an SVG re-runs layout every frame).
const MOON_BATS = [
  { left: "70%", top: "15%", width: "11%", delay: "0s" },
  { left: "20%", top: "52%", width: "7.5%", delay: "-0.1s" },
]

export function CostumeBack() {
  return (
    <div className="hw-costume" aria-hidden="true">
      <svg viewBox="0 0 1080 1080" className="hw-costume" focusable="false">
        <defs>
          <radialGradient id="hw-c-sky" cx="50%" cy="35%" r="75%">
            <stop offset="0" stopColor="#3b2350" />
            <stop offset=".6" stopColor="#1d1230" />
            <stop offset="1" stopColor="#0d0a16" />
          </radialGradient>
          <radialGradient id="hw-c-moon" cx="45%" cy="40%" r="60%">
            <stop offset="0" stopColor="#ffd9a0" />
            <stop offset=".7" stopColor="#f3a65a" />
            <stop offset="1" stopColor="#e2763a" />
          </radialGradient>
          <radialGradient id="hw-c-halo">
            <stop offset=".55" stopColor="#f3a65a" stopOpacity=".35" />
            <stop offset="1" stopColor="#f3a65a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hw-c-lining" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e0304a" />
            <stop offset="1" stopColor="#6d0818" />
          </linearGradient>
        </defs>
        <rect width="1080" height="1080" fill="url(#hw-c-sky)" />
        <circle cx="540" cy="400" r="460" fill="url(#hw-c-halo)" />
        <circle cx="540" cy="400" r="330" fill="url(#hw-c-moon)" />
        <g fill="#c9642d" opacity=".35">
          <circle cx="420" cy="300" r="40" />
          <circle cx="660" cy="520" r="28" />
          <circle cx="700" cy="270" r="18" />
        </g>
        <g fill="#fff">
          {STARS.map(([x, y, r]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
          ))}
        </g>
        {/* High collar, behind the hair */}
        <path d="M300 900 C 230 800, 120 600, 40 300 C 160 420, 250 520, 330 640 Z" fill="#0b0709" />
        <path d="M300 860 C 240 770, 160 610, 90 390 C 180 490, 250 560, 320 660 Z" fill="url(#hw-c-lining)" />
        <path d="M780 900 C 850 800, 960 600, 1040 300 C 920 420, 830 520, 750 640 Z" fill="#0b0709" />
        <path d="M780 860 C 840 770, 920 610, 990 390 C 900 490, 830 560, 760 660 Z" fill="url(#hw-c-lining)" />
      </svg>
      {MOON_BATS.map((b) => (
        <span key={b.left} className="hw-costume-bat" style={{ left: b.left, top: b.top, width: b.width, "--d": b.delay } as React.CSSProperties}>
          <Bat />
        </span>
      ))}
    </div>
  )
}

/** `hovered` follows the photo swap: fangs move with the smile, the open eye glows. */
export function CostumeFront({ hovered }: { hovered: boolean }) {
  return (
    <svg viewBox="0 0 1080 1080" className={`hw-costume ${hovered ? "is-hovered" : ""}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="hw-c-satin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a1d22" />
          <stop offset=".45" stopColor="#0d0709" />
          <stop offset="1" stopColor="#1c1216" />
        </linearGradient>
        <linearGradient id="hw-c-lining-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e0304a" />
          <stop offset="1" stopColor="#7d0a1d" />
        </linearGradient>
        <radialGradient id="hw-c-gem" cx="40%" cy="35%">
          <stop offset="0" stopColor="#ff6b7d" />
          <stop offset=".5" stopColor="#c3102c" />
          <stop offset="1" stopColor="#5a0614" />
        </radialGradient>
        <radialGradient id="hw-c-eye">
          <stop offset="0" stopColor="#ff2a3d" stopOpacity=".95" />
          <stop offset=".45" stopColor="#ff2a3d" stopOpacity=".45" />
          <stop offset="1" stopColor="#ff2a3d" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Cape over the shoulders, red lining at the opening */}
      <path d="M392 778 C 300 800, 150 850, 70 940 C 30 990, 10 1040, 0 1080 L 330 1080 C 350 960, 380 860, 420 790 Z" fill="url(#hw-c-lining-front)" />
      <path d="M392 778 C 300 800, 150 850, 70 940 C 30 990, 10 1040, 0 1080 L 300 1080 C 320 960, 350 860, 392 790 Z" fill="url(#hw-c-satin)" />
      <path d="M688 778 C 780 800, 930 850, 1010 940 C 1050 990, 1070 1040, 1080 1080 L 750 1080 C 730 960, 700 860, 660 790 Z" fill="url(#hw-c-lining-front)" />
      <path d="M688 778 C 780 800, 930 850, 1010 940 C 1050 990, 1070 1040, 1080 1080 L 780 1080 C 760 960, 730 860, 688 790 Z" fill="url(#hw-c-satin)" />
      <g stroke="#5a4650" strokeWidth="6" fill="none" opacity=".5" strokeLinecap="round">
        <path d="M150 870 C 110 900, 80 940, 60 990" />
        <path d="M930 870 C 970 900, 1000 940, 1020 990" />
      </g>

      {/* Ribbon and medallion */}
      <path d="M455 790 L 540 935 L 625 790" fill="none" stroke="#9d0f25" strokeWidth="14" strokeLinejoin="round" />
      <circle cx="540" cy="955" r="40" fill="#d9a441" stroke="#8a5f17" strokeWidth="5" />
      <circle cx="540" cy="955" r="24" fill="url(#hw-c-gem)" />

      {/* Fangs: closed smile (default photo) and open smile (wink photo) */}
      <g fill="#fffdf6" stroke="#cdbfae" strokeWidth="2">
        <path className="hw-fangs" style={{ opacity: hovered ? 0 : 1 }} d="M484 552 L 491 580 L 499 553 Z M 580 552 L 588 580 L 595 551 Z" />
        <path className="hw-fangs" style={{ opacity: hovered ? 1 : 0 }} d="M478 556 L 487 592 L 497 558 Z M 603 554 L 613 590 L 621 552 Z" />
      </g>

      {/* Red glint in the open eye while he winks */}
      <circle className="hw-eye-glow" cx="446" cy="396" r="34" fill="url(#hw-c-eye)" style={{ mixBlendMode: "screen" }} />
    </svg>
  )
}

// Outward flight paths for the bats that burst from behind the portrait.
const BURST = [
  { x: "-170px", y: "-210px", r: "-18deg", s: "44px", d: "0s" },
  { x: "160px", y: "-240px", r: "16deg", s: "38px", d: "0.05s" },
  { x: "-230px", y: "-60px", r: "-24deg", s: "32px", d: "0.1s" },
  { x: "240px", y: "-90px", r: "22deg", s: "36px", d: "0.08s" },
  { x: "-60px", y: "-300px", r: "-6deg", s: "30px", d: "0.14s" },
  { x: "70px", y: "-280px", r: "10deg", s: "28px", d: "0.18s" },
  { x: "210px", y: "40px", r: "28deg", s: "26px", d: "0.2s" },
]

/** Bats that fly out from behind the card; re-mount (change `key`) to replay. */
export function BatBurst() {
  return (
    <div className="hw-burst" aria-hidden="true">
      {BURST.map((b, i) => (
        <span
          key={i}
          className="hw-burst-bat"
          style={{ "--x": b.x, "--y": b.y, "--r": b.r, "--s": b.s, "--d": b.d } as React.CSSProperties}
        >
          <Bat />
        </span>
      ))}
    </div>
  )
}
