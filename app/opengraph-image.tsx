import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const alt = "Santiago Requelme — Product Engineer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  const avatar = await readFile(join(process.cwd(), "public/images/og-avatar.png"))
  const avatarSrc = `data:image/png;base64,${avatar.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "80px 96px",
          backgroundColor: "#0b0814",
          backgroundImage:
            "radial-gradient(circle at 85% 30%, rgba(164,88,255,0.35), transparent 55%), radial-gradient(circle at 10% 90%, rgba(88,101,255,0.25), transparent 50%)",
          color: "#f5f3ff",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ fontSize: 28, color: "#a458ff", letterSpacing: 2, textTransform: "uppercase" }}>
            Portfolio
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, marginTop: 20 }}>Santiago Requelme</div>
          <div style={{ fontSize: 40, color: "#b8b3cc", marginTop: 16 }}>Product Engineer · Frontend & Design</div>
          <div style={{ fontSize: 26, color: "#8a849e", marginTop: 48 }}>santirequelme.dev</div>
        </div>
        <img
          src={avatarSrc}
          width={320}
          height={320}
          alt=""
          style={{ borderRadius: 32, border: "2px solid rgba(164,88,255,0.5)", objectFit: "cover" }}
        />
      </div>
    ),
    size,
  )
}
