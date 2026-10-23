import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SpatialBackground } from "@/components/spatial-background"
import { HalloweenLayer } from "@/components/halloween/halloween-layer"
import { CaseStudyView } from "@/components/case-study/case-study-view"
import { CASE_STUDIES, getCaseStudy } from "@/lib/case-studies"

export const dynamicParams = false

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) return {}

  return {
    title: study.content.en.title,
    description: study.content.en.summary,
    alternates: { canonical: `/work/${slug}` },
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getCaseStudy(slug)) notFound()

  return (
    <div className="min-h-screen relative">
      <SpatialBackground />
      <HalloweenLayer />
      <Header />
      <main id="main-content">
        <CaseStudyView slug={slug} />
      </main>
      <Footer />
    </div>
  )
}
