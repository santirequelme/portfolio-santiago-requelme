"use client"

import { useRef } from "react"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap"
import { attachTilt } from "./motion/tilt"

export function ProjectsList() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        // Header: title wipes up from a mask, subtitle follows.
        gsap
          .timeline({ scrollTrigger: { trigger: ".projects-header", start: "top 80%" } })
          .from(".projects-title", {
            yPercent: 40,
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.9,
            ease: "power4.out",
          })
          .from(".projects-subtitle", { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.5")

        // Cards: revealed row by row as they enter the viewport.
        gsap.set(".project-card", { opacity: 0, y: 60, scale: 0.96 })
        ScrollTrigger.batch(".project-card", {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.12,
              clearProps: "transform",
            }),
        })

        // Images drift inside their frame while scrolling.
        gsap.utils.toArray<HTMLElement>(".project-image").forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true },
            },
          )
        })
      })

      // 3D tilt with a spotlight that follows the cursor.
      mm.add(FINE_POINTER, () => {
        const cleanups = gsap.utils.toArray<HTMLElement>(".project-link").map((link) =>
          attachTilt(link, { max: 6, spotlight: link.querySelector<HTMLElement>(".project-spotlight") }),
        )
        return () => cleanups.forEach((cleanup) => cleanup())
      })

      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  const projects = [
    {
      title: t("projects.wellbeinn-band.title"),
      description: t("projects.wellbeinn-band.description"),
      image: "/images/wellbeinn-band.svg",
      url: "https://wellbeinn.com/products/wellbeinn-band",
    },
    {
      title: t("projects.legacy.title"),
      description: t("projects.legacy.description"),
      image: "/images/legacy-platform.svg",
      url: "/work/digital-legacy-platform",
    },
    {
      title: t("projects.design-system.title"),
      description: t("projects.design-system.description"),
      image: "/images/design-system.svg",
      url: "/design-system",
    },
    {
      title: t("projects.supply-chain-dashboard.title"),
      description: t("projects.supply-chain-dashboard.description"),
      image: "/images/dashboard.webp",
      url: "https://suply-chain-dashboard.vercel.app/",
    },
  
    {
      title: t("projects.pulse-app.title"),
      description: t("projects.pulse-app.description"),
      image: "/images/pulse-app.webp",
      url: "https://pulse-app-a.netlify.app/",
    },
    {
      title: t("projects.wedding.title"),
      description: t("projects.wedding.description"),
      image: "/images/weddings.webp",
      url: "https://www.riu.com/es/weddings",
    },
    {
      title: t("projects.booking.title"),
      description: t("projects.booking.description"),
      image: "/images/booking.webp",
      url: "https://www.riu.com/en/booking",
    },
    {
      title: t("projects.experience.title"),
      description: t("projects.experience.description"),
      image: "/images/experience.webp",
      url: "https://www.riu.com/en/riu-experience/",
    },
    {
      title: t("projects.hotel.title"),
      description: t("projects.hotel.description"),
      image: "/images/homepage.webp",
      url: "https://www.riu.com/en",
    },
    {
      title: t("projects.hubspot.title"),
      description: t("projects.hubspot.description"),
      image: "/images/hubspot.webp",
      url: "https://rocketx.group/",
    }
  ]

  return (
    <section ref={sectionRef} id="projectList" className="relative py-32 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="projects-header text-center mb-20">
          <div>
            <h2 className="projects-title font-display text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="inline-block bg-gradient-to-r from-violet-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                {t("projects.title")}
              </span>
            </h2>
          </div>

          <div className="projects-subtitle">
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              {t("projects.subtitle")}
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-3 lg:gap-10">
          {projects.map((project, index) => {
            const isInternal = project.url.startsWith("/")
            return (
            <div key={`project-${index}`} className="project-card">
              <Link
                href={project.url}
                target={isInternal ? undefined : "_blank"}
                rel={isInternal ? undefined : "noopener noreferrer"}
                className="project-link group block h-full rounded-2xl"
              >
                {/* Glass Card Container — CSS transform, no Framer Motion on hover */}
                <div className="relative h-full flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-950/70 overflow-hidden transition-[transform,box-shadow,border-color] duration-150 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10 hover:scale-[1.02] will-change-transform">
                  {/* Inner shadow for depth */}
                  <div className="absolute inset-0 rounded-2xl shadow-inner shadow-slate-900/5 dark:shadow-slate-900/50 pointer-events-none z-10" />

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-0" />

                  {/* Cursor spotlight — position set by the tilt handler */}
                  <div
                    aria-hidden="true"
                    className="project-spotlight absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30"
                    style={{
                      background:
                        "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), oklch(0.65 0.28 295 / 0.14), transparent 60%)",
                    }}
                  />

                  {/* Content wrapper */}
                  <div className="relative h-full flex flex-col z-20">
                    {/* Image Section */}
                    <div className="relative overflow-hidden flex-shrink-0">
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                        <div className="project-image absolute -inset-y-[8%] inset-x-0">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          loading={index < 3 ? "eager" : "lazy"}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 will-change-transform"
                        />
                        </div>

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
                          <h3 className="text-lg font-semibold leading-snug flex-1 text-slate-900 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors duration-150">
                            {project.title}
                          </h3>

                          {/* Arrow Icon — CSS transition instead of whileHover */}
                          <div className="flex-shrink-0 pt-1 transition-transform duration-150 group-hover:translate-x-1 group-hover:-translate-y-1">
                            <ArrowUpRight className="w-5 h-5 text-violet-600 dark:text-violet-400 group-hover:text-violet-500 dark:group-hover:text-violet-300 transition-colors duration-150" />
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-150">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
