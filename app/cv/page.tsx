import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SpatialBackground } from "@/components/spatial-background"
import { HalloweenLayer } from "@/components/halloween/halloween-layer"
import { ScrollProgress } from "@/components/motion/scroll-progress"
import { CvView } from "@/components/cv/cv-view"

export const metadata: Metadata = {
  title: "CV",
  description: "Experience, selected work and skills of Santiago Requelme, product engineer with a frontend and design background.",
  alternates: { canonical: "/cv" },
}

export default function CvPage() {
  return (
    <div className="min-h-screen relative">
      <ScrollProgress />
      <div className="print:hidden">
        <SpatialBackground />
        <HalloweenLayer />
        <Header />
      </div>
      <main id="main-content">
        <CvView />
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  )
}
