import type { Metadata } from "next"
import { Showcase } from "./_components/showcase"
import "./design-system.css"

export const metadata: Metadata = {
  title: "Aura Design System",
  description:
    "Aura — a compact, composable design system: semantic tokens, a considered type and spacing scale, and accessible, themeable components (buttons, tooltips, switches, inputs, modals, toasts, drag & drop, gallery).",
}

export default function DesignSystemPage() {
  return <Showcase />
}
