// CV content. Periods marked TODO still need the real dates from LinkedIn;
// an empty period is simply not rendered.

type Lang = "en" | "es"
type Localized = Record<Lang, string>

export interface Role {
  company: string
  url?: string
  period: Localized
  title: Localized
  summary: Localized
  highlights: Record<Lang, string[]>
  stack: string[]
}

export interface Work {
  title: string
  image: string
  url: string
  tag: Localized
}

export const ROLES: Role[] = [
  {
    company: "Independent",
    period: { en: "2026 — Present", es: "2026 — Actualidad" },
    title: { en: "Product Engineer", es: "Product Engineer" },
    summary: {
      en: "Designing, prototyping and shipping product features end to end, from the first idea to production code.",
      es: "Diseño, prototipo y entrego funcionalidades de producto de punta a punta, de la primera idea al código en producción.",
    },
    highlights: {
      en: [
        "Digital Legacy Platform: a calm, guided product for wills, insurance and documents, built on a real API.",
        "Aura Design System: semantic tokens, typography, elevation, motion and composable primitives.",
        "Supply Chain Dashboard with KPI analytics, interactive maps, global filters and CSV export.",
      ],
      es: [
        "Plataforma de Legado Digital: un producto guiado para testamentos, seguros y documentos, sobre una API real.",
        "Aura Design System: tokens semánticos, tipografía, elevación, motion y primitivos componibles.",
        "Supply Chain Dashboard con analytics de KPIs, mapas interactivos, filtros globales y exportación CSV.",
      ],
    },
    stack: ["Next.js", "React", "TypeScript", "Tailwind", "GSAP", "Framer Motion"],
  },
  {
    company: "RIU Hotels & Resorts",
    url: "https://www.riu.com",
    period: { en: "", es: "" }, // TODO: real dates
    title: { en: "UI Developer", es: "UI Developer" },
    summary: {
      en: "Frontend for one of the largest hotel chains: booking flows, wedding quotes and guest experiences across a multilingual platform.",
      es: "Frontend para una de las mayores cadenas hoteleras: flujos de reserva, cotizador de bodas y experiencias para huéspedes en una plataforma multilingüe.",
    },
    highlights: {
      en: [
        "Booking app with real-time pricing, dynamic pricing layouts and multi-device state management.",
        "Wedding planner with instant quotes by venue, style, guests and extras.",
        "Hero animations, fast multilingual sections, SEO and performance improvements on riu.com.",
      ],
      es: [
        "App de reservas con precios en tiempo real, layouts de precios dinámicos y gestión de estado multi-dispositivo.",
        "Planificador de bodas con cotización instantánea por lugar, estilo, invitados y extras.",
        "Animaciones hero, secciones multilingües rápidas y mejoras de SEO y rendimiento en riu.com.",
      ],
    },
    stack: ["Angular", "TypeScript", "SASS", "REST APIs", "Figma", "Jira / Agile"],
  },
  {
    company: "RocketX Group",
    url: "https://rocketx.group/",
    period: { en: "", es: "" }, // TODO: real dates
    title: { en: "Frontend Developer", es: "Frontend Developer" },
    summary: {
      en: "Led the componentization of themes, templates and modules in HubSpot CMS.",
      es: "Lideré la componentización de temas, plantillas y módulos en el CMS de HubSpot.",
    },
    highlights: {
      en: [
        "Built a library of reusable HubSpot modules that sped up delivery and simplified maintenance.",
        "Turned designs into responsive, accessible templates with HTML, CSS, JavaScript and HubL.",
      ],
      es: [
        "Construí una librería de módulos reutilizables de HubSpot que aceleró las entregas y simplificó el mantenimiento.",
        "Convertí diseños en plantillas responsive y accesibles con HTML, CSS, JavaScript y HubL.",
      ],
    },
    stack: ["HubSpot CMS", "HubL", "JavaScript", "CSS", "HTML"],
  },
]

export const WORK: Work[] = [
  { title: "Digital Legacy Platform", image: "/images/legacy-platform.svg", url: "/work/digital-legacy-platform", tag: { en: "Case study", es: "Caso de estudio" } },
  { title: "Aura Design System", image: "/images/design-system.svg", url: "/design-system", tag: { en: "Design system", es: "Design system" } },
  { title: "Supply Chain Dashboard", image: "/images/dashboard.webp", url: "https://suply-chain-dashboard.vercel.app/", tag: { en: "Dashboard", es: "Dashboard" } },
  { title: "RIU Booking", image: "/images/booking.webp", url: "https://www.riu.com/en/booking", tag: { en: "RIU Hotels", es: "RIU Hotels" } },
  { title: "RIU Weddings", image: "/images/weddings.webp", url: "https://www.riu.com/es/weddings", tag: { en: "RIU Hotels", es: "RIU Hotels" } },
  { title: "Pulse App", image: "/images/pulse-app.webp", url: "https://pulse-app-a.netlify.app/", tag: { en: "Prototype", es: "Prototipo" } },
  { title: "HubSpot Themes", image: "/images/hubspot.webp", url: "https://rocketx.group/", tag: { en: "RocketX", es: "RocketX" } },
]

export const SKILLS = [
  "React", "Next.js", "Angular", "TypeScript", "JavaScript", "Tailwind", "SASS", "CSS Architecture",
  "GSAP", "Framer Motion", "Design Systems", "Figma", "Prototyping", "Accessibility", "Performance",
  "REST APIs", "Git", "Jira / Agile", "HubSpot CMS", "AI Agents",
]

export const EDUCATION = {
  school: "Instituto Técnico Adrián P. Urquía",
  degree: {
    en: "Bachelor and Technician in Production of Goods and Services",
    es: "Bachiller y Técnico en Producción de Bienes y Servicios",
  },
}

export const LANGUAGES: { name: Localized; level: Localized }[] = [
  { name: { en: "Spanish", es: "Español" }, level: { en: "Native", es: "Nativo" } },
  { name: { en: "English", es: "Inglés" }, level: { en: "Professional", es: "Profesional" } }, // TODO: confirm level
]
