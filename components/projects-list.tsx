"use client"

import { ScrollRevealSection } from "./scroll-reveal-section"
import Image from "next/image"

const projects = [
  {
    title: "Experiencies",
    description:
      "Colaboré en este proyecto con un equipo, participando en el desarrollo de interfaces modernas, con foco en UI/UX y buenas prácticas frontend.",
    image: "/images/screenshot-202026-01-09-20at-208.png",
  },
  {
    title: "Experiencies",
    description:
      "Colaboré en este proyecto con un equipo, participando en el desarrollo de interfaces modernas, con foco en UI/UX y buenas prácticas frontend.",
    image: "/images/screenshot-202026-01-09-20at-208.png",
  },
  {
    title: "Experiencies",
    description:
      "Colaboré en este proyecto con un equipo, participando en el desarrollo de interfaces modernas, con foco en UI/UX y buenas prácticas frontend.",
    image: "/images/screenshot-202026-01-09-20at-208.png",
  },
]

export function ProjectsList() {
  return (
    <section id="projectList" className="py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <ScrollRevealSection className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Projects
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with modern tools and best practices for optimal performance
          </p>
        </ScrollRevealSection>

        <div className="grid gap-8 md:grid-cols-3">
          {projects.map((project, index) => (
            <ScrollRevealSection key={`${project.title}-${index}`} delay={index * 0.15}>
              <div className="group relative rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-primary/5 before:to-accent/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity overflow-hidden">
                <div className="relative z-10">
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <div className="relative aspect-video w-full overflow-hidden">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{project.description}</p>
                  </div>
                </div>
              </div>
            </ScrollRevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}
