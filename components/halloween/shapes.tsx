// Halloween silhouettes, drawn as small inline SVGs in `currentColor` so they
// read like paper cut-outs in light mode and pick up the theme in dark mode.

/** Witch on a broom, flying right, with her cat on the back of the broom. */
export function Witch({ className }: { className?: string }) {
  return (
    <svg viewBox="-10 -10 210 120" className={className} aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <path d="M36 79 L 192 62" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" />
        <path d="M40 73 C 28 68, 14 62, 2 52 C 6 58, 6 61, 0 64 C 8 66, 6 70, -2 74 C 8 76, 8 80, 2 86 C 10 85, 12 88, 8 94 C 20 88, 30 86, 41 86 Z" />
        <rect x="38" y="72" width="6" height="15" rx="2" transform="rotate(-6 41 79)" />
        {/* cat */}
        <path d="M58 76 C 56 70, 57 64, 61 61 L 60 55 L 64 59 L 68 59 L 71 55 L 71 62 C 74 66, 74 71, 72 75 Z" />
        <path d="M58 75 C 50 74, 47 68, 50 62 C 51 60, 53 61, 52 63 C 50 68, 53 71, 58 71 Z" />
        {/* cape, skirt, boots, torso, arm */}
        <path d="M114 35 C 100 34, 86 38, 70 36 C 76 42, 74 46, 66 50 C 76 52, 80 56, 74 62 C 86 60, 98 58, 108 56 Z" />
        <path d="M106 52 C 96 58, 90 66, 86 72 C 94 76, 102 80, 108 86 C 112 80, 118 76, 126 72 C 122 64, 116 56, 112 50 Z" />
        <path d="M116 74 L 124 86 C 128 90, 134 90, 142 88 C 146 87, 148 84, 146 82 C 140 84, 134 84, 130 82 L 122 70 Z" />
        <path d="M106 54 C 106 46, 110 38, 116 33 C 121 31, 126 34, 126 39 C 124 46, 118 52, 112 56 Z" />
        <path d="M120 38 C 130 44, 140 52, 150 60 L 154 64 C 150 66, 146 65, 144 62 C 136 56, 126 50, 116 44 Z" />
        {/* head, nose, chin, hair, hat */}
        <circle cx="124" cy="26" r="7" />
        <path d="M129 24 L 138 29 L 130 30 Z" />
        <path d="M127 31 C 130 34, 132 35, 134 35 C 131 37, 128 36, 125 33 Z" />
        <path d="M118 22 C 110 24, 104 28, 96 26 C 100 30, 98 33, 92 35 C 100 36, 108 34, 118 30 Z" />
        <ellipse cx="122" cy="19" rx="16" ry="3.2" transform="rotate(-10 122 19)" />
        <path d="M112 19 C 114 10, 110 2, 98 -6 C 108 -4, 120 4, 132 16 Z" />
      </g>
    </svg>
  )
}

export function Bat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" className={className} aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <path d="M32 12 C 37 6, 47 3, 63 6 C 58 10, 58 14, 61 19 C 55 17, 52 19, 50 24 C 47 20, 43 20, 40 23 C 39 19, 36 17, 33 18 Z" />
        <path d="M32 12 C 27 6, 17 3, 1 6 C 6 10, 6 14, 3 19 C 9 17, 12 19, 14 24 C 17 20, 21 20, 24 23 C 25 19, 28 17, 31 18 Z" />
        <ellipse cx="32" cy="16" rx="3.4" ry="6" />
        <path d="M29.5 11 L 29 6.5 L 31.5 9.5 Z M 34.5 11 L 35 6.5 L 32.5 9.5 Z" />
      </g>
    </svg>
  )
}

