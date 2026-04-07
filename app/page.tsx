import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProjectsList } from "@/components/projects-list"
import { ContentSections } from "@/components/content-sections"
import { Footer } from "@/components/footer"
import { SpatialBackground } from "@/components/spatial-background"

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <SpatialBackground />
      <Header />
      <main id="main-content">
        <Hero />
        <ProjectsList />
        <ContentSections />
      </main>
      <Footer />
    </div>
  )
}
