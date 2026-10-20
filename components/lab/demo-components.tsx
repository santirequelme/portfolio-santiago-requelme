"use client"

// The components rendered in the playground preview. They are the same code
// the React panel prints (see lib/lab/codegen.ts): same recipes, same props.

import { forwardRef, useId, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes } from "react"
import { RECIPES } from "@/lib/lab/playground"
import { cn } from "@/lib/utils"

type ButtonRecipes = typeof RECIPES.button
type CardRecipes = typeof RECIPES.card
type InputRecipes = typeof RECIPES.input

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof ButtonRecipes["variants"]
  size?: keyof ButtonRecipes["sizes"]
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", type = "button", className, ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(RECIPES.button.base, RECIPES.button.sizes[size], RECIPES.button.variants[variant], className)}
      {...props}
    />
  ),
)
Button.displayName = "Button"

export type CardProps = HTMLAttributes<HTMLElement> & {
  variant?: keyof CardRecipes["variants"]
  size?: keyof CardRecipes["sizes"]
  disabled?: boolean
}

export function Card({ variant = "elevated", size = "md", disabled, className, ...props }: CardProps) {
  return (
    <article
      aria-disabled={disabled || undefined}
      className={cn(RECIPES.card.base, RECIPES.card.sizes[size], RECIPES.card.variants[variant], className)}
      {...props}
    />
  )
}

export const cardParts = RECIPES.card.parts

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label: string
  hint?: string
  variant?: keyof InputRecipes["variants"]
  size?: keyof InputRecipes["sizes"]
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, id, variant = "outline", size = "md", className, ...props }, ref) => {
    const autoId = useId()
    const inputId = id ?? autoId
    const hintId = hint ? `${inputId}-hint` : undefined
    const parts = RECIPES.input.parts

    return (
      <div className={parts.field}>
        <label htmlFor={inputId} className={parts.label}>
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-describedby={hintId}
          className={cn(RECIPES.input.base, RECIPES.input.sizes[size], RECIPES.input.variants[variant], className)}
          {...props}
        />
        {hint && (
          <p id={hintId} className={parts.hint}>
            {hint}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = "Input"
