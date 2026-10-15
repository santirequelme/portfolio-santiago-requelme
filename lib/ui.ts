// Shared class recipes for interactive elements, so every button, link and
// chip on the site speaks the same visual language.

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium select-none " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-50"

const sizes = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-[15px]",
}

const variants = {
  // Solid signal colour with a hairline top highlight; lifts its shadow on hover.
  primary:
    "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_1px_2px_rgb(0_0_0/0.12)] " +
    "hover:bg-[color-mix(in_oklch,var(--primary)_88%,black)] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_8px_20px_-8px_var(--primary)]",
  // Ink on paper: the neutral counterpart to primary.
  ink:
    "bg-foreground text-background shadow-[0_1px_2px_rgb(0_0_0/0.12)] hover:bg-foreground/85",
  // Hairline border on a surface; border darkens on hover.
  secondary:
    "border border-border bg-card text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04)] hover:border-foreground/25 hover:bg-secondary",
  ghost: "text-foreground/75 hover:bg-foreground/[0.05] hover:text-foreground",
}

export type ButtonVariant = keyof typeof variants
export type ButtonSize = keyof typeof sizes

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra = "") {
  return `${base} ${sizes[size]} ${variants[variant]} ${extra}`.trim()
}

// Technical label: mono, uppercase, square-ish corners.
export const chipClass =
  "inline-flex items-center gap-1 rounded-tag border border-border bg-card px-2 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground"

export const chipAccentClass =
  "inline-flex items-center gap-1 rounded-tag border border-primary/25 bg-primary/[0.07] px-2 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-primary"

// Small mono caption used for annotations, coordinates and section markers.
export const monoLabelClass = "font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
