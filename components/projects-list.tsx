"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import { SectionMarker, SelectionOverlay } from "./tech/annotations"
import { buttonClass } from "@/lib/ui"
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap"

// Cards shown before "View more"; the rest stay behind the button.
const FEATURED = 6

export function ProjectsList() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const moreRef = useRef<HTMLButtonElement>(null)
  const [showAll, setShowAll] = useState(false)

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

      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  // The first FEATURED are always shown; the rest open with "View more".
  const projects = [
    {
      title: t("projects.wellbeinn-app.title"),
      description: t("projects.wellbeinn-app.description"),
      image: "/images/wellbeinn-app.jpg",
      url: "https://play.google.com/store/apps/details?id=com.wellbeinn.app",
    },
    {
      title: t("projects.wellbeinn-band.title"),
      description: t("projects.wellbeinn-band.description"),
      image: "/images/wellbeinn-band.jpg",
      url: "https://wellbeinn.com/products/wellbeinn-band",
    },
    {
      title: t("projects.supply-chain-dashboard.title"),
      description: t("projects.supply-chain-dashboard.description"),
      image: "/images/dashboard.webp",
      url: "https://suply-chain-dashboard.vercel.app/",
    },
    {
      title: t("projects.wedding.title"),
      description: t("projects.wedding.description"),
      image: "/images/weddings.webp",
      url: "https://www.riu.com/es/weddings",
    },
    {
      title: t("projects.design-system.title"),
      description: t("projects.design-system.description"),
      image: "/images/design-system.svg",
      url: "/design-system",
    },
    {
      title: t("projects.portfolio-system.title"),
      description: t("projects.portfolio-system.description"),
      image: "/images/portfolio-system.webp",
      url: "/system",
    },
    {
      title: t("projects.legacy.title"),
      description: t("projects.legacy.description"),
      image: "/images/legacy-platform.svg",
      url: "/work/digital-legacy-platform",
    },
    {
      title: t("projects.pulse-app.title"),
      description: t("projects.pulse-app.description"),
      image: "/images/pulse-app.webp",
      url: "https://pulse-app-a.netlify.app/",
    },
    {
      title: t("projects.hotel.title"),
      description: t("projects.hotel.description"),
      image: "/images/homepage.webp",
      url: "https://www.riu.com/en",
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
      title: t("projects.hubspot.title"),
      description: t("projects.hubspot.description"),
      image: "/images/hubspot.webp",
      url: "https://rocketx.group/",
    },
  ]
  const visible = showAll ? projects : projects.slice(0, FEATURED)

  const toggle = () => {
    if (showAll) {
      setShowAll(false)
      // Keep the button under the pointer instead of leaving the reader far below.
      requestAnimationFrame(() => moreRef.current?.scrollIntoView({ block: "center" }))
      return
    }
    setShowAll(true)
    // Move keyboard users to the first card that just appeared.
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`#projects-grid .project-card:nth-child(${FEATURED + 1}) a`)?.focus())
  }

  return (
    <section ref={sectionRef} id="projectList" className="relative py-32 px-4">
      <div className="mx-auto max-w-7xl">
        <SectionMarker
          index="01"
          label={t("projects.title")}
          meta={`${String(projects.length).padStart(2, "0")} · 2020 - 2026`}
          className="mb-16"
        />

        {/* Section Header */}
        <div className="projects-header text-center mb-20">
          <div>
            <h2 className="projects-title font-display text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="inline-block">
                {t("projects.title")}
              </span>
            </h2>
          </div>

          <div className="projects-subtitle">
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
              {t("projects.subtitle")}
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div id="projects-grid" className="grid gap-6 md:gap-8 md:grid-cols-3 lg:gap-10">
          {visible.map((project, index) => {
            const isInternal = project.url.startsWith("/")
            return (
            <div
              key={project.url}
              className={
                index < FEATURED
                  ? "project-card"
                  : "project-card animate-in fade-in slide-in-from-bottom-6 duration-500 ease-out fill-mode-both motion-reduce:animate-none"
              }
            >
              <Link
                href={project.url}
                target={isInternal ? undefined : "_blank"}
                rel={isInternal ? undefined : "noopener noreferrer"}
                className="project-link group relative flex h-full flex-col rounded-card border border-border bg-card/80 p-1.5 backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-transparent hover:shadow-[0_24px_48px_-28px_rgb(0_0_0/0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <SelectionOverlay />

                {/* Image, inset inside the card */}
                <div className="project-media relative aspect-video overflow-hidden rounded-inner bg-secondary">
                  <div className="project-image absolute -inset-y-[8%] inset-x-0">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      loading={index < 3 ? "eager" : "lazy"}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                </div>

                {/* Text */}
                <div className="flex flex-grow flex-col px-4 pb-4 pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="flex-1 text-lg font-semibold leading-snug text-foreground">
                      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[length:100%_1.5px]">
                        {project.title}
                      </span>
                    </h3>

                    <span className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-control border border-border text-foreground/80 transition-colors duration-500 group-hover:border-primary group-hover:text-primary-foreground">
                      <span className="absolute inset-0 scale-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100" />
                      <ArrowUpRight className="relative h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45" />
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </Link>
            </div>
            )
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            ref={moreRef}
            type="button"
            onClick={toggle}
            aria-expanded={showAll}
            aria-controls="projects-grid"
            className={buttonClass("secondary", "md")}
          >
            {showAll ? t("projects.less") : `${t("projects.more")} (${projects.length - FEATURED})`}
            <ChevronDown
              aria-hidden="true"
              className={`h-4 w-4 transition-transform duration-300 motion-reduce:transition-none ${showAll ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>
    </section>
  )
}
