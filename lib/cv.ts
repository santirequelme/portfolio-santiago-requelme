// CV content, sourced from Santiago_Requelme_CV2026.

type Lang = "en" | "es"
type Localized = Record<Lang, string>

export interface Role {
  company: string
  url?: string
  period: Localized
  meta: Localized
  title: Localized
  highlights: Record<Lang, string[]>
  stack: string[]
}

export interface Achievement {
  from: number
  to: number
  prefix?: string
  suffix?: string
  label: Localized
}

export interface Work {
  title: string
  image: string
  url: string
  tag: Localized
}

export const ACHIEVEMENTS: Achievement[] = [
  { from: 0, to: 5, suffix: "+", label: { en: "Years building production B2B platforms", es: "Años construyendo plataformas B2B en producción" } },
  { from: 40, to: 100, label: { en: "Lighthouse score on critical flows of a global SaaS platform", es: "Score de Lighthouse en flujos críticos de una plataforma SaaS global" } },
  { from: 30, to: 95, suffix: "%", label: { en: "WCAG accessibility compliance in a production product", es: "Cumplimiento de accesibilidad WCAG en un producto en producción" } },
  { from: 0, to: 45, prefix: "+", suffix: "%", label: { en: "Development velocity with reusable component libraries", es: "Velocidad de desarrollo con librerías de componentes reutilizables" } },
  { from: 0, to: 35, prefix: "−", suffix: "%", label: { en: "Code duplication with unified, token-based libraries", es: "Duplicación de código con librerías unificadas basadas en tokens" } },
  { from: 0, to: 30, prefix: "−", suffix: "%", label: { en: "UI defects through design-system standardization", es: "Defectos de UI gracias a la estandarización del design system" } },
]

