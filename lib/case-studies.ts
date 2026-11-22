export type Lang = "en" | "es"

export interface CaseStudyContent {
  title: string
  summary: string
  meta: { label: string; value: string }[]
  challenge: { title: string; body: string }
  built: { title: string; items: { title: string; body: string }[] }
  decisions: { title: string; items: { title: string; body: string; demo?: DemoId }[] }
  outcome: { title: string; body: string }
}

export type DemoId = "disclosure" | "validation" | "responsive"

export interface CaseStudy {
  slug: string
  cover: string
  stack: string[]
  /** Live product, shown as a link in the case study header. */
  liveUrl?: string
  content: Record<Lang, CaseStudyContent>
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "digital-legacy-platform",
    cover: "/images/legacy-platform.svg",
    stack: ["Angular", "TypeScript", "Signals", "Tailwind CSS", "REST API", "Design system"],
    content: {
      en: {
        title: "Digital legacy platform",
        summary:
          "A web app where people organise everything their loved ones will need: wills, funeral wishes, insurance, documents and the people to notify. I built core product areas end to end, on top of a real API.",
        meta: [
          { label: "Role", value: "Product engineer (frontend)" },
          { label: "Scope", value: "Wills & codicils, funeral wishes, insurance, contacts, forms, design system" },
          { label: "Year", value: "2026" },
        ],
        challenge: {
          title: "The challenge",
          body: "Planning for the end of life is emotionally heavy and administratively dense. People fill in long, legal-sounding forms, with beneficiaries, executors and bank details, about topics they would rather avoid. The product had to feel calm and guided, while handling complex, linked data reliably on every screen size.",
        },
        built: {
          title: "What I built",
          items: [
            {
              title: "Wills and codicils",
              body: "Record pages wired to the backend: create and edit records, attach documents, and link beneficiaries and executors from the user's contacts.",
            },
            {
              title: "Funeral wishes",
              body: "Question flows grouped by topic, where a single yes/no answer reveals or hides the follow-up questions, so people only see what applies to them.",
            },
            {
              title: "Insurance and documents",
              body: "One shared store powering the same insurance list in two different parts of the app, so a change made in one place shows up everywhere instantly.",
            },
            {
              title: "Contacts and administration on mobile",
              body: "Dense tables that turn into readable card lists on small screens, with filters moved into a bottom sheet.",
            },
            {
              title: "App-wide form validation",
              body: "A single validation layer for every form: IBAN, URL and date rules, clear inline messages and input guarding that stops invalid characters before they are typed.",
            },
            {
              title: "Design system",
              body: "Shared primitives and page patterns reused across features, the foundation behind Aura, the design system showcased in this portfolio.",
            },
          ],
        },
        decisions: {
          title: "Key decisions",
          items: [
            {
              title: "Show only what applies",
              body: "Instead of one long form, related questions live together in a card. A yes/no switch collapses the follow-ups, and the hidden fields stay mounted so an answer is never lost if someone changes their mind.",
              demo: "disclosure",
            },
            {
              title: "Prevent errors instead of reporting them",
              body: "Validation runs as you type and blocks impossible input, like letters in an account number. Checks such as the IBAN checksum give feedback before submitting, in the user's language.",
              demo: "validation",
            },
            {
              title: "Mobile as a first-class layout",
              body: "Tables don't shrink well. Below desktop widths the same records switch to a card list built for touch, instead of forcing horizontal scrolling.",
              demo: "responsive",
            },
            {
              title: "Patterns, not one-off screens",
              body: "Wills and codicils share the same structure, so I extracted it into reusable components - page intro, record grid, framed card, file drop zone - sized with container queries. Each new record type became faster to ship and consistent by default.",
            },
          ],
        },
        outcome: {
          title: "Outcome",
          body: "Core areas of the product went from static screens to fully working, API-backed features, built on shared patterns and a single validation layer that made each new feature quicker to deliver and consistent across desktop and mobile.",
        },
      },
      es: {
        title: "Plataforma de legado digital",
        summary:
          "Una web app donde las personas organizan todo lo que sus seres queridos van a necesitar: testamentos, deseos para el funeral, seguros, documentos y a quién avisar. Construí áreas clave del producto de punta a punta, sobre una API real.",
        meta: [
          { label: "Rol", value: "Product engineer (frontend)" },
          { label: "Alcance", value: "Testamentos y codicilos, deseos para el funeral, seguros, contactos, formularios, design system" },
          { label: "Año", value: "2026" },
        ],
        challenge: {
          title: "El reto",
          body: "Planificar el final de la vida es emocionalmente pesado y administrativamente denso. Las personas rellenan formularios largos y con lenguaje legal, con beneficiarios, albaceas y datos bancarios, sobre temas que preferirían evitar. El producto tenía que sentirse tranquilo y guiado, y a la vez manejar datos complejos y relacionados de forma fiable en cualquier pantalla.",
        },
        built: {
          title: "Qué construí",
          items: [
            {
              title: "Testamentos y codicilos",
              body: "Páginas de registros conectadas al backend: crear y editar, adjuntar documentos y vincular beneficiarios y albaceas desde los contactos del usuario.",
            },
            {
              title: "Deseos para el funeral",
              body: "Flujos de preguntas agrupadas por tema, donde una sola respuesta de sí/no muestra u oculta las preguntas de seguimiento, para que cada persona vea solo lo que le aplica.",
            },
            {
              title: "Seguros y documentos",
              body: "Un único store compartido que alimenta la misma lista de seguros en dos partes distintas de la app, así un cambio hecho en un sitio aparece al instante en todos.",
            },
            {
              title: "Contactos y administración en móvil",
              body: "Tablas densas que se convierten en listas de tarjetas legibles en pantallas pequeñas, con los filtros movidos a un panel inferior.",
            },
            {
              title: "Validación de formularios en toda la app",
              body: "Una sola capa de validación para todos los formularios: reglas de IBAN, URL y fechas, mensajes claros junto al campo y bloqueo de caracteres inválidos antes de que se escriban.",
            },
            {
              title: "Design system",
              body: "Primitivos y patrones de página compartidos entre funcionalidades: la base de Aura, el design system que se muestra en este portfolio.",
            },
          ],
        },
        decisions: {
          title: "Decisiones clave",
          items: [
            {
              title: "Mostrar solo lo que aplica",
              body: "En lugar de un formulario larguísimo, las preguntas relacionadas viven juntas en una tarjeta. Un interruptor de sí/no pliega las de seguimiento, y los campos ocultos siguen montados para que ninguna respuesta se pierda si alguien cambia de opinión.",
              demo: "disclosure",
            },
            {
              title: "Evitar errores en vez de señalarlos",
              body: "La validación funciona mientras escribes y bloquea lo imposible, como letras en un número de cuenta. Comprobaciones como el dígito de control del IBAN avisan antes de enviar, en el idioma del usuario.",
              demo: "validation",
            },
            {
              title: "El móvil como diseño de primera",
              body: "Las tablas no encogen bien. Por debajo del ancho de escritorio, los mismos registros pasan a una lista de tarjetas pensada para el tacto, en lugar de obligar a hacer scroll horizontal.",
              demo: "responsive",
            },
            {
              title: "Patrones, no pantallas sueltas",
              body: "Testamentos y codicilos comparten la misma estructura, así que la extraje en componentes reutilizables - intro de página, grilla de registros, tarjeta enmarcada, zona para soltar archivos - dimensionados con container queries. Cada nuevo tipo de registro se entrega más rápido y es coherente por defecto.",
            },
          ],
        },
        outcome: {
          title: "Resultado",
          body: "Áreas clave del producto pasaron de pantallas estáticas a funcionalidades completas conectadas a la API, construidas sobre patrones compartidos y una única capa de validación que hizo cada nueva funcionalidad más rápida de entregar y coherente en escritorio y móvil.",
        },
      },
    },
  },
  {
    slug: "wellbeinn-mate-app",
    cover: "/images/wellbeinn-app.jpg",
    stack: ["Figma", "Design system", "Design tokens", "HTML/CSS/JS prototypes", "GSAP", "Claude Code"],
    liveUrl: "https://play.google.com/store/apps/details?id=com.wellbeinn.app",
    content: {
      en: {
        title: "Wellbeinn Mate App",
        summary:
          "The health app behind the Wellbeinn Band, for iOS and Android. It turns sleep, recovery, stress and activity data into one daily answer, and an AI coach, MATE, that tells you what to do with it. I led the UX/UI end to end.",
        meta: [
          { label: "Role", value: "Lead UX/UI design" },
          { label: "Scope", value: "Research, user flows, UI, design system, interactive prototypes" },
          { label: "Platforms", value: "iOS & Android · 2026" },
        ],
        challenge: {
          title: "The challenge",
          body: "A wearable measures a lot: sleep stages, recovery, stress, steps, calories, heart data. Most people don't want charts, they want to know two things when they open the app: how am I today, and what should I do about it? The product had to turn a stream of numbers into something you understand in a few seconds, without hiding the detail from people who want it.",
        },
        built: {
          title: "What I designed",
          items: [
            {
              title: "Wellbeinn Score",
              body: "One daily score for energy, body battery and wellbeing, shown first on the home screen, with sleep and stress as supporting rings around it.",
            },
            {
              title: "Sleep and recovery",
              body: "Total sleep, phases (deep, light, REM, awake), sleep efficiency and a recovery score compared with the day before.",
            },
            {
              title: "Activity and routine",
              body: "Rings for steps, calories and distance against personal goals, and a weekly routine tracker that shows progress, not just totals.",
            },
            {
              title: "MATE, the AI coach",
              body: "A coach that reads your data and turns it into advice, living in the main navigation next to Home, Plan and Activity.",
            },
            {
              title: "Design system",
              body: "Tokens, typography, components, states and interaction patterns shared by the app, the web and the Wellbeinn Band landing.",
            },
          ],
        },
        decisions: {
          title: "Key decisions",
          items: [
            {
              title: "One answer first, details on demand",
              body: "The home screen leads with a single score instead of a wall of metrics. Each card below it opens into the detail, so a quick check takes seconds and a deep dive is always one tap away.",
            },
            {
              title: "Every number comes with its meaning",
              body: "A raw value like 84 means little on its own. Each metric carries a plain-language label and a comparison: \"7h 05 · Good rest\", \"84 · Very good, +6 vs yesterday\". People read the meaning first and the number second.",
            },
            {
              title: "The coach is part of the routine, not a pop-up",
              body: "MATE has its own place in the navigation instead of being a chat bubble on top of the app. Advice becomes something you check every day, next to your plan and activity.",
            },
            {
              title: "Prototype in code before building",
              body: "I built high-fidelity prototypes in HTML, CSS and JavaScript, with real motion, to validate flows and interactions in the browser before development. Problems showed up while they were still cheap to fix.",
            },
          ],
        },
        outcome: {
          title: "Outcome",
          body: "Wellbeinn Mate was designed end to end for iOS and Android and is live on Google Play. The shared design system gave the app, the web and the band landing one visual language, and helped the team reduce duplicated code by building from the same components instead of recreating them per screen.",
        },
      },
      es: {
        title: "Wellbeinn Mate App",
        summary:
          "La app de salud de la Wellbeinn Band, para iOS y Android. Convierte los datos de sueño, recuperación, estrés y actividad en una respuesta diaria, y en un coach con IA, MATE, que te dice qué hacer con ella. Lideré el UX/UI de punta a punta.",
        meta: [
          { label: "Rol", value: "Liderazgo de diseño UX/UI" },
          { label: "Alcance", value: "Research, flujos, UI, design system, prototipos interactivos" },
          { label: "Plataformas", value: "iOS y Android · 2026" },
        ],
        challenge: {
          title: "El desafío",
          body: "Un wearable mide muchísimo: fases de sueño, recuperación, estrés, pasos, calorías, datos del corazón. La mayoría de la gente no quiere gráficos; al abrir la app quiere saber dos cosas: cómo estoy hoy y qué debería hacer. El producto tenía que convertir un flujo de números en algo que se entiende en segundos, sin esconderle el detalle a quien lo quiere.",
        },
        built: {
          title: "Qué diseñé",
          items: [
            {
              title: "Wellbeinn Score",
              body: "Una puntuación diaria de energía, batería corporal y bienestar, primera en la pantalla de inicio, con el sueño y el estrés como anillos de apoyo.",
            },
            {
              title: "Sueño y recuperación",
              body: "Sueño total, fases (profundo, ligero, REM, despierto), eficiencia del sueño y una puntuación de recuperación comparada con el día anterior.",
            },
            {
              title: "Actividad y rutina",
              body: "Anillos de pasos, calorías y distancia frente a objetivos personales, y un seguimiento semanal de la rutina que muestra el progreso, no solo totales.",
            },
            {
              title: "MATE, el coach con IA",
              body: "Un coach que lee tus datos y los convierte en consejos, con su lugar en la navegación principal junto a Inicio, Plan y Actividad.",
            },
            {
              title: "Design system",
              body: "Tokens, tipografía, componentes, estados y patrones de interacción compartidos por la app, la web y la landing de la Wellbeinn Band.",
            },
          ],
        },
        decisions: {
          title: "Decisiones clave",
          items: [
            {
              title: "Primero una respuesta, el detalle cuando lo pidas",
              body: "La pantalla de inicio arranca con una sola puntuación en lugar de un muro de métricas. Cada tarjeta se abre al detalle, así que un vistazo rápido toma segundos y el análisis profundo está siempre a un toque.",
            },
            {
              title: "Cada número viene con su significado",
              body: "Un valor como 84 dice poco por sí solo. Cada métrica lleva una etiqueta en lenguaje simple y una comparación: \"7h 05 · Buen descanso\", \"84 · Muy buena, +6 vs ayer\". Primero se lee el significado y después el número.",
            },
            {
              title: "El coach es parte de la rutina, no un pop-up",
              body: "MATE tiene su propio lugar en la navegación en vez de ser una burbuja de chat encima de la app. El consejo pasa a ser algo que revisas cada día, junto a tu plan y tu actividad.",
            },
            {
              title: "Prototipar en código antes de construir",
              body: "Construí prototipos de alta fidelidad en HTML, CSS y JavaScript, con motion real, para validar flujos e interacciones en el navegador antes del desarrollo. Los problemas aparecían cuando todavía era barato arreglarlos.",
            },
          ],
        },
        outcome: {
          title: "Resultado",
          body: "Wellbeinn Mate se diseñó de punta a punta para iOS y Android y está publicada en Google Play. El design system compartido le dio a la app, la web y la landing de la pulsera un mismo lenguaje visual, y ayudó al equipo a reducir código duplicado al construir con los mismos componentes en lugar de recrearlos en cada pantalla.",
        },
      },
    },
  },
  {
    slug: "supply-chain-dashboard",
    cover: "/images/dashboard.webp",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Recharts", "react-simple-maps", "Zustand", "Pencil.dev", "Claude"],
    liveUrl: "https://suply-chain-dashboard.vercel.app/",
    content: {
      en: {
        title: "Supply Chain Dashboard",
        summary:
          "Make2Flow, a supply chain analytics dashboard for facilities, suppliers, products and shipments. A personal project I designed and built end to end, mobile first, with its own design system and an AI-assisted workflow.",
        meta: [
          { label: "Role", value: "Design and frontend, end to end" },
          { label: "Scope", value: "IA, UI, design system, 6 views, maps, filters, tables" },
          { label: "Type", value: "Personal project · 2026" },
        ],
        challenge: {
          title: "The challenge",
          body: "Operations teams need to answer one question fast: is anything going wrong right now? The data to answer it is spread across facilities, suppliers, products and shipments, and it is usually checked on a laptop in the office and on a phone on the warehouse floor. The goal was a dashboard that shows problems first, keeps every number consistent, and still works with one thumb.",
        },
        built: {
          title: "What I built",
          items: [
            {
              title: "Executive overview",
              body: "KPI cards with trends against the previous period, a shipment status strip (in transit, delayed, pending), revenue and shipment trends from 2020 to 2026, and a recent activity table.",
            },
            {
              title: "Six connected views",
              body: "Dashboard, Suppliers, Facilities, Products, Shipments and Settings, ordered to follow how an analyst actually moves through the data.",
            },
            {
              title: "Route intelligence map",
              body: "A geographic map that plots real facility locations and animated shipping routes, so route concentration and bottlenecks are visible instead of buried in a table.",
            },
            {
              title: "Data tables that work on a phone",
              body: "Sorting, pagination and CSV export on every table. On small screens, rows expand to show hidden columns, so no data is cut off.",
            },
            {
              title: "Design system and themes",
              body: "A component library and style guide, published inside the app, with light and dark mode from the same tokens.",
            },
          ],
        },
        decisions: {
          title: "Key decisions",
          items: [
            {
              title: "Problems before totals",
              body: "Delayed and pending shipments sit right under the KPIs with their own colour, so the first thing you see is what needs attention, not just how big the numbers are.",
            },
            {
              title: "One filter bar for the whole app",
              body: "Date range, supplier, facility, product and status filters apply across views and show as removable chips. Every chart answers the same question, so the numbers always agree with each other.",
            },
            {
              title: "Mobile first, for real",
              body: "Every layout starts at 320px. On phones the sidebar becomes a bottom navigation bar, filters open in a bottom sheet, and touch targets are at least 44px.",
            },
            {
              title: "Design first, then code, with AI",
              body: "I designed every view in Pencil.dev before writing code, then built it with Claude following strict rules for React, TypeScript and Tailwind. Seeded mock data made the numbers realistic and reproducible without a backend.",
            },
          ],
        },
        outcome: {
          title: "Outcome",
          body: "A working, deployed analytics tool with six views, a live design system, light and dark themes and accessible tables. It shows how I work today: I decide the structure and the design, and use AI to move from design to production code quickly without losing quality.",
        },
      },
      es: {
        title: "Supply Chain Dashboard",
        summary:
          "Make2Flow, un dashboard de analítica de cadena de suministro para instalaciones, proveedores, productos y envíos. Un proyecto personal que diseñé y construí de punta a punta, mobile first, con su propio design system y un flujo de trabajo asistido por IA.",
        meta: [
          { label: "Rol", value: "Diseño y frontend, de punta a punta" },
          { label: "Alcance", value: "Arquitectura de información, UI, design system, 6 vistas, mapas, filtros, tablas" },
          { label: "Tipo", value: "Proyecto personal · 2026" },
        ],
        challenge: {
          title: "El desafío",
          body: "Los equipos de operaciones necesitan responder rápido una pregunta: ¿algo está fallando ahora mismo? Los datos para responderla están repartidos entre instalaciones, proveedores, productos y envíos, y se consultan en un portátil en la oficina y en un móvil en el almacén. El objetivo era un dashboard que muestre primero los problemas, mantenga todos los números coherentes y funcione con un pulgar.",
        },
        built: {
          title: "Qué construí",
          items: [
            {
              title: "Resumen ejecutivo",
              body: "Tarjetas de KPI con tendencia frente al periodo anterior, una franja de estado de envíos (en tránsito, retrasados, pendientes), tendencias de ingresos y envíos de 2020 a 2026 y una tabla de actividad reciente.",
            },
            {
              title: "Seis vistas conectadas",
              body: "Dashboard, Proveedores, Instalaciones, Productos, Envíos y Ajustes, ordenadas según cómo un analista recorre realmente los datos.",
            },
            {
              title: "Mapa de rutas",
              body: "Un mapa geográfico con la ubicación real de las instalaciones y rutas de envío animadas, para que la concentración de rutas y los cuellos de botella se vean en lugar de quedar enterrados en una tabla.",
            },
            {
              title: "Tablas que funcionan en el móvil",
              body: "Orden, paginación y exportación a CSV en todas las tablas. En pantallas pequeñas las filas se expanden para mostrar las columnas ocultas, así no se corta ningún dato.",
            },
            {
              title: "Design system y temas",
              body: "Una librería de componentes y guía de estilo, publicada dentro de la app, con modo claro y oscuro a partir de los mismos tokens.",
            },
          ],
        },
        decisions: {
          title: "Decisiones clave",
          items: [
            {
              title: "Los problemas antes que los totales",
              body: "Los envíos retrasados y pendientes están justo debajo de los KPI, con su propio color, así que lo primero que ves es lo que necesita atención, no solo qué tan grandes son los números.",
            },
            {
              title: "Una sola barra de filtros para toda la app",
              body: "Los filtros de fechas, proveedor, instalación, producto y estado se aplican en todas las vistas y aparecen como chips que se pueden quitar. Todos los gráficos responden a la misma pregunta, así que los números siempre coinciden.",
            },
            {
              title: "Mobile first, de verdad",
              body: "Cada layout parte de 320px. En el móvil la barra lateral se convierte en navegación inferior, los filtros se abren en un panel desde abajo y las zonas táctiles miden al menos 44px.",
            },
            {
              title: "Primero diseño, después código, con IA",
              body: "Diseñé todas las vistas en Pencil.dev antes de escribir código y luego las construí con Claude siguiendo reglas estrictas de React, TypeScript y Tailwind. Datos de prueba generados con semilla hicieron que los números fueran realistas y reproducibles sin backend.",
            },
          ],
        },
        outcome: {
          title: "Resultado",
          body: "Una herramienta de analítica funcional y publicada, con seis vistas, un design system en vivo, temas claro y oscuro y tablas accesibles. Muestra cómo trabajo hoy: yo decido la estructura y el diseño, y uso la IA para pasar del diseño a código de producción rápido y sin perder calidad.",
        },
      },
    },
  },
]

export function getCaseStudy(slug: string) {
  return CASE_STUDIES.find((c) => c.slug === slug)
}