export function Spider({ className }: { className?: string }) {
  return (
    <svg viewBox="-30 -30 60 60" className={className} aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-5 -2 L -14 -12 L -22 -6" />
        <path d="M-6 1 L -17 -3 L -25 3" />
        <path d="M-6 4 L -16 8 L -22 16" />
        <path d="M-5 6 L -11 14 L -14 23" />
        <path d="M5 -2 L 14 -12 L 22 -6" />
        <path d="M6 1 L 17 -3 L 25 3" />
        <path d="M6 4 L 16 8 L 22 16" />
        <path d="M5 6 L 11 14 L 14 23" />
      </g>
      <ellipse cx="0" cy="6" rx="8" ry="9" fill="currentColor" />
      <circle cx="0" cy="-5" r="5.5" fill="currentColor" />
      <circle cx="-2" cy="-6" r="1.6" fill="#fff" />
      <circle cx="2" cy="-6" r="1.6" fill="#fff" />
      <circle cx="-1.6" cy="-5.7" r=".8" fill="#000" />
      <circle cx="2.4" cy="-5.7" r=".8" fill="#000" />
      <path d="M-3 9 L 0 6 L 3 9 L 0 12 Z" fill="var(--primary)" />
    </svg>
  )
}

// Corner web: radial threads from the corner plus sagging spiral threads,
// computed once at module load.
const WEB_PATH = (() => {
  const R = 230
  const spokes = Array.from({ length: 7 }, (_, i) => (i / 6) * (Math.PI / 2))
  const pt = (a: number, r: number) => `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`
  let d = spokes.map((a) => `M0 0 L${pt(a, R)}`).join("")
  ;[42, 78, 114, 150, 188].forEach((r, ring) => {
    spokes.slice(0, -1).forEach((a1, i) => {
      const a2 = spokes[i + 1]
      // Slightly uneven sag so the web doesn't look machine-made.
      const sag = 0.84 + ((ring + i) % 3) * 0.03
      d += `${i === 0 ? "M" : "L"}${pt(a1, r)}Q${pt((a1 + a2) / 2, r * sag)} ${pt(a2, r)}`
    })
  })
  return d
})()

export function Cobweb({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true" focusable="false">
      <path className="hw-web-path" d={WEB_PATH} pathLength={1} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

/** Jack-o'-lantern. `lit` switches the carved face between candle glow and dark. */
export function Pumpkin({ lit, className }: { lit: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="hw-pumpkin" cx="50%" cy="42%" r="62%">
          <stop offset="0" stopColor="#ff9f45" />
          <stop offset=".7" stopColor="#f0741c" />
          <stop offset="1" stopColor="#c4520c" />
        </radialGradient>
        <radialGradient id="hw-flame" cx="50%" cy="65%" r="65%">
          <stop offset="0" stopColor="#fff6c2" />
          <stop offset=".45" stopColor="#ffc93d" />
          <stop offset="1" stopColor="#ff8a00" />
        </radialGradient>
      </defs>
      <path d="M50 24 C 49 15, 52 8, 59 4 C 61 6, 61 8, 59 9 C 56 12, 55 17, 56 25 Z" fill="#4d5b22" />
      <ellipse cx="28" cy="61" rx="22" ry="29" fill="#d4600f" />
      <ellipse cx="72" cy="61" rx="22" ry="29" fill="#d4600f" />
      <ellipse cx="38" cy="61" rx="20" ry="30" fill="url(#hw-pumpkin)" />
      <ellipse cx="62" cy="61" rx="20" ry="30" fill="url(#hw-pumpkin)" />
      <ellipse cx="50" cy="61" rx="15" ry="31" fill="url(#hw-pumpkin)" />
      <g fill="#3a1705">
        <FacePaths />
      </g>
      <g className="hw-face" fill="url(#hw-flame)" style={{ opacity: lit ? 1 : 0 }}>
        <FacePaths />
      </g>
    </svg>
  )
}

function FacePaths() {
  return (
    <>
      <path d="M24 52 L 41 52 L 33 37 Z" />
      <path d="M59 52 L 76 52 L 67 37 Z" />
      <path d="M46 60 L 54 60 L 50 53 Z" />
      <path d="M20 64 C 30 80, 70 80, 80 64 L 72 67 L 67 74 L 61 68 L 55 76 L 50 69 L 45 76 L 39 68 L 33 74 L 28 67 Z" />
    </>
  )
}
