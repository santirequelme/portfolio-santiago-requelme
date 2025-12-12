"use client"

import { ScrollRevealSection } from "./scroll-reveal-section"

const features = [
  {
    title: "Lightning Fast",
    description: "Built on Next.js 16 with Turbopack, delivering blazing-fast development and production builds.",
    icon: "⚡",
  },
  {
    title: "Type Safe",
    description:
      "Full TypeScript support out of the box. Catch errors before they happen with intelligent autocomplete.",
    icon: "🛡️",
  },
  {
    title: "Beautifully Minimal",
    description: "Clean, modern design with TailwindCSS. Every component is crafted with attention to detail.",
    icon: "✨",
  },
]

export function ProjectsList() {
  return (
    <section id="projectList" className="py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <ScrollRevealSection className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Projects</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with modern tools and best practices for optimal performance
          </p>
        </ScrollRevealSection>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <ScrollRevealSection key={feature.title} delay={index * 0.15}>
              <div className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-muted-foreground/20 hover:shadow-lg">
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </ScrollRevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}
