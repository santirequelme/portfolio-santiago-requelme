"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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
    "header.hireMe": "Hire me!",

    // Hero
    "hero.role1": "Frontend engineer",
    "hero.role2": "UI specialist",
    "hero.role3": "Problem solver",
    "hero.subtitle": "not just screens.",
    "hero.description": "From design vision to robust, scalable, clean code that solves real problems.",
    "hero.viewProjects": "View projects",

    // Projects
    "projects.title": "Projects",
    "projects.subtitle": "A showcase of projects, including leading teams to deliver precision UI and intentional UX.",
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
    "about.problemSolver.title": "A problem solver",
    "about.problemSolver.content":
      "Someone who leaves no loose ends, testing, refining, and iterating until the visual and technical solutions are solid and consistent.",
    "about.changeMaker.title": "A change maker",
    "about.changeMaker.content":
      "Able to translate research, data, and design processes into clear technical decisions, aligning business goals with precise and maintainable frontend implementations.",
    "about.designChampion.title": "A design champion",
    "about.designChampion.content":
      "A user advocate who ensures that user needs and perspectives are respected throughout the development process, from design to the final product.",
    "about.workWithMe": "Work with me!",

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
    "header.hireMe": "¡Contrátame!",

    // Hero
    "hero.role1": "Ingeniero frontend",
    "hero.role2": "Especialista en UI",
    "hero.role3": "Solucionador de problemas",
    "hero.subtitle": "no solo pantallas.",
    "hero.description": "De la visión de diseño a código robusto, escalable y limpio que resuelve problemas reales.",
    "hero.viewProjects": "Ver proyectos",

    // Projects
    "projects.title": "Proyectos",
    "projects.subtitle": "Una muestra de proyectos, que incluye el liderazgo de equipos para entregar UI precisas y una mejor experiencia de usuario.",
    "projects.wedding.title": "App de Planificación de Bodas",
    "projects.wedding.description":
      "App de cadena hotelera para cotizaciones instantáneas de bodas basadas en lugar, estilo, invitados y extras. Entregué una UI intuitiva y responsive traduciendo requisitos complejos en soluciones frontend limpias y escalables.",
    "projects.booking.title": "App de Reservas de Hotel",
    "projects.booking.description":
      "App personalizada de reservas de escapadas con precios en tiempo real. Dominé desafíos complejos: layouts de precios dinámicos, responsividad multi-dispositivo y gestión de estado fluida desde prototipos hasta producción.",
    "projects.experience.title": "App de Experiencias",
    "projects.experience.description":
      "App inmersiva destacando experiencias únicas de hotel, entretenimiento y actividades de huéspedes. Resolviendo problemas como renderizado dinámico de contenido, animaciones suaves entre dispositivos y convirtiendo prototipos ricos en multimedia en código eficiente.",
    "projects.hotel.title": "Plataforma Hotelera",
    "projects.hotel.description":
      "Plataforma dinámica de cadena hotelera. Arreglando animaciones hero de alto impacto, secciones multilingües de carga rápida, layouts completamente responsive desde diseño a código, mejorando SEO y rendimiento general.",

    // About
    "about.title": "¿Quién soy?",
    "about.intro":
      "🧑🏽‍💻 El diseño habla. Yo lo codifico. Creo interfaces hermosas y confiables que deleitan a los usuarios y resuelven problemas. Desarrollador Frontend & UI perfecto al píxel y de rápido movimiento, convirtiendo caos en código limpio y elegante desde diseños de Figma.",
    "about.problemSolver.title": "Un solucionador de problemas",
    "about.problemSolver.content":
      "Alguien que no deja cabos sueltos, probando, refinando e iterando hasta que las soluciones visuales y técnicas sean sólidas y consistentes.",
    "about.changeMaker.title": "Un agente de cambio",
    "about.changeMaker.content":
      "Capaz de traducir investigación, datos y procesos de diseño en decisiones técnicas claras, alineando objetivos de negocio con implementaciones frontend precisas y mantenibles.",
    "about.designChampion.title": "Un defensor del diseño",
    "about.designChampion.content":
      "Un defensor del usuario que asegura que las necesidades y perspectivas del usuario sean respetadas durante todo el proceso de desarrollo, desde el diseño hasta el producto final.",
    "about.workWithMe": "¡Trabajemos juntos!",

    // Footer
    "footer.privacy": "Privacidad",
    "footer.terms": "Términos",
    "footer.docs": "Documentos",
    "footer.rights": "Todos los derechos reservados.",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language | null
    if (saved && (saved === "en" || saved === "es")) {
      setLanguage(saved)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
