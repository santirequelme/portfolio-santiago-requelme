"use client"

import { ScrollRevealSection } from "./scroll-reveal-section"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export function ProjectsList() {
  const { t } = useLanguage()

  const projects = [
    {
      title: t("projects.wedding.title"),
      description: t("projects.wedding.description"),
      image: "/images/Weddings.png",
      url: "https://www.riu.com/es/weddings",
    },
    {
      title: t("projects.booking.title"),
      description: t("projects.booking.description"),
      image: "/images/booking.png",
      url: "https://www.riu.com/en/booking",
    },
    {
      title: t("projects.experience.title"),
      description: t("projects.experience.description"),
      image: "/images/experience.png",
      url: "https://www.riu.com/en/riu-experience/",
    },
    {
      title: t("projects.hotel.title"),
      description: t("projects.hotel.description"),
      image: "/images/homepage.png",
      url: "https://www.riu.com/en",
    },
    {
      title: t("projects.hubspot.title"),
      description: t("projects.hubspot.description"),
      image: "/images/hubspot.png",
      url: "https://rocketx.group/",
    },
    {
      title: t("projects.email-campaigns.title"),
      description: t("projects.email-campaigns.description"),
      image: "/images/email-campaign.png",
      url: "https://rocketx.group/",
    },
  ]

  return (
    <section id="projectList" className="py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <ScrollRevealSection className="text-center mb-16">
          <AnimatePresence mode="wait">
            <motion.h2
              key={t("projects.title")}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
            >
              {t("projects.title")}
            </motion.h2>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={t("projects.subtitle")}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-4 max-w-xl text-lg text-muted-foreground mx-auto"
            >
              {t("projects.subtitle")}
            </motion.p>
          </AnimatePresence>
        </ScrollRevealSection>

        <div className="grid gap-8 md:grid-cols-3">
          {projects.map((project, index) => (
            <ScrollRevealSection key={`${project.title}-${index}`} className="h-full">
              <Link href={project.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                <div className="h-full flex flex-col group relative rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-primary/5 before:to-accent/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity overflow-hidden cursor-pointer">
                  <div className="h-full flex flex-col relative z-10">
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </div>

                    <div className="p-6 flex-grow">
                      <AnimatePresence mode="wait">
                        <motion.h3
                          key={project.title}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-xl font-semibold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                        >
                          {project.title}
                        </motion.h3>
                      </AnimatePresence>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={project.description}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-muted-foreground leading-relaxed text-sm"
                        >
                          {project.description}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollRevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}
