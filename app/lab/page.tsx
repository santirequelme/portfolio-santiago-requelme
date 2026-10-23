import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SpatialBackground } from "@/components/spatial-background"
import { HalloweenLayer } from "@/components/halloween/halloween-layer"
import { ScrollProgress } from "@/components/motion/scroll-progress"
import { LabView } from "@/components/lab/lab-view"

export const metadata: Metadata = {
  title: "AI Engineering Lab",
  description:
    "How Santiago Requelme uses AI-assisted development to go from design to production-ready code: an interactive design-to-code playground, workflow and review decisions.",
  alternates: { canonical: "/lab" },
}

// The Lab is always dark: it scopes the dark tokens (plus a graphite
// override) to this subtree instead of changing the site-wide theme.
export default function LabPage() {
  return (
    <div className="dark lab-scope lab-page relative min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <SpatialBackground />
      <HalloweenLayer />
      <Header />
      <main id="main-content">
        <LabView />
      </main>
      <Footer />
    </div>
  )
}
