"use client"

import { ScrollRevealSection } from "./scroll-reveal-section"

const sections = [
  {
    title: "A problem solver",
    content:
      "Someone who leaves no loose ends, testing, refining, and iterating until the visual and technical solutions are solid and consistent.",
  },
  {
    title: "A change maker",
    content:
      "Able to translate research, data, and design processes into clear technical decisions, aligning business goals with precise and maintainable frontend implementations.",
  },
  {
    title: "A design champion",
    content:
      "A user advocate who ensures that user needs and perspectives are respected throughout the development process, from design to the final product.",
  },
]

export function ContentSections() {
  return (
    <section id="about" className="py-24 px-4 bg-card">
      <div className="mx-auto max-w-4xl space-y-12">
        <ScrollRevealSection>
          <h2 className="text-3xl font-semibold pb-8">Who am I ? </h2>
          <p className="text-xl mb-4">🧑🏽‍💻 Design speaks. I code it.
            I craft beautiful, reliable interfaces that delight users and solve problems. Pixel-perfect, fast-moving Frontend & UI Developer turning chaos into clean, elegant code from Figma designs.</p>
        </ScrollRevealSection>
        {sections.map((section, index) => (
          <ScrollRevealSection key={section.title} delay={index * 0.1}>
            <article className="relative pl-8 border-l-2 border-border">
              <h3 className="text-2xl font-semibold mb-4">{section.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">{section.content}</p>
            </article>
          </ScrollRevealSection>
        ))}
        <a
          href="mailto:santireke37@gmail.com"
          className="flex w-fit mx-auto mt-4 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent py-5 px-12 text-sm font-medium text-primary-foreground transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
        >
          Work with me!
        </a>
      </div>
    </section>
  )
}
