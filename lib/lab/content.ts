// Copy for the AI Engineering Lab (EN / ES). Code samples stay in English.

type Lang = "en" | "es"

export interface WorkflowStep {
  id: string
  title: string
  objective: string
  inputLabel: string
  input: string
  aiHelps: string[]
  iDecide: string[]
  risks: { risk: string; mitigation: string }[]
  output: string
}

export interface ProcessStage {
  id: string
  title: string
  tools: string[]
  activities: string[]
  deliverables: string[]
}

export interface Aspect {
  id: string
  title: string
  why: string
  tradeoff: string
  /** Substrings that identify the refined lines this aspect is about. */
  match: string[]
}

export interface Principle {
  title: string
  body: string
  link: { href: string; label: string }
}

// ─── Comparison snippets (shared by both languages) ─────────────────────────

export const INITIAL_BUTTON = `// First pass from a one-line prompt:
// "make a reusable button with a loading state"
export function Button(props: any) {
  return (
    <div
      className={\`btn \${props.primary ? "btn-primary" : ""} \${props.small ? "btn-sm" : ""}\`}
      style={{ background: props.primary ? "#E23A0D" : "#fff", borderRadius: 8 }}
      onClick={props.onClick}
    >
      {props.loading ? <Spinner /> : props.children}
    </div>
  )
}`

export const REFINED_BUTTON = `import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { Spinner } from "./spinner"
import { buttonRecipe, type ButtonSize, type ButtonVariant } from "./button.recipe"

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", loading = false, disabled, type = "button", className, children, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonRecipe({ variant, size }), className)}
      {...props}
    >
      {loading && <Spinner aria-hidden="true" />}
      <span className={cn(loading && "opacity-70")}>{children}</span>
    </button>
  ),
)
Button.displayName = "Button"`

// ─── Copy ────────────────────────────────────────────────────────────────────

