"use client"

import { ScrollRevealSection } from "./scroll-reveal-section"

const sections = [
  {
    title: "Designed for Developers",
    content:
      "Our framework is built by developers, for developers. We understand the pain points of modern web development and have crafted solutions that make your workflow smoother.",
  },
  {
    title: "Scale Without Limits",
    content:
      "Whether you're building a personal project or an enterprise application, our infrastructure scales with you. Automatic code splitting, edge caching, and serverless functions ensure performance at any scale.",
  },
  {
    title: "Community Driven",
    content:
      "Join thousands of developers who are already building with our framework. Our active community contributes plugins, themes, and solutions daily.",
  },
]

export function ContentSections() {
  return (
    <section id="about" className="py-24 px-4 bg-card">
      <div className="mx-auto max-w-4xl space-y-16">
        {sections.map((section, index) => (
          <ScrollRevealSection key={section.title} delay={index * 0.1}>
            <article className="relative pl-8 border-l-2 border-border">
              <h3 className="text-2xl font-semibold mb-4">{section.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">{section.content}</p>
            </article>
          </ScrollRevealSection>
        ))}
      </div>
    </section>
  )
}
