import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProjectsList } from "@/components/projects-list"
import { ContentSections } from "@/components/content-sections"
import { Footer } from "@/components/footer"
import { CursorEffect } from "@/components/cursor-effect"

export default function Home() {
  return (
    <div className="min-h-screen">
      <CursorEffect />
      <Header />
      <main>
        <Hero />
        <ProjectsList />
        <ContentSections />
      </main>
      <Footer />
    </div>
  )
}