export const LAB_COPY = {
  en: {
    meta: { eyebrow: "AI Engineering Lab", index: "Lab" },
    hero: {
      title: "From design to code, faster with AI.",
      body: "A practical demonstration of how I use AI-assisted development to turn ideas into production-ready interfaces. Real components, engineering decisions, and human refinement.",
      intro:
        "AI makes the implementation faster. Architecture, accessibility, maintainability and product decisions still need someone accountable — that part stays with me.",
      accelerates: { title: "AI accelerates", items: ["Scaffolding and repetitive variants", "Mapping a design to tokens and props", "Drafting tests, docs and migrations"] },
      human: { title: "I own", items: ["Component API and architecture", "Accessibility and UX quality", "Trade-offs, scope and the final review"] },
      cta: "Open the playground",
      note: "Everything on this page runs locally: no AI API, no backend, deterministic examples.",
    },
    playground: {
      marker: "Design-to-Code Playground",
      title: "Change the design, read the code.",
      body: "Every control updates the live component and the code at the same time. The preview renders the exact React component shown in the panel.",
      controls: "Controls",
      component: "Component",
      variant: "Variant",
      size: "Size",
      theme: "Theme",
      state: "State",
      radius: "Radius",
      accent: "Accent",
      customAccent: "Custom accent colour",
      showCode: "Code panel",
      preview: "Live preview",
      states: { default: "Default", hover: "Hover", disabled: "Disabled" },
      themes: { light: "Light", dark: "Dark" },
      components: { button: "Button", card: "Card", input: "Input" },
      contrast: "Text on accent",
      contrastSurface: "Accent on surface",
      reset: "Reset",
      framework: "Framework",
      illustrative: "Illustrative Angular equivalent of the same API. It is generated from the same recipes but not executed on this page.",
      runs: "This is the code the preview is running.",
      clicked: "Clicked",
    },
    code: { copy: "Copy", copied: "Copied", failed: "Copy failed — select and copy manually", files: "Files" },
    workflow: {
      marker: "AI engineering workflow",
      title: "Four steps, one person accountable.",
      body: "How a component moves from a design to production. Pick a step to see what AI speeds up and what I decide.",
      labels: {
        objective: "Objective",
        input: "Example input",
        ai: "What AI helps with",
        me: "What I review or decide",
        risks: "Risks and how I handle them",
        output: "Output",
      },
      steps: [
        {
          id: "spec",
          title: "Design & Specification",
          objective: "Turn the Figma component into an explicit spec that both people and agents can implement without guessing.",
          inputLabel: "specs/button.md",
          input: `component: Button
variants: primary | secondary | ghost
sizes: sm 32 · md 40 · lg 48
tokens: --ui-accent --ui-on-accent --ui-radius
states: default · hover · focus-visible · disabled · loading
a11y: native <button>, visible focus ring, aria-busy while loading
api: extends ButtonHTMLAttributes, forwardRef, no boolean flags`,
          aiHelps: [
            "Reading variables and variants from Figma through Figma MCP",
            "Drafting the spec and listing edge cases I might miss",
            "Recalling past decisions and conventions stored in Engram",
          ],
          iDecide: ["The component API and naming", "Which states exist — and what is out of scope", "How design values map to existing tokens"],
          risks: [
            { risk: "The spec copies pixel values from Figma", mitigation: "Map every value to a token before implementation" },
            { risk: "States are forgotten (loading, disabled, focus)", mitigation: "A fixed state checklist in every spec" },
          ],
          output: "A reviewed spec with acceptance criteria.",
        },
        {
          id: "build",
          title: "AI-Assisted Implementation",
          objective: "Get to a working first version quickly, inside the repository's conventions instead of around them.",
          inputLabel: "Prompt to Claude Code",
          input: `Implement components/ui/button.tsx from specs/button.md.
Follow the recipes in lib/ui.ts and the --ui-* tokens.
Reuse cn() from lib/utils. No new dependencies.
Add a story per state. Keep the diff small.`,
          aiHelps: [
            "Scaffolding the component, variants and stories",
            "Repetitive mappings, e.g. the same API in React and Angular",
            "Loading project context: CLAUDE.md, existing files and Engram memory",
          ],
          iDecide: ["Whether the structure fits the codebase", "Rejecting abstractions we don't need yet", "Splitting the work into reviewable steps"],
          risks: [
            { risk: "Invented props, APIs or dependencies", mitigation: "Constrain with the spec, repo context and small diffs" },
            { risk: "Naming drifts from the design system", mitigation: "Point the agent at existing recipes and tokens" },
          ],
          output: "A draft branch with the component and its stories.",
        },
        {
          id: "review",
          title: "Review & Refinement",
          objective: "Make it correct, accessible and maintainable — not just visually right.",
          inputLabel: "Review checklist",
          input: `[ ] Keyboard: Tab, Enter, Space, visible focus
[ ] Screen reader: name, role, busy state
[ ] Contrast of text on every variant
[ ] No \`any\`; props typed from the recipe
[ ] Tokens only, no raw hex values`,
          aiHelps: ["A second-opinion review of the diff", "Generating missing tests", "Explaining unfamiliar code paths"],
          iDecide: ["Keyboard and screen-reader testing by hand", "API ergonomics from the consumer's side", "Visual QA against the design"],
          risks: [
            { risk: "Green tests hide a poor experience", mitigation: "A manual accessibility pass on every interactive state" },
            { risk: "Tests written to match the code, not the spec", mitigation: "Derive test cases from the acceptance criteria" },
          ],
          output: "A refined component — and the decisions saved to Engram for the next session.",
        },
        {
          id: "ship",
          title: "Production Ready",
          objective: "Ship safely and keep the component easy to evolve.",
          inputLabel: "Release checklist",
          input: `type-check ✓   lint ✓   unit ✓   visual ✓
docs: usage, do / don't, accessibility notes
changelog: feat(button): add loading state`,
          aiHelps: ["Writing docs and changelog entries", "Migration notes and codemods for old usages"],
          iDecide: ["The final review and when to release", "Whether a change is breaking for consumers"],
          risks: [{ risk: "Breaking changes for teams using the component", mitigation: "Deprecate first, document, then remove" }],
          output: "A merged, documented component in the design system.",
        },
      ] satisfies WorkflowStep[],
    },
    comparison: {
      marker: "First pass vs refined",
      title: "Same button, two levels of intent.",
      body: "A first pass from an underspecified prompt, next to the version after review. The first pass is not bad because AI wrote it — it is the result of a vague request. With the spec from step 1, the first draft lands much closer to the refined one.",
      tabs: { initial: "First pass", refined: "Refined", diff: "Diff" },
      aspectsLabel: "Inspect a difference",
      whyLabel: "Why",
      tradeoffLabel: "Trade-off",
      highlightHint: "Highlighted lines in the refined version",
      aspects: [
        {
          id: "a11y",
          title: "Accessibility",
          why: "A native <button> brings keyboard support, focus and the right role for free. type=\"button\" avoids accidental form submits, aria-busy announces loading, and the label stays in place so screen readers still read it.",
          tradeoff: "None worth avoiding here — a styled <div> needs role, tabIndex and key handlers to get only part of this.",
          match: ["<button", "type={type}", "aria-busy", "disabled={disabled || loading}", "<Spinner aria-hidden"],
        },
        {
          id: "api",
          title: "Component API",
          why: "variant and size are unions instead of boolean flags, so impossible combinations (primary + secondary) can't be expressed. Extending the native attributes keeps onClick, form and aria props working.",
          tradeoff: "Unions are a bit more verbose to call than flags, but they scale when a fourth variant arrives.",
          match: ["variant?: ButtonVariant", "size?: ButtonSize", "ButtonHTMLAttributes<HTMLButtonElement>", "{...props}"],
        },
        {
          id: "types",
          title: "Type safety",
          why: "No `any`: props are typed and exported, and variant/size types come from the recipe, so the styles and the types can't disagree.",
          tradeoff: "More types to maintain — they are generated from the recipe to keep that cost low.",
          match: ["export type ButtonProps", "type ButtonSize, type ButtonVariant", "forwardRef<HTMLButtonElement, ButtonProps>"],
        },
        {
          id: "style",
          title: "Styling consistency",
          why: "No raw hex or inline styles: the recipe reads design tokens, and cn() merges consumer classes predictably.",
          tradeoff: "One indirection (the recipe file) — worth it once there is more than one variant.",
          match: ["buttonRecipe({ variant, size })", "import { cn }", "from \"./button.recipe\""],
        },
        {
          id: "maint",
          title: "Maintainability",
          why: "forwardRef lets forms and focus management reach the element; displayName makes it readable in DevTools; defaults are explicit in one place.",
          tradeoff: "forwardRef is boilerplate. In React 19 a ref can be a regular prop, so a codebase on 19 only can drop it.",
          match: ["forwardRef<", "ref={ref}", "Button.displayName", "variant = \"primary\", size = \"md\""],
        },
      ] satisfies Aspect[],
    },
    process: {
      marker: "Design-to-code process",
      title: "Where each tool fits.",
      body: "Tools I use in this workflow. They are not connected to this page — it is a map of how I work.",
      labels: { tools: "Tools", activities: "Activities", deliverables: "Deliverables" },
      stages: [
        { id: "design", title: "Design", tools: ["Figma", "Figma variables"], activities: ["User flows and component design", "Variables for colour, spacing and radius"], deliverables: ["Figma frames", "Token set"] },
        { id: "spec", title: "Specification", tools: ["Figma MCP", "Claude Code", "Engram"], activities: ["Define API, states and accessibility criteria", "Recall earlier decisions from project memory"], deliverables: ["Spec with acceptance criteria"] },
        { id: "build", title: "AI-assisted implementation", tools: ["Claude Code", "Cursor", "Engram"], activities: ["Scaffold components, variants and stories", "Refactor within repo conventions"], deliverables: ["Draft branch"] },
        { id: "tests", title: "Tests", tools: ["Type-check", "Lint", "Unit & visual tests"], activities: ["Run automated checks", "Draft missing tests with AI, verify them by hand"], deliverables: ["Green checks"] },
        { id: "review", title: "Human review", tools: ["Git", "Keyboard & screen reader", "Browser DevTools"], activities: ["Accessibility and API review", "Visual QA against the design", "Save new decisions to Engram"], deliverables: ["Approved pull request"] },
        { id: "prod", title: "Production", tools: ["Git", "CI", "Vercel"], activities: ["Release, docs and changelog", "Watch for regressions"], deliverables: ["Released, documented component"] },
      ] satisfies ProcessStage[],
    },
    principles: {
      marker: "Engineering principles",
      title: "What I optimise for.",
      items: [
        { title: "Reusable, maintainable components", body: "One recipe drives every variant and size; the playground prints the same source it renders.", link: { href: "#playground", label: "See the playground" } },
        { title: "Accessible interfaces", body: "Native elements, visible focus, labelled inputs and announced states — the first thing I check in review.", link: { href: "#comparison", label: "See the accessibility diff" } },
        { title: "Consistent design systems", body: "Components read semantic tokens, so theme, radius and accent change through configuration, not edits.", link: { href: "#playground", label: "Change the tokens" } },
        { title: "Type safety and predictable state", body: "Unions over boolean flags; a single config object is the only state the playground has.", link: { href: "#comparison", label: "See the API diff" } },
        { title: "Performance and responsive behaviour", body: "This page ships no highlighting library and calls no API; the code view is a small local tokenizer.", link: { href: "#process", label: "See the process" } },
        { title: "Human review of AI-generated code", body: "AI drafts, I review: keyboard, screen reader, API ergonomics and visual QA before anything ships.", link: { href: "#workflow", label: "See step 3" } },
        { title: "Fast iteration, no unnecessary complexity", body: "Small diffs, no new dependencies unless they pay for themselves, abstractions only when there is a second use.", link: { href: "#workflow", label: "See the workflow" } },
      ] satisfies Principle[],
    },
    teaser: {
      marker: "AI Engineering Lab",
      title: "How I use AI to go from design to code.",
      body: "An interactive playground, my workflow and the review decisions behind it.",
      cta: "Open the Lab",
    },
  },
  es: {
    meta: { eyebrow: "AI Engineering Lab", index: "Lab" },
    hero: {
      title: "Del diseño al código, más rápido con IA.",
      body: "Una demostración práctica de cómo uso el desarrollo asistido por IA para convertir ideas en interfaces listas para producción. Componentes reales, decisiones de ingeniería y refinamiento humano.",
      intro:
        "La IA acelera la implementación. La arquitectura, la accesibilidad, la mantenibilidad y las decisiones de producto siguen necesitando a alguien responsable: esa parte es mía.",
      accelerates: { title: "La IA acelera", items: ["Scaffolding y variantes repetitivas", "Traducir un diseño a tokens y props", "Borradores de tests, docs y migraciones"] },
      human: { title: "Yo me hago cargo de", items: ["La API y la arquitectura del componente", "La accesibilidad y la calidad de UX", "Los trade-offs, el alcance y la revisión final"] },
      cta: "Abrir el playground",
      note: "Todo en esta página corre en local: sin API de IA, sin backend, con ejemplos deterministas.",
    },
    playground: {
      marker: "Design-to-Code Playground",
      title: "Cambia el diseño, lee el código.",
      body: "Cada control actualiza a la vez el componente en vivo y el código. La vista previa renderiza exactamente el componente React que muestra el panel.",
      controls: "Controles",
      component: "Componente",
      variant: "Variante",
      size: "Tamaño",
      theme: "Tema",
      state: "Estado",
      radius: "Radio",
      accent: "Acento",
      customAccent: "Color de acento personalizado",
      showCode: "Panel de código",
      preview: "Vista previa",
      states: { default: "Normal", hover: "Hover", disabled: "Deshabilitado" },
      themes: { light: "Claro", dark: "Oscuro" },
      components: { button: "Botón", card: "Tarjeta", input: "Input" },
      contrast: "Texto sobre acento",
      contrastSurface: "Acento sobre superficie",
      reset: "Restablecer",
      framework: "Framework",
      illustrative: "Equivalente ilustrativo en Angular de la misma API. Se genera con las mismas recetas, pero no se ejecuta en esta página.",
      runs: "Este es el código que está ejecutando la vista previa.",
      clicked: "Click",
    },
    code: { copy: "Copiar", copied: "Copiado", failed: "No se pudo copiar: selecciona y copia a mano", files: "Archivos" },
    workflow: {
      marker: "Flujo de trabajo con IA",
      title: "Cuatro pasos, una persona responsable.",
      body: "Cómo pasa un componente del diseño a producción. Elige un paso para ver qué acelera la IA y qué decido yo.",
      labels: {
        objective: "Objetivo",
        input: "Ejemplo de entrada",
        ai: "En qué ayuda la IA",
        me: "Qué reviso o decido yo",
        risks: "Riesgos y cómo los manejo",
        output: "Resultado",
      },
      steps: [
        {
          id: "spec",
          title: "Diseño y especificación",
          objective: "Convertir el componente de Figma en una especificación explícita que personas y agentes puedan implementar sin adivinar.",
          inputLabel: "specs/button.md",
          input: `component: Button
variants: primary | secondary | ghost
sizes: sm 32 · md 40 · lg 48
tokens: --ui-accent --ui-on-accent --ui-radius
states: default · hover · focus-visible · disabled · loading
a11y: native <button>, visible focus ring, aria-busy while loading
api: extends ButtonHTMLAttributes, forwardRef, no boolean flags`,
          aiHelps: [
            "Leer variables y variantes de Figma con Figma MCP",
            "Redactar la spec y listar casos límite que podría pasar por alto",
            "Recuperar decisiones y convenciones anteriores guardadas en Engram",
          ],
          iDecide: ["La API y los nombres del componente", "Qué estados existen y qué queda fuera de alcance", "Cómo se traducen los valores del diseño a tokens existentes"],
          risks: [
            { risk: "La spec copia valores en píxeles de Figma", mitigation: "Traducir cada valor a un token antes de implementar" },
            { risk: "Se olvidan estados (loading, disabled, focus)", mitigation: "Una checklist fija de estados en cada spec" },
          ],
          output: "Una spec revisada con criterios de aceptación.",
        },
        {
          id: "build",
          title: "Implementación asistida por IA",
          objective: "Llegar rápido a una primera versión funcional, dentro de las convenciones del repositorio y no por fuera.",
          inputLabel: "Prompt a Claude Code",
          input: `Implement components/ui/button.tsx from specs/button.md.
Follow the recipes in lib/ui.ts and the --ui-* tokens.
Reuse cn() from lib/utils. No new dependencies.
Add a story per state. Keep the diff small.`,
          aiHelps: [
            "Scaffolding del componente, variantes y stories",
            "Traducciones repetitivas, como la misma API en React y Angular",
            "Cargar contexto del proyecto: CLAUDE.md, archivos existentes y la memoria de Engram",
          ],
          iDecide: ["Si la estructura encaja en el código existente", "Rechazar abstracciones que todavía no necesitamos", "Dividir el trabajo en pasos revisables"],
          risks: [
            { risk: "Props, APIs o dependencias inventadas", mitigation: "Acotar con la spec, el contexto del repo y diffs pequeños" },
            { risk: "Los nombres se alejan del design system", mitigation: "Señalarle al agente las recetas y tokens existentes" },
          ],
          output: "Una rama borrador con el componente y sus stories.",
        },
        {
          id: "review",
          title: "Revisión y refinamiento",
          objective: "Que sea correcto, accesible y mantenible, no solo que se vea bien.",
          inputLabel: "Checklist de revisión",
          input: `[ ] Keyboard: Tab, Enter, Space, visible focus
[ ] Screen reader: name, role, busy state
[ ] Contrast of text on every variant
[ ] No \`any\`; props typed from the recipe
[ ] Tokens only, no raw hex values`,
          aiHelps: ["Una segunda opinión sobre el diff", "Generar los tests que faltan", "Explicar partes del código poco conocidas"],
          iDecide: ["Pruebas a mano con teclado y lector de pantalla", "La ergonomía de la API desde quien la usa", "QA visual contra el diseño"],
          risks: [
            { risk: "Los tests en verde esconden una mala experiencia", mitigation: "Una pasada manual de accesibilidad en cada estado interactivo" },
            { risk: "Tests escritos para el código y no para la spec", mitigation: "Derivar los casos de prueba de los criterios de aceptación" },
          ],
          output: "Un componente refinado, y las decisiones guardadas en Engram para la próxima sesión.",
        },
        {
          id: "ship",
          title: "Listo para producción",
          objective: "Publicar con seguridad y que el componente siga siendo fácil de evolucionar.",
          inputLabel: "Checklist de release",
          input: `type-check ✓   lint ✓   unit ✓   visual ✓
docs: usage, do / don't, accessibility notes
changelog: feat(button): add loading state`,
          aiHelps: ["Redactar docs y entradas del changelog", "Notas de migración y codemods para usos antiguos"],
          iDecide: ["La revisión final y cuándo publicar", "Si un cambio rompe a quienes usan el componente"],
          risks: [{ risk: "Cambios que rompen a los equipos que usan el componente", mitigation: "Primero deprecar, documentar y después eliminar" }],
          output: "Un componente fusionado y documentado en el design system.",
        },
      ] satisfies WorkflowStep[],
    },
    comparison: {
      marker: "Primera versión vs refinada",
      title: "El mismo botón, dos niveles de intención.",
      body: "Una primera versión a partir de un prompt poco específico, al lado de la versión después de la revisión. La primera no es mala porque la haya escrito una IA: es el resultado de un pedido vago. Con la spec del paso 1, el primer borrador queda mucho más cerca del refinado.",
      tabs: { initial: "Primera versión", refined: "Refinada", diff: "Diff" },
      aspectsLabel: "Inspecciona una diferencia",
      whyLabel: "Por qué",
      tradeoffLabel: "Trade-off",
      highlightHint: "Líneas resaltadas en la versión refinada",
      aspects: [
        {
          id: "a11y",
          title: "Accesibilidad",
          why: "Un <button> nativo trae soporte de teclado, foco y el rol correcto sin esfuerzo. type=\"button\" evita envíos de formulario accidentales, aria-busy anuncia la carga y la etiqueta sigue ahí, así los lectores de pantalla la leen.",
          tradeoff: "Ninguno que valga la pena evitar: un <div> estilizado necesita role, tabIndex y manejo de teclas para conseguir solo una parte de esto.",
          match: ["<button", "type={type}", "aria-busy", "disabled={disabled || loading}", "<Spinner aria-hidden"],
        },
        {
          id: "api",
          title: "API del componente",
          why: "variant y size son uniones en lugar de flags booleanos, así no se pueden expresar combinaciones imposibles (primary + secondary). Extender los atributos nativos mantiene onClick, form y los aria.",
          tradeoff: "Las uniones son algo más largas de escribir que los flags, pero escalan cuando llega una cuarta variante.",
          match: ["variant?: ButtonVariant", "size?: ButtonSize", "ButtonHTMLAttributes<HTMLButtonElement>", "{...props}"],
        },
        {
          id: "types",
          title: "Tipado",
          why: "Sin `any`: las props están tipadas y exportadas, y los tipos de variant/size salen de la receta, así estilos y tipos no pueden contradecirse.",
          tradeoff: "Más tipos que mantener; se generan desde la receta para que ese costo sea bajo.",
          match: ["export type ButtonProps", "type ButtonSize, type ButtonVariant", "forwardRef<HTMLButtonElement, ButtonProps>"],
        },
        {
          id: "style",
          title: "Consistencia de estilos",
          why: "Sin hex ni estilos inline: la receta lee tokens del design system y cn() combina las clases de quien lo usa de forma predecible.",
          tradeoff: "Una indirección más (el archivo de la receta); vale la pena en cuanto hay más de una variante.",
          match: ["buttonRecipe({ variant, size })", "import { cn }", "from \"./button.recipe\""],
        },
        {
          id: "maint",
          title: "Mantenibilidad",
          why: "forwardRef permite que formularios y manejo de foco lleguen al elemento; displayName lo hace legible en DevTools; los valores por defecto están explícitos en un solo lugar.",
          tradeoff: "forwardRef es boilerplate. En React 19 la ref puede ser una prop normal, así que un código solo en 19 puede quitarlo.",
          match: ["forwardRef<", "ref={ref}", "Button.displayName", "variant = \"primary\", size = \"md\""],
        },
      ] satisfies Aspect[],
    },
    process: {
      marker: "Proceso de diseño a código",
      title: "Dónde encaja cada herramienta.",
      body: "Herramientas que uso en este flujo. No están conectadas a esta página: es un mapa de cómo trabajo.",
      labels: { tools: "Herramientas", activities: "Actividades", deliverables: "Entregables" },
      stages: [
        { id: "design", title: "Diseño", tools: ["Figma", "Variables de Figma"], activities: ["Flujos de usuario y diseño de componentes", "Variables de color, espaciado y radios"], deliverables: ["Frames en Figma", "Set de tokens"] },
        { id: "spec", title: "Especificación", tools: ["Figma MCP", "Claude Code", "Engram"], activities: ["Definir API, estados y criterios de accesibilidad", "Recuperar decisiones previas de la memoria del proyecto"], deliverables: ["Spec con criterios de aceptación"] },
        { id: "build", title: "Implementación asistida por IA", tools: ["Claude Code", "Cursor", "Engram"], activities: ["Scaffolding de componentes, variantes y stories", "Refactors dentro de las convenciones del repo"], deliverables: ["Rama borrador"] },
        { id: "tests", title: "Tests", tools: ["Type-check", "Lint", "Tests unitarios y visuales"], activities: ["Correr los checks automáticos", "Redactar con IA los tests que faltan y verificarlos a mano"], deliverables: ["Checks en verde"] },
        { id: "review", title: "Revisión humana", tools: ["Git", "Teclado y lector de pantalla", "DevTools del navegador"], activities: ["Revisión de accesibilidad y de la API", "QA visual contra el diseño", "Guardar las decisiones nuevas en Engram"], deliverables: ["Pull request aprobado"] },
        { id: "prod", title: "Producción", tools: ["Git", "CI", "Vercel"], activities: ["Release, docs y changelog", "Vigilar regresiones"], deliverables: ["Componente publicado y documentado"] },
      ] satisfies ProcessStage[],
    },
    principles: {
      marker: "Principios de ingeniería",
      title: "Lo que optimizo.",
      items: [
        { title: "Componentes reutilizables y mantenibles", body: "Una receta define todas las variantes y tamaños; el playground imprime el mismo código que renderiza.", link: { href: "#playground", label: "Ver el playground" } },
        { title: "Interfaces accesibles", body: "Elementos nativos, foco visible, inputs con etiqueta y estados anunciados: lo primero que reviso.", link: { href: "#comparison", label: "Ver el diff de accesibilidad" } },
        { title: "Design systems consistentes", body: "Los componentes leen tokens semánticos, así tema, radio y acento cambian por configuración, no editando código.", link: { href: "#playground", label: "Cambiar los tokens" } },
        { title: "Tipado y estado predecible", body: "Uniones en lugar de flags booleanos; un único objeto de configuración es todo el estado del playground.", link: { href: "#comparison", label: "Ver el diff de la API" } },
        { title: "Rendimiento y responsive", body: "Esta página no carga librerías de resaltado ni llama a ninguna API; el código se colorea con un tokenizador local pequeño.", link: { href: "#process", label: "Ver el proceso" } },
        { title: "Revisión humana del código generado", body: "La IA propone, yo reviso: teclado, lector de pantalla, ergonomía de la API y QA visual antes de publicar.", link: { href: "#workflow", label: "Ver el paso 3" } },
        { title: "Iterar rápido, sin complejidad innecesaria", body: "Diffs pequeños, sin dependencias nuevas salvo que se justifiquen, abstracciones solo cuando hay un segundo uso.", link: { href: "#workflow", label: "Ver el flujo" } },
      ] satisfies Principle[],
    },
    teaser: {
      marker: "AI Engineering Lab",
      title: "Cómo uso la IA para ir del diseño al código.",
      body: "Un playground interactivo, mi flujo de trabajo y las decisiones de revisión detrás.",
      cta: "Abrir el Lab",
    },
  },
} satisfies Record<Lang, unknown>

export type LabCopy = (typeof LAB_COPY)["en"]
