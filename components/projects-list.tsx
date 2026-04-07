"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export function ProjectsList() {
  const { t } = useLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })

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
      title: t("projects.supply-chain-dashboard.title"),
      description: t("projects.supply-chain-dashboard.description"),
      image: "/images/dashboard.png",
      url: "https://suply-chain-dashboard.vercel.app/",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  }

  return (
    <section ref={sectionRef} id="projectList" className="relative py-32 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="inline-block bg-gradient-to-r from-violet-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                {t("projects.title")}
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">
              {t("projects.subtitle")}
            </p>
          </motion.div>
        </div>

        {/* Projects Grid */}
        <motion.div
          className="grid gap-6 md:gap-8 md:grid-cols-3 lg:gap-10"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {projects.map((project, index) => (
            <motion.div key={`project-${index}`} variants={cardVariants}>
              <Link
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full"
              >
                {/* Glass Card Container — CSS transform, no Framer Motion on hover */}
                <div className="relative h-full flex flex-col rounded-2xl border border-slate-700/50 bg-slate-950/70 overflow-hidden transition-[transform,box-shadow,border-color] duration-150 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10 hover:scale-[1.02] will-change-transform">
                  {/* Inner shadow for depth */}
                  <div className="absolute inset-0 rounded-2xl shadow-inner shadow-slate-900/50 pointer-events-none z-10" />

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-0" />

                  {/* Content wrapper */}
                  <div className="relative h-full flex flex-col z-20">
                    {/* Image Section */}
                    <div className="relative overflow-hidden flex-shrink-0">
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          loading={index < 3 ? "eager" : "lazy"}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                          className="object-cover transition-transform duration-200 group-hover:scale-105 will-change-transform"
                        />

                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-violet-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150" />

                        {/* Corner accent */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-grow p-6 flex flex-col justify-between">
                      {/* Title with Arrow */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="text-lg font-semibold leading-snug flex-1 text-slate-200 group-hover:text-violet-300 transition-colors duration-150">
                            {project.title}
                          </h3>

                          {/* Arrow Icon — CSS transition instead of whileHover */}
                          <div className="flex-shrink-0 pt-1 transition-transform duration-150 group-hover:translate-x-1 group-hover:-translate-y-1">
                            <ArrowUpRight className="w-5 h-5 text-violet-400 group-hover:text-violet-300 transition-colors duration-150" />
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 group-hover:text-slate-300 transition-colors duration-150">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