export const ROLES: Role[] = [
  {
    company: "Wellbeinn",
    period: { en: "May 2026 - Present", es: "May 2026 - Actualidad" },
    meta: { en: "Full-time · Spain · Remote", es: "Jornada completa · España · Remoto" },
    title: { en: "Product Engineer · UX/UI Designer", es: "Product Engineer · UX/UI Designer" },
    highlights: {
      en: [
        "Lead UX/UI design across Wellbeinn's digital products, from early concepts and user flows to high-fidelity interfaces and prototypes for mobile apps and web.",
        "Design product experiences across user profiles, use cases and hardware configurations, connecting apps with wearables and connected devices.",
        "Build high-fidelity interactive prototypes in HTML, CSS and JavaScript to validate UX before implementation.",
        "Develop and maintain the design system: tokens, typography, components, states and interaction patterns.",
        "Designed the Wellbeinn Mate app end to end for iOS and Android, from research and flows to UI and design system.",
        "Designed and developed the Wellbeinn Band product landing page.",
        "Design motion and interaction patterns with GSAP, and use Claude Code to prototype and validate decisions directly in the browser.",
      ],
      es: [
        "Lidero el diseño UX/UI de los productos digitales de Wellbeinn, desde los primeros conceptos y flujos hasta interfaces y prototipos de alta fidelidad para apps móviles y web.",
        "Diseño experiencias para distintos perfiles, casos de uso y configuraciones de hardware, conectando las apps con wearables y dispositivos conectados.",
        "Construyo prototipos interactivos de alta fidelidad en HTML, CSS y JavaScript para validar la UX antes de implementarla.",
        "Desarrollo y mantengo el design system: tokens, tipografía, componentes, estados y patrones de interacción.",
        "Diseñé la app Wellbeinn Mate de punta a punta para iOS y Android, desde el research y los flujos hasta la UI y el design system.",
        "Diseñé y desarrollé la landing de producto de la Wellbeinn Band.",
        "Diseño motion e interacciones con GSAP y uso Claude Code para prototipar y validar decisiones directamente en el navegador.",
      ],
    },
    stack: ["Figma", "Design Systems", "GSAP", "HTML", "CSS", "JavaScript", "Claude Code"],
  },
  {
    company: "Jobbex IT",
    period: { en: "Mar 2026 - Sep 2026", es: "Mar 2026 - Sep 2026" },
    meta: { en: "Freelance · Portugal · Remote", es: "Freelance · Portugal · Remoto" },
    title: { en: "Frontend Developer · Product Designer", es: "Frontend Developer · Product Designer" },
    highlights: {
      en: [
        "Owned the end-to-end design process in Figma, from user flows and wireframes to high-fidelity UI, translated directly into production Angular / TypeScript / SCSS.",
        "Designed and built a library of 30+ components on a token-based architecture with Tailwind CSS.",
        "Audited and remediated WCAG compliance, raising the accessibility score from 30% to 95%.",
        "Refactored legacy UI with component-driven development, using Claude Code and Cursor to speed up the work.",
      ],
      es: [
        "Me hice cargo del proceso de diseño completo en Figma, de flujos y wireframes a UI de alta fidelidad, llevada directamente a Angular / TypeScript / SCSS en producción.",
        "Diseñé y construí una librería de más de 30 componentes sobre una arquitectura de tokens con Tailwind CSS.",
        "Audité y corregí el cumplimiento WCAG, subiendo el score de accesibilidad del 30% al 95%.",
        "Refactoricé UI legacy con desarrollo orientado a componentes, usando Claude Code y Cursor para acelerar el trabajo.",
      ],
    },
    stack: ["Angular", "TypeScript", "SCSS", "Tailwind", "Figma", "WCAG"],
  },
  {
    company: "RIU Hotels · Mindata",
    url: "https://www.riu.com",
    period: { en: "2023 - Feb 2026", es: "2023 - Feb 2026" },
    meta: { en: "Global B2B SaaS platform · Multi-squad team", es: "Plataforma SaaS B2B global · Equipo multi-squad" },
    title: { en: "Frontend / UX Engineer", es: "Frontend / UX Engineer" },
    highlights: {
      en: [
        "Embedded as a product engineer, owning features end to end in React / Angular + TypeScript: discovery, architecture, build and post-launch iteration.",
        "Built data-intensive apps and complex UIs that turn large datasets into clear interfaces for stakeholders and end users.",
        "Architected reusable component systems and Design System foundations across squads, reducing UI defects by 30%.",
        "Resolved Core Web Vitals bottlenecks (Lighthouse 40 → 100) through rendering changes, asset optimization and refactors.",
        "Contributed to CI/CD (GitLab CI / Jenkins), automated Figma-to-code pipelines with AI tooling and mentored developers.",
      ],
      es: [
        "Integrado como product engineer, me hice cargo de funcionalidades de punta a punta en React / Angular + TypeScript: discovery, arquitectura, desarrollo e iteración post-lanzamiento.",
        "Construí apps con mucha data y UIs complejas que convierten grandes volúmenes de datos en interfaces claras para negocio y usuarios finales.",
        "Diseñé sistemas de componentes reutilizables y las bases del Design System entre squads, reduciendo un 30% los defectos de UI.",
        "Resolví cuellos de botella de Core Web Vitals (Lighthouse 40 → 100) con cambios de renderizado, optimización de assets y refactors.",
        "Contribuí al CI/CD (GitLab CI / Jenkins), automaticé pipelines de Figma a código con IA y fui mentor de otros desarrolladores.",
      ],
    },
    stack: ["React", "Angular", "TypeScript", "Design Systems", "Core Web Vitals", "GitLab CI", "Jenkins"],
  },
  {
    company: "Freelance projects",
    period: { en: "2022 - 2025", es: "2022 - 2025" },
    meta: { en: "B2B and enterprise clients · Full ownership", es: "Clientes B2B y enterprise · Ownership completo" },
    title: { en: "Frontend Engineer · UI/UX Designer", es: "Frontend Engineer · UI/UX Designer" },
    highlights: {
      en: [
        "Led product discovery and delivery across client engagements, iterating from direct user feedback.",
        "Architected Design Systems in React + TypeScript with tokens, variants and versioning, cutting code duplication by 35% and speeding delivery 30-45%.",
        "Built data-facing UIs and component libraries from scratch, with fluid interfaces in Framer Motion and Tailwind CSS.",
      ],
      es: [
        "Lideré el discovery y la entrega de producto con distintos clientes, iterando a partir del feedback directo de usuarios.",
        "Diseñé Design Systems en React + TypeScript con tokens, variantes y versionado, reduciendo un 35% la duplicación de código y acelerando las entregas un 30-45%.",
        "Construí UIs de datos y librerías de componentes desde cero, con interfaces fluidas en Framer Motion y Tailwind CSS.",
      ],
    },
    stack: ["React", "TypeScript", "Tailwind", "Framer Motion", "Design Tokens"],
  },
  {
    company: "Moby Digital",
    period: { en: "2021 - 2022", es: "2021 - 2022" },
    meta: { en: "SPA and CMS projects · Agile delivery", es: "Proyectos SPA y CMS · Entrega ágil" },
    title: { en: "Frontend Developer", es: "Frontend Developer" },
    highlights: {
      en: [
        "Built production SPAs and reusable CMS components, translating Figma / Sketch designs into performance-optimized interfaces.",
        "Delivered within Agile / CI-CD workflows (GitLab CI), boosting code reusability by 40% through systematic componentization.",
      ],
      es: [
        "Construí SPAs en producción y componentes de CMS reutilizables, llevando diseños de Figma / Sketch a interfaces optimizadas.",
        "Trabajé con flujos Agile / CI-CD (GitLab CI), aumentando un 40% la reutilización de código con una componentización sistemática.",
      ],
    },
    stack: ["JavaScript", "SPA", "CMS", "GitLab CI", "Figma", "Sketch"],
  },
  {
    company: "Darwoft",
    period: { en: "2020", es: "2020" },
    meta: { en: "Angular + React · Agile / Scrum", es: "Angular + React · Agile / Scrum" },
    title: { en: "Frontend Developer (Intern)", es: "Frontend Developer (Pasante)" },
    highlights: {
      en: ["Built the Angular UI of a virtual wallet application, with first professional exposure to React under technical mentorship."],
      es: ["Construí la UI en Angular de una billetera virtual, con mi primera experiencia profesional en React bajo mentoría técnica."],
    },
    stack: ["Angular", "React"],
  },
]

