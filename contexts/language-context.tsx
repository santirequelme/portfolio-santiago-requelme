"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "en" | "es"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    // Header
    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.hireMe": "Hire me!",

    // Hero
    "hero.role1": "Frontend engineer",
    "hero.role2": "UI specialist",
    "hero.role3": "Problem solver",
    "hero.subtitle": "not just screens.",
    "hero.description": "From design vision to robust, scalable, clean code that solves real problems.",
    "hero.cta": "View projects",

    // Projects
    "projects.title": "Projects",
    "projects.subtitle": "A showcase of projects, leading teams to deliver precision UI and intentional UX.",
    "projects.wedding.title": "Wedding Planner App",
    "projects.wedding.description":
      "Hotel chain app for instant wedding quotes based on venue, style, guests, and extras. Delivered an intuitive, responsive UI by translating complex requirements into clean, scalable frontend solutions.",
    "projects.booking.title": "Hotel Booking App",
    "projects.booking.description":
      "Personalized getaway booking app with real-time pricing. Mastered complex challenges: dynamic pricing layouts, multi-device responsiveness, and seamless state management from prototypes to production.",
    "projects.experience.title": "Experience App",
    "projects.experience.description":
      "Immersive app highlighting unique hotel experiences, entertainment, and guest activities. Resolving issues like dynamic content rendering, smooth animations across devices, and turning rich media prototypes into performant code.",
    "projects.hotel.title": "Hotel Platform",
    "projects.hotel.description":
      "Dynamic hotel chain platform. Fixing high-impact hero animations, fast-loading multilingual sections, fully responsive layouts from design to code, improving SEO and overall performance.",

    // About
    "about.title": "Who am I ?",
    "about.intro":
      "🧑🏽‍💻 Design speaks. I code it. I craft beautiful, reliable interfaces that delight users and solve problems. Pixel-perfect, fast-moving Frontend & UI Developer turning chaos into clean, elegant code from Figma designs.",
    "about.problemSolver": "A problem solver",
    "about.problemSolverDesc":
      "Someone who leaves no loose ends, testing, refining, and iterating until the visual and technical solutions are solid and consistent.",
    "about.changeMaker": "A change maker",
    "about.changeMakerDesc":
      "Able to translate research, data, and design processes into clear technical decisions, aligning business goals with precise and maintainable frontend implementations.",
    "about.designChampion": "A design champion",
    "about.designChampionDesc":
      "A user advocate who ensures that user needs and perspectives are respected throughout the development process, from design to the final product.",
    "about.cta": "Work with me!",

    // Footer
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.docs": "Docs",
    "footer.rights": "All rights reserved.",
  },
  es: {
    // Header
    "nav.projects": "Proyectos",
    "nav.about": "Acerca de",
    "nav.contact": "Contacto",
    "nav.hireMe": "¡Contrátame!",

    // Hero
    "hero.role1": "Ingeniero Frontend",
    "hero.role2": "Especialista UI",
    "hero.role3": "Solucionador de problemas",
    "hero.subtitle": "no solo pantallas.",
    "hero.description": "De la visión de diseño a código robusto, escalable y limpio que resuelve problemas reales.",
    "hero.cta": "Ver proyectos",

    // Projects
    "projects.title": "Proyectos",
    "projects.subtitle": "Una muestra de proyectos, liderando equipos para entregar UI preciso y UX intencional.",
    "projects.wedding.title": "App Planificador de Bodas",
    "projects.wedding.description":
      "App de cadena hotelera para cotizaciones instantáneas de bodas basadas en lugar, estilo, invitados y extras. Entregué una UI intuitiva y responsive traduciendo requisitos complejos en soluciones frontend limpias y escalables.",
    "projects.booking.title": "App Reserva de Hotel",
    "projects.booking.description":
      "App de reservas personalizada con precios en tiempo real. Dominé desafíos complejos: diseños de precios dinámicos, capacidad de respuesta multidispositivo y gestión de estado sin fisuras desde prototipos hasta producción.",
    "projects.experience.title": "App de Experiencias",
    "projects.experience.description":
      "App inmersiva que destaca experiencias hoteleras únicas, entretenimiento y actividades para huéspedes. Resolviendo problemas como renderizado de contenido dinámico, animaciones fluidas en todos los dispositivos y convirtiendo prototipos de medios ricos en código eficiente.",
    "projects.hotel.title": "Plataforma Hotelera",
    "projects.hotel.description":
      "Plataforma dinámica de cadena hotelera. Arreglando animaciones hero de alto impacto, secciones multilingües de carga rápida, diseños completamente responsive desde diseño hasta código, mejorando SEO y rendimiento general.",

    // About
    "about.title": "¿Quién soy?",
    "about.intro":
      "🧑🏽‍💻 El diseño habla. Yo lo codifico. Creo interfaces hermosas y confiables que deleitan a los usuarios y resuelven problemas. Desarrollador Frontend y UI perfeccionista y ágil, convirtiendo el caos en código limpio y elegante desde diseños de Figma.",
    "about.problemSolver": "Un solucionador de problemas",
    "about.problemSolverDesc":
      "Alguien que no deja cabos sueltos, probando, refinando e iterando hasta que las soluciones visuales y técnicas sean sólidas y consistentes.",
    "about.changeMaker": "Un agente de cambio",
    "about.changeMakerDesc":
      "Capaz de traducir investigación, datos y procesos de diseño en decisiones técnicas claras, alineando objetivos comerciales con implementaciones frontend precisas y mantenibles.",
    "about.designChampion": "Un defensor del diseño",
    "about.designChampionDesc":
      "Un defensor del usuario que garantiza que las necesidades y perspectivas del usuario se respeten durante todo el proceso de desarrollo, desde el diseño hasta el producto final.",
    "about.cta": "¡Trabaja conmigo!",

    // Footer
    "footer.privacy": "Privacidad",
    "footer.terms": "Términos",
    "footer.docs": "Documentación",
    "footer.rights": "Todos los derechos reservados.",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
