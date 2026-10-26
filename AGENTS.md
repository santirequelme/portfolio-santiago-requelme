# Design system guide for AI agents

How to build UI with the design system behind the AI Engineering Lab (`/lab`).

## Where things live

| What | Where |
| --- | --- |
| Design tokens (source of truth, W3C format) | `tokens/lab.tokens.json` |
| Generated tokens (CSS, SwiftUI, Compose). Do not edit | `tokens/generated/` |
| Component specs, one per component | `specs/*.spec.json` |
| Spec schema (JSON Schema and TypeScript type) | `specs/schema/` |
| Web components and their style recipes | `components/lab/demo-components.tsx`, `RECIPES` in `lib/lab/playground.ts` |
| Code templates for React, Angular, Vue, Swift, Kotlin | `lib/lab/templates/`, filled with tokens by `lib/lab/stacks.ts` |
| Shared web CSS for the templates (`.ds-button`, `.ds-card`, `.ds-input`) | `lib/lab/component-css.ts` |
| Registry core (read-only, used by `/r`) | `lib/registry/` |

Before using a component, read its spec: `whenToUse` and `whenNotToUse` say whether it is the right one, `props` and `variants` say what exists, `composition` says what goes inside it.

## Reading the system over HTTP

The same tokens, specs and templates are published as static, read-only JSON (CORS open), built by `lib/registry/`:

| Route | Returns |
| --- | --- |
| `/r/index.json` | Components, their variants and sizes, and the supported stacks |
| `/r/tokens.json` | The full token set, with CSS, Swift and Kotlin names |
| `/r/rules.json` | These rules plus each spec's `accessibility` and `whenNotToUse` |
| `/r/<component>.json?stack=<stack>` | One component's spec, resolved tokens and code. Stacks: `react`, `angular`, `vue`, `swift`, `kotlin` |

An unknown component or stack returns `{ "error": { "code", "message", "received", "valid" } }`.

## Rules

1. **Always use tokens, never hardcode values.** Colours, radii, spacing and font sizes come from `tokens/lab.tokens.json`. In specs, refer to a token by its path (`color.primary`). In code, use the generated names: `var(--ds-color-primary)` on the web, `Tokens.colorPrimary` in Swift and Kotlin. If no token fits, add one to `tokens/lab.tokens.json` first; do not inline the value.
2. **Follow the `accessibility` section of the spec.** It defines the role, keyboard behaviour, focus visibility, minimum contrast and required labels. Never remove a focus style without a visible replacement. Never use a placeholder as a label.
3. **Use only what the spec describes.** No props, variants, sizes or states that are not in the spec. If you need one, change the spec first.

## Adding a component

1. **Spec first.** Create `specs/<name>.spec.json` with `"$schema": "./schema/component-spec.schema.json"`. Reference tokens by path only.
2. **Tokens.** Reuse existing token paths. If you add tokens, run `pnpm tokens:build` and `pnpm tokens:check`.
3. **Code.** Implement it in `components/lab/demo-components.tsx`, with its styles in `RECIPES.<name>` in `lib/lab/playground.ts`. Variants, sizes and prop defaults must match the spec. For the stack switcher and the registry, add its CSS rules to `lib/lab/component-css.ts` and a template per stack in `lib/lab/templates/`.
4. **Validate.** Run `pnpm specs:validate` and `npx tsc --noEmit`. The validator checks the schema, that every token path exists, and that variants, sizes and defaults match the code. Fix whichever side is wrong; do not loosen the check.

## Commands

```bash
pnpm specs:validate   # specs vs schema, tokens and code
pnpm tokens:build     # tokens/lab.tokens.json → tokens/generated/
pnpm tokens:check     # the lab's live token files match Style Dictionary
npx tsc --noEmit      # type check
pnpm test             # registry core and /r routes
```

## Known gaps

Do not copy these; fix them when you touch the component.

- No tokens yet for the primary hover shade, the page canvas (used as the focus ring offset) or control heights. The web recipes compute or hardcode them. `color.muted` now exists, but the playground recipes still read their own `--ui-muted`.
- Button has no loading state; Input has no error state.
- Contrast below what the specs require: primary Button label 4.36:1 and ghost Button text 4.32:1 (dark) and 3.88:1 (light), against 4.5:1; Input outline border about 1.3:1, against 3:1.
