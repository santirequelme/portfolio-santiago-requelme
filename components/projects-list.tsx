"use client"

import { useRef } from "react"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
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
            gsap.to(pill, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)", overwrite: "auto" })
          }
          const onMove = (e: PointerEvent) => place(e)
          const onLeave = () => gsap.to(pill, { scale: 0, opacity: 0, duration: 0.25, ease: "power2.in", overwrite: "auto" })

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
        {/* Section Header */}
        <div className="projects-header text-center mb-20">
          <div>
            <h2 className="projects-title font-display text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="inline-block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
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
                className="project-link group flex h-full flex-col rounded-3xl border border-border bg-card/80 p-2 backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_48px_-24px_oklch(0.6_0.21_34/0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                {/* Image, inset inside the card */}
                <div className="project-media relative aspect-video overflow-hidden rounded-2xl bg-secondary md:cursor-none">
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

                  {/* Cursor-following label (pointer devices only) */}
                  <span
                    aria-hidden="true"
                    className="project-pill pointer-events-none absolute left-0 top-0 hidden md:inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-foreground/90 px-4 py-2 text-xs font-medium text-background opacity-0 shadow-lg backdrop-blur-md"
                  >
                    {t("projects.view")}
                    <ArrowUpRight className="h-3.5 w-3.5" />
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

                    <span className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-border text-foreground/80 transition-colors duration-500 group-hover:border-primary group-hover:text-primary-foreground">
                      <span className="absolute inset-0 scale-0 rounded-full bg-primary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100" />
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
