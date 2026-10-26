import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SpatialBackground } from "@/components/spatial-background"
import { HalloweenLayer } from "@/components/halloween/halloween-layer"
import { ScrollProgress } from "@/components/motion/scroll-progress"
import { LabView } from "@/components/lab/lab-view"
import { measureSavings } from "@/lib/lab/savings"
import { getRules } from "@/lib/registry"
import { readAgentsGuide } from "@/lib/registry/guide"

export const metadata: Metadata = {
  title: "AI Engineering Lab",
  description:
    "Santiago Requelme builds design systems that people and AI agents can reuse: tokens, specs and components for React, Angular, Vue, Swift and Kotlin, published as a public registry.",
  alternates: { canonical: "/lab" },
}

// The Lab is always dark: it scopes the dark tokens (plus a graphite
// override) to this subtree instead of changing the site-wide theme.
export default function LabPage() {
  // Read at build time; the simulated MCP demo shows these real rules.
  const rules = getRules(readAgentsGuide())
  const savings = measureSavings()
  return (
    <div className="dark lab-scope lab-page relative min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <SpatialBackground />
      <HalloweenLayer />
      <Header />
      <main id="main-content">
        <LabView rules={rules} savings={savings} />
      </main>
      <Footer />
    </div>
  )
}
