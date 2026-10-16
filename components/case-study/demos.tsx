"use client"

import { useId, useRef, useState, type FormEvent } from "react"
import { Check, CircleAlert, Monitor, Smartphone } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { DemoId, Lang } from "@/lib/case-studies"
import { cn } from "@/lib/utils"

const COPY = {
  en: {
    tryIt: "Try it",
    disclosure: {
      card: "Ceremony",
      question: "Do you have wishes for the ceremony?",
      type: "Type of ceremony",
      types: ["Religious", "Secular", "No preference"],
      music: "Music you'd like played",
      musicPlaceholder: "e.g. Clair de Lune",
      hint: "Type something, switch it off and on again: the answer is still there.",
    },
    validation: {
      label: "IBAN",
      example: "Try DE89 3704 0044 0532 0130 00, or type a wrong digit.",
      blocked: "Only letters and numbers",
      typing: "Keep typing…",
      valid: "Valid IBAN",
      invalid: "The check digits don't match. Is there a typo?",
    },
    responsive: {
      desktop: "Desktop",
      mobile: "Mobile",
      name: "Name",
      relation: "Relation",
      email: "Email",
      role: "Role",
    },
  },
  es: {
    tryIt: "Pruébalo",
    disclosure: {
      card: "Ceremonia",
      question: "¿Tienes deseos para la ceremonia?",
      type: "Tipo de ceremonia",
      types: ["Religiosa", "Laica", "Sin preferencia"],
      music: "Música que te gustaría",
      musicPlaceholder: "p. ej. Clair de Lune",
      hint: "Escribe algo, apaga y vuelve a encender el interruptor: la respuesta sigue ahí.",
    },
    validation: {
      label: "IBAN",
      example: "Prueba con DE89 3704 0044 0532 0130 00, o cambia un dígito.",
      blocked: "Solo letras y números",
      typing: "Sigue escribiendo…",
      valid: "IBAN válido",
      invalid: "Los dígitos de control no coinciden. ¿Hay una errata?",
    },
    responsive: {
      desktop: "Escritorio",
      mobile: "Móvil",
      name: "Nombre",
      relation: "Relación",
      email: "Email",
      role: "Rol",
    },
  },
} satisfies Record<Lang, unknown>

const CONTACTS = {
  en: [
    { name: "Laura Gómez", relation: "Sister", email: "laura@example.com", role: "Executor" },
    { name: "Daniel Ortiz", relation: "Friend", email: "dani@example.com", role: "Beneficiary" },
    { name: "Marta Ruiz", relation: "Notary", email: "m.ruiz@example.com", role: "Advisor" },
  ],
  es: [
    { name: "Laura Gómez", relation: "Hermana", email: "laura@example.com", role: "Albacea" },
    { name: "Daniel Ortiz", relation: "Amigo", email: "dani@example.com", role: "Beneficiario" },
    { name: "Marta Ruiz", relation: "Notaria", email: "m.ruiz@example.com", role: "Asesora" },
  ],
}