export const WORK: Work[] = [
  { title: "Wellbeinn Mate App", image: "/images/wellbeinn-app.jpg", url: "https://play.google.com/store/apps/details?id=com.wellbeinn.app", tag: { en: "Latest · iOS & Android", es: "Último · iOS y Android" } },
  { title: "Wellbeinn Band Landing", image: "/images/wellbeinn-band.jpg", url: "https://wellbeinn.com/products/wellbeinn-band", tag: { en: "Wellbeinn", es: "Wellbeinn" } },
  { title: "Digital Legacy Platform", image: "/images/legacy-platform.svg", url: "/work/digital-legacy-platform", tag: { en: "Case study", es: "Caso de estudio" } },
  { title: "Aura Design System", image: "/images/design-system.svg", url: "/design-system", tag: { en: "Design system", es: "Design system" } },
  { title: "Supply Chain Dashboard", image: "/images/dashboard.webp", url: "https://suply-chain-dashboard.vercel.app/", tag: { en: "Dashboard", es: "Dashboard" } },
  { title: "RIU Booking", image: "/images/booking.webp", url: "https://www.riu.com/en/booking", tag: { en: "RIU Hotels", es: "RIU Hotels" } },
  { title: "RIU Weddings", image: "/images/weddings.webp", url: "https://www.riu.com/es/weddings", tag: { en: "RIU Hotels", es: "RIU Hotels" } },
  { title: "RIU Experience", image: "/images/experience.webp", url: "https://www.riu.com/en/riu-experience/", tag: { en: "RIU Hotels", es: "RIU Hotels" } },
  { title: "Pulse App", image: "/images/pulse-app.webp", url: "https://pulse-app-a.netlify.app/", tag: { en: "Prototype", es: "Prototipo" } },
]

export const SKILLS = [
  "React", "Angular", "TypeScript", "JavaScript", "Next.js", "Tailwind CSS", "SCSS / BEM", "HTML5 · CSS3",
  "Redux", "Zustand", "GraphQL", "REST API", "Python · Django",
  "Figma", "Design Systems", "Design Tokens", "Prototyping", "GSAP", "Framer Motion", "Accessibility (WCAG)",
  "AWS (S3, CloudFront, ECS)", "GitLab CI", "Jenkins", "Claude Code", "Cursor", "Agile / Scrum",
]

export const EDUCATION: { title: Localized; school: string; period: string }[] = [
  {
    title: { en: "CS50: Web Programming with Python and JavaScript", es: "CS50: Web Programming with Python and JavaScript" },
    school: "Harvard University",
    period: "2020",
  },
  {
    title: { en: "Fullstack Development", es: "Desarrollo Fullstack" },
    school: "Instituto Superior Politécnico Córdoba",
    period: "2021",
  },
  {
    title: { en: "Computer Science", es: "Ciencias de la Computación" },
    school: "Universidad Nacional de Río Cuarto",
    period: "2009 - 2014",
  },
]

export const LANGUAGES: { name: Localized; level: Localized }[] = [
  { name: { en: "Spanish", es: "Español" }, level: { en: "Native", es: "Nativo" } },
  { name: { en: "English", es: "Inglés" }, level: { en: "C1 · Advanced", es: "C1 · Avanzado" } },
  { name: { en: "Portuguese", es: "Portugués" }, level: { en: "C1 · Advanced", es: "C1 · Avanzado" } },
]
