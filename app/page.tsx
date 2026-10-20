import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProjectsList } from "@/components/projects-list"
import { ContentSections } from "@/components/content-sections"
import { Footer } from "@/components/footer"
import { SpatialBackground } from "@/components/spatial-background"
import { ScrollProgress } from "@/components/motion/scroll-progress"
import { LabTeaser } from "@/components/lab/lab-teaser"

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <ScrollProgress />
      <SpatialBackground />
      <Header />
      <main id="main-content">
        <Hero />
        <ProjectsList />
        <LabTeaser />
        <ContentSections />
      </main>
      <Footer />
    </div>
  )
}
