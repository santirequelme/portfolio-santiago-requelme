"use client"

import { useRef } from "react"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { SectionMarker, SelectionOverlay } from "./tech/annotations"
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap"

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

      // "View project" pill that trails the cursor over each image.
      mm.add(FINE_POINTER, () => {
        const cleanups = gsap.utils.toArray<HTMLElement>(".project-media").map((media) => {
          const pill = media.querySelector<HTMLElement>(".project-pill")!
          gsap.set(pill, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 })
          const xTo = gsap.quickTo(pill, "x", { duration: 0.45, ease: "power3.out" })
          const yTo = gsap.quickTo(pill, "y", { duration: 0.45, ease: "power3.out" })

          const place = (e: PointerEvent, instant = false) => {
            const rect = media.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            if (instant) gsap.set(pill, { x, y })
            else {
              xTo(x)
              yTo(y)
            }
          }
          const onEnter = (e: PointerEvent) => {
            place(e, true)
            gsap.to(pill, { scale: 1, opacity: 1, duration: 0.55, ease: "expo.out", overwrite: "auto" })
          }
          const onMove = (e: PointerEvent) => place(e)
          const onLeave = () => gsap.to(pill, { scale: 0, opacity: 0, duration: 0.35, ease: "expo.in", overwrite: "auto" })

          media.addEventListener("pointerenter", onEnter)
          media.addEventListener("pointermove", onMove)
          media.addEventListener("pointerleave", onLeave)
          return () => {
            media.removeEventListener("pointerenter", onEnter)
            media.removeEventListener("pointermove", onMove)
            media.removeEventListener("pointerleave", onLeave)
          }
        })
        return () => cleanups.forEach((cleanup) => cleanup())
      })

      return () => mm.revert()
    },
    { scope: sectionRef },
  )

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
        <div className="grid gap-6 md:gap-8 md:grid-cols-3 lg:gap-10">
          {projects.map((project, index) => {
            const isInternal = project.url.startsWith("/")
            return (
            <div key={`project-${index}`} className="project-card">
              <Link
                href={project.url}
                target={isInternal ? undefined : "_blank"}
                rel={isInternal ? undefined : "noopener noreferrer"}
                className="project-link group relative flex h-full flex-col rounded-card border border-border bg-card/80 p-1.5 backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-transparent hover:shadow-[0_24px_48px_-28px_rgb(0_0_0/0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <SelectionOverlay />

                {/* Image, inset inside the card */}
                <div className="project-media relative aspect-video overflow-hidden rounded-inner bg-secondary md:cursor-none">
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

                  {/* Cursor-following lens (pointer devices only). White with
                      mix-blend-difference, so it inverts the image beneath it
                      like a photographic negative; the label is knocked out. */}
                  <span
                    aria-hidden="true"
                    className="project-pill pointer-events-none absolute left-0 top-0 z-10 hidden h-28 w-28 md:flex flex-col items-center justify-center gap-1 rounded-full bg-white text-black mix-blend-difference opacity-0"
                  >
                    <ArrowUpRight className="h-5 w-5" strokeWidth={1.75} />
                    <span className="max-w-[5.5rem] text-center font-mono text-[11px] font-medium uppercase leading-tight tracking-[0.12em]">
                      {t("projects.view")}
                    </span>
                  </span>
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
      </div>
    </section>
  )
}
