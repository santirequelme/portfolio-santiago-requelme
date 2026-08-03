"use client"

import { createPortal } from "react-dom"
import { useEffect, useState, type ReactNode } from "react"
import { Check, X, AlertTriangle } from "lucide-react"

/* ── Button ────────────────────────────────────────────────────────────── */
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger"
export type ButtonSize = "sm" | "md" | "lg"

export function Button({
  children,
  variant = "primary",
  size = "md",
  pill = false,
  full = false,
  icon = false,
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  "aria-label": ariaLabel,
}: {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  pill?: boolean
  full?: boolean
  icon?: boolean
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  "aria-label"?: string
}) {
  const cls = [
    "dsx-btn",
    `dsx-btn--${size}`,
    `dsx-btn--${variant}`,
    pill && "dsx-btn--pill",
    full && "dsx-btn--full",
    icon && "dsx-btn--icon",
  ]
    .filter(Boolean)
    .join(" ")
  return (
    <button type={type} className={cls} disabled={disabled || loading} onClick={onClick} aria-label={ariaLabel}>
      {loading && <span className="dsx-btn__spinner" aria-hidden />}
      {children}
    </button>
  )
}

/* ── Badge ─────────────────────────────────────────────────────────────── */
export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger" | "info" | "solid"

export function Badge({ children, tone = "neutral", dot = false }: { children: ReactNode; tone?: BadgeTone; dot?: boolean }) {
  return (
    <span className={`dsx-badge dsx-badge--${tone}`}>
      {dot && <span className="dsx-badge__dot" aria-hidden />}
      {children}
    </span>
  )
}

/* ── Tooltip (CSS-driven, hover + focus) ───────────────────────────────── */
export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="dsx-tip" tabIndex={0}>
      {children}
      <span role="tooltip" className="dsx-tip__bubble">
        {label}
      </span>
    </span>
  )
}

/* ── Switch ────────────────────────────────────────────────────────────── */
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="dsx-switch"
      data-on={checked}
      onClick={() => onChange(!checked)}
    >
      <span className="dsx-switch__track">
        <span className="dsx-switch__thumb" />
      </span>
      {label && <span className="dsx-switch__label">{label}</span>}
    </button>
  )
}

/* ── Fields ────────────────────────────────────────────────────────────── */
export function TextField({
  label,
  placeholder,
  hint,
  error,
  defaultValue,
  type = "text",
}: {
  label: string
  placeholder?: string
  hint?: string
  error?: string
  defaultValue?: string
  type?: string
}) {
  return (
    <label className="dsx-field">
      <span className="dsx-field__label">{label}</span>
      <input className="dsx-input" type={type} placeholder={placeholder} defaultValue={defaultValue} data-invalid={!!error} />
      {error ? <span className="dsx-field__error">{error}</span> : hint ? <span className="dsx-field__hint">{hint}</span> : null}
    </label>
  )
}

export function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="dsx-field">
      <span className="dsx-field__label">{label}</span>
      <select className="dsx-select" defaultValue="">
        <option value="" disabled>
          Choose an option
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}

/* ── Confirm dialog (Yes / No) ─────────────────────────────────────────── */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Yes, continue",
  cancelLabel = "No, cancel",
  tone = "primary",
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: "primary" | "danger"
  onConfirm: () => void
  onCancel: () => void
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel()
      if (e.key === "Enter") onConfirm()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onCancel, onConfirm])

  if (!open || !mounted) return null

  const iconBg = tone === "danger" ? "var(--ds-danger-soft)" : "var(--ds-primary-soft)"
  const iconColor = tone === "danger" ? "var(--ds-danger)" : "var(--ds-primary)"

  return createPortal(
    <div className="dsx-overlay" role="presentation" onClick={onCancel}>
      <div className="dsx-dialog" role="alertdialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="dsx-dialog__icon" style={{ background: iconBg, color: iconColor }}>
          <AlertTriangle size={22} />
        </div>
        <h3 className="dsx-dialog__title">{title}</h3>
        <p className="dsx-dialog__msg">{message}</p>
        <div className="dsx-dialog__actions">
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/* ── Toaster ───────────────────────────────────────────────────────────── */
export type Toast = { id: number; tone: "success" | "danger" | "info"; title: string; message?: string }

export function Toaster({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const icon = (tone: Toast["tone"]) =>
    tone === "success" ? <Check size={16} /> : tone === "danger" ? <X size={16} /> : <AlertTriangle size={16} />

  return createPortal(
    <div className="dsx-toaster">
      {toasts.map((t) => (
        <div key={t.id} className={`dsx-toast dsx-toast--${t.tone}`} role="status">
          <span className="dsx-toast__ico">{icon(t.tone)}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="dsx-toast__title">{t.title}</div>
            {t.message && <div className="dsx-toast__msg">{t.message}</div>}
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => onDismiss(t.id)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ds-text-subtle)", padding: 0 }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>,
    document.body,
  )
}