function DisclosureDemo({ lang }: { lang: Lang }) {
  const t = COPY[lang].disclosure
  const [enabled, setEnabled] = useState(true)
  const [type, setType] = useState(0)
  const [music, setMusic] = useState("")
  const switchId = useId()
  const musicId = useId()

  return (
    <div className="rounded-card border border-primary/30 bg-background/60 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">{t.card}</p>

      <div className="flex items-center justify-between gap-4">
        <label htmlFor={switchId} className="text-sm md:text-base font-medium text-foreground">
          {t.question}
        </label>
        <button
          id={switchId}
          role="switch"
          aria-checked={enabled}
          onClick={() => setEnabled((v) => !v)}
          className={cn(
            "relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            enabled ? "bg-primary" : "bg-muted",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
              enabled && "translate-x-5",
            )}
          />
        </button>
      </div>

      <div hidden={!enabled} className="mt-5 space-y-4 border-t border-border/40 pt-5">
        <fieldset>
          <legend className="text-sm text-muted-foreground mb-2">{t.type}</legend>
          <div className="flex flex-wrap gap-2">
            {t.types.map((label, i) => (
              <button
                key={label}
                type="button"
                aria-pressed={type === i}
                onClick={() => setType(i)}
                className={cn(
                  "rounded-control border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                  type === i
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor={musicId} className="block text-sm text-muted-foreground mb-2">
            {t.music}
          </label>
          <input
            id={musicId}
            value={music}
            onChange={(e) => setMusic(e.target.value)}
            placeholder={t.musicPlaceholder}
            className="w-full rounded-control border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{t.hint}</p>
    </div>
  )
}

function ibanStatus(raw: string): "empty" | "typing" | "valid" | "invalid" {
  const iban = raw.replace(/\s/g, "")
  if (!iban) return "empty"
  if (iban.length < 15 || !/^[A-Z]{2}\d{2}/.test(iban)) return "typing"
  if (iban.length > 34) return "invalid"

  const rearranged = iban.slice(4) + iban.slice(0, 4)
  let remainder = 0
  for (const char of rearranged) {
    const value = /\d/.test(char) ? char : String(char.charCodeAt(0) - 55)
    for (const digit of value) remainder = (remainder * 10 + Number(digit)) % 97
  }
  return remainder === 1 ? "valid" : "invalid"
}

function formatIban(value: string) {
  return value
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 34)
    .replace(/(.{4})(?=.)/g, "$1 ")
}

function ValidationDemo({ lang }: { lang: Lang }) {
  const t = COPY[lang].validation
  const [value, setValue] = useState("")
  const [blocked, setBlocked] = useState(false)
  const [touched, setTouched] = useState(false)
  const blockedTimer = useRef<number | undefined>(undefined)
  const inputId = useId()
  const messageId = useId()

  const status = ibanStatus(value)
  const showError = status === "invalid" && (touched || value.replace(/\s/g, "").length >= 22)

  const onBeforeInput = (e: FormEvent<HTMLInputElement>) => {
    const data = (e.nativeEvent as InputEvent).data
    if (!data || !/[^a-zA-Z0-9 ]/.test(data)) return

    // A single invalid keystroke is blocked; pasted text goes through and gets cleaned by formatIban
    if (data.length === 1) e.preventDefault()
    setBlocked(true)
    window.clearTimeout(blockedTimer.current)
    blockedTimer.current = window.setTimeout(() => setBlocked(false), 1200)
  }

  return (
    <div className="rounded-card border border-border bg-background/60 p-5">
      <label htmlFor={inputId} className="block text-sm font-medium text-foreground mb-2">
        {t.label}
      </label>
      <input
        id={inputId}
        value={value}
        inputMode="text"
        autoComplete="off"
        spellCheck={false}
        aria-invalid={showError}
        aria-describedby={messageId}
        onBeforeInput={onBeforeInput}
        onChange={(e) => setValue(formatIban(e.target.value))}
        onBlur={() => setTouched(true)}
        placeholder="ES00 0000 0000 0000 0000 0000"
        className={cn(
          "w-full rounded-control border bg-background px-3 py-2.5 font-mono text-sm tracking-wide text-foreground placeholder:text-muted-foreground/50 transition-colors focus:outline-none focus:ring-2",
          showError
            ? "border-destructive/70 focus:ring-destructive/40"
            : status === "valid"
              ? "border-emerald-500/70 focus:ring-emerald-500/40"
              : "border-border/60 focus:ring-primary/50",
        )}
      />

      <p id={messageId} aria-live="polite" className="mt-2 min-h-5 flex items-center gap-1.5 text-xs">
        {blocked ? (
          <span className="text-amber-600 dark:text-amber-400">{t.blocked}</span>
        ) : showError ? (
          <span className="flex items-center gap-1.5 text-destructive">
            <CircleAlert className="h-3.5 w-3.5" aria-hidden="true" />
            {t.invalid}
          </span>
        ) : status === "valid" ? (
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            {t.valid}
          </span>
        ) : (
          <span className="text-muted-foreground">{status === "empty" ? t.example : t.typing}</span>
        )}
      </p>
    </div>
  )
}

function ResponsiveDemo({ lang }: { lang: Lang }) {
  const t = COPY[lang].responsive
  const contacts = CONTACTS[lang]
  const [view, setView] = useState<"desktop" | "mobile">("desktop")

  return (
    <div className="rounded-card border border-border bg-background/60 p-5">
      <div className="mb-5 inline-flex rounded-control border border-border bg-secondary p-0.5">
        {(
          [
            { id: "desktop", label: t.desktop, Icon: Monitor },
            { id: "mobile", label: t.mobile, Icon: Smartphone },
          ] as const
        ).map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            aria-pressed={view === id}
            onClick={() => setView(id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[6px] px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
              view === id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {view === "desktop" ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-4 font-medium">{t.name}</th>
                <th className="py-2 pr-4 font-medium">{t.relation}</th>
                <th className="py-2 pr-4 font-medium">{t.email}</th>
                <th className="py-2 font-medium">{t.role}</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.email} className="border-b border-border/30 last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-foreground">{c.name}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{c.relation}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{c.email}</td>
                  <td className="py-2.5">
                    <span className="rounded-tag bg-primary/10 px-2 py-0.5 text-xs text-primary">{c.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-[300px] space-y-2 rounded-[1.75rem] border border-border/60 bg-background p-3">
          {contacts.map((c) => (
            <div key={c.email} className="rounded-control border border-border bg-card/60 p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <span className="rounded-tag bg-primary/10 px-2 py-0.5 text-[11px] text-primary">{c.role}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{c.relation}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function CaseStudyDemo({ id }: { id: DemoId }) {
  const { language } = useLanguage()

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{COPY[language].tryIt}</p>
      {id === "disclosure" && <DisclosureDemo lang={language} />}
      {id === "validation" && <ValidationDemo lang={language} />}
      {id === "responsive" && <ResponsiveDemo lang={language} />}
    </div>
  )
}
