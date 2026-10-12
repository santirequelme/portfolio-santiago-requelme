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
          body: "Planning for the end of life is emotionally heavy and administratively dense. People fill in long, legal-sounding forms — beneficiaries, executors, bank details — about topics they would rather avoid. The product had to feel calm and guided, while handling complex, linked data reliably on every screen size.",
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
              body: "Shared primitives and page patterns reused across features — the foundation behind Aura, the design system showcased in this portfolio.",
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
              body: "Wills and codicils share the same structure, so I extracted it into reusable components — page intro, record grid, framed card, file drop zone — sized with container queries. Each new record type became faster to ship and consistent by default.",
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
          body: "Planificar el final de la vida es emocionalmente pesado y administrativamente denso. Las personas rellenan formularios largos y con lenguaje legal — beneficiarios, albaceas, datos bancarios — sobre temas que preferirían evitar. El producto tenía que sentirse tranquilo y guiado, y a la vez manejar datos complejos y relacionados de forma fiable en cualquier pantalla.",
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
              body: "Testamentos y codicilos comparten la misma estructura, así que la extraje en componentes reutilizables — intro de página, grilla de registros, tarjeta enmarcada, zona para soltar archivos — dimensionados con container queries. Cada nuevo tipo de registro se entrega más rápido y es coherente por defecto.",
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
]

export function getCaseStudy(slug: string) {
  return CASE_STUDIES.find((c) => c.slug === slug)
}
