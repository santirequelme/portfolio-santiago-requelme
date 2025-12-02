import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
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
        <Features />
        <ContentSections />
      </main>
      <Footer />
    </div>
  )
}
