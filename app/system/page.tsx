import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SpatialBackground } from "@/components/spatial-background"
import { ScrollProgress } from "@/components/motion/scroll-progress"
import { SystemView } from "@/components/system/system-view"

export const metadata: Metadata = {
  title: "System",
  description: "The design system behind Santiago Requelme's portfolio: colour, typography, spacing, components and motion.",
  alternates: { canonical: "/system" },
}

export default function SystemPage() {
  return (
    <div className="min-h-screen relative">
      <ScrollProgress />
      <SpatialBackground />
      <Header />
      <main id="main-content">
        <SystemView />
      </main>
      <Footer />
    </div>
  )
}
