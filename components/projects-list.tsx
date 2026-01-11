"use client"

import { ScrollRevealSection } from "./scroll-reveal-section"
import Image from "next/image"

const projects = [
  {
    title: "Wedding Planner App",
    description:
      "Hotel chain app for instant wedding quotes based on venue, style, guests, and extras. Delivered an intuitive, responsive UI by translating complex requirements into clean, scalable frontend solutions.",
    image: "/images/Weddings.png",
  },
  {
    title: "Hotel Booking App",
    description:
      "Personalized getaway booking app with real-time pricing. Mastered complex challenges: dynamic pricing layouts, multi-device responsiveness, and seamless state management from prototypes to production.",
    image: "/images/Booking.png",
  },
  {
    title: "Experience App",
    description:
      "Immersive app highlighting unique hotel experiences, entertainment, and guest activities. Resolving issues like dynamic content rendering, smooth animations across devices, and turning rich media prototypes into performant code.",
    image: "/images/experience.png",
  },
  {
    title: "Hotel Platform",
    description:
      "Dynamic hotel chain platform. Fixing high-impact hero animations, fast-loading multilingual sections, fully responsive layouts from design to code, improving SEO and overall performance.",
    image: "/images/homepage.png",
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
          <p className="mt-4 text-lg text-muted-foreground mx-auto">
          A showcase of projects, leading teams to deliver precision UI and intentional UX.
          </p>
        </ScrollRevealSection>

        <div className="grid gap-8 md:grid-cols-3">
          {projects.map((project, index) => (
            <ScrollRevealSection key={`${project.title}-${index}`} delay={index * 0.15} className="h-full">
              <div className="h-full flex flex-col group relative rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-primary/5 before:to-accent/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity overflow-hidden">
                <div className="h-full flex flex-col relative z-10">
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <div className="relative aspect-4/3 w-full overflow-hidden">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>

                  <div className="p-6 flex-grow">
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
