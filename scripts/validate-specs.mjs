// Validates specs/*.spec.json. Run with `pnpm specs:validate`. Checks, per spec:
//   1. it matches specs/schema/component-spec.schema.json
//   2. every token path exists in tokens/lab.tokens.json (tokens and contrastChecks)
//   3. it is internally consistent (enum defaults, variants and sizes vs props)
//   4. it matches the code: variants and sizes vs RECIPES in lib/lab/playground.ts,
//      prop defaults vs components/lab/demo-components.tsx
// Exits with code 1 and a list of problems if anything is off.

import fs from "node:fs"
import path from "node:path"
import AjvModule from "ajv"
import { flattenTokens } from "../lib/lab/token-outputs.ts"
import { RECIPES } from "../lib/lab/playground.ts"

const Ajv = AjvModule.default ?? AjvModule
const SPECS_DIR = "specs"
const schema = JSON.parse(fs.readFileSync(path.join(SPECS_DIR, "schema/component-spec.schema.json"), "utf8"))
const validateSchema = new Ajv({ allErrors: true, allowUnionTypes: true }).compile(schema)

const tokenPaths = flattenTokens(JSON.parse(fs.readFileSync("tokens/lab.tokens.json", "utf8"))).map((t) => t.path.join("."))
const componentsSource = fs.readFileSync("components/lab/demo-components.tsx", "utf8")

const files = fs.readdirSync(SPECS_DIR).filter((f) => f.endsWith(".spec.json")).sort()
let problems = 0

const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort())

/** Closest token path, for "did you mean" hints. */
function closest(target) {
  const distance = (a, b) => {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
    for (let j = 1; j <= b.length; j++) d[0][j] = j
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++)
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    return d[a.length][b.length]
  }
  return [...tokenPaths].sort((x, y) => distance(target, x) - distance(target, y))[0]
}

/** Default values written in a component's parameter list, e.g. `variant = "primary"`. */
function codeDefaults(name) {
  const start = componentsSource.search(new RegExp(`export (const|function) ${name}\\b`))
  if (start === -1) return null
  const params = componentsSource.slice(start).match(/\(\{([^}]*)\}/)
  return Object.fromEntries([...(params?.[1] ?? "").matchAll(/(\w+) = "([^"]*)"/g)].map((m) => [m[1], m[2]]))
}

function check(file) {
  const errors = []
  const spec = JSON.parse(fs.readFileSync(path.join(SPECS_DIR, file), "utf8"))

  // 1. Schema
  if (!validateSchema(spec)) {
    for (const e of validateSchema.errors ?? []) errors.push(`schema: ${e.instancePath || "(root)"} ${e.message}`)
    return errors // the checks below assume a valid shape
  }

  // 2. Token paths
  spec.tokens.forEach((t, i) => {
    if (!tokenPaths.includes(t.path))
      errors.push(`tokens[${i}].path "${t.path}" is not in tokens/lab.tokens.json (did you mean "${closest(t.path)}"?)`)
  })

  spec.accessibility.contrastChecks.forEach((c, i) => {
    for (const side of ["foreground", "background"])
      if (!tokenPaths.includes(c[side]))
        errors.push(`accessibility.contrastChecks[${i}].${side} "${c[side]}" is not in tokens/lab.tokens.json (did you mean "${closest(c[side])}"?)`)
  })

  // 3. Internal consistency
  const expectedFile = `${spec.name.toLowerCase()}.spec.json`
  if (file !== expectedFile) errors.push(`name "${spec.name}" should live in ${expectedFile}`)
  const propNames = spec.props.map((p) => p.name)
  propNames.forEach((n, i) => propNames.indexOf(n) !== i && errors.push(`prop "${n}" is listed twice`))
  for (const p of spec.props) {
    if (p.type === "enum" && !p.values) errors.push(`prop "${p.name}" is an enum but has no values`)
    if (p.type !== "enum" && p.values) errors.push(`prop "${p.name}" has values but its type is "${p.type}"`)
    if (p.type === "enum" && p.default !== null && !p.values?.includes(p.default))
      errors.push(`prop "${p.name}" default "${p.default}" is not one of ${JSON.stringify(p.values)}`)
    if (p.required && p.default !== null) errors.push(`prop "${p.name}" is required, so it cannot have a default`)
  }
  const variantProp = spec.props.find((p) => p.name === "variant")
  if (variantProp && !same(variantProp.values ?? [], spec.variants)) errors.push(`variants ${JSON.stringify(spec.variants)} differ from the variant prop's values`)
  const sizeProp = spec.props.find((p) => p.name === "size")
  if (sizeProp && !same(sizeProp.values ?? [], spec.sizes)) errors.push(`sizes ${JSON.stringify(spec.sizes)} differ from the size prop's values`)
  const stateNames = spec.states.map((s) => s.name)
  stateNames.forEach((n, i) => stateNames.indexOf(n) !== i && errors.push(`state "${n}" is listed twice`))

  // 4. The code
  const recipe = RECIPES[spec.name.toLowerCase()]
  if (!recipe) {
    errors.push(`no recipe named "${spec.name.toLowerCase()}" in lib/lab/playground.ts`)
  } else {
    if (!same(Object.keys(recipe.variants), spec.variants))
      errors.push(`variants ${JSON.stringify(spec.variants)} differ from RECIPES.${spec.name.toLowerCase()}.variants ${JSON.stringify(Object.keys(recipe.variants))}`)
    if (!same(Object.keys(recipe.sizes), spec.sizes))
      errors.push(`sizes ${JSON.stringify(spec.sizes)} differ from RECIPES.${spec.name.toLowerCase()}.sizes ${JSON.stringify(Object.keys(recipe.sizes))}`)
  }
  const defaults = codeDefaults(spec.name)
  if (!defaults) {
    errors.push(`no component named ${spec.name} in components/lab/demo-components.tsx`)
  } else {
    for (const [prop, value] of Object.entries(defaults)) {
      const p = spec.props.find((x) => x.name === prop)
      if (!p) errors.push(`the code sets a default for "${prop}" but the spec has no such prop`)
      else if (p.default !== value) errors.push(`prop "${prop}" default is "${value}" in the code but ${JSON.stringify(p.default)} in the spec`)
    }
  }
  return errors
}

for (const file of files) {
  const errors = check(file)
  problems += errors.length
  console.log(`${errors.length ? "✗" : "✓"} specs/${file}`)
  for (const e of errors) console.log(`    - ${e}`)
}

if (!files.length) {
  console.error("No specs found in specs/*.spec.json")
  process.exit(1)
}
if (problems) {
  console.error(`\n${problems} problem(s) found. Fix the spec or the code so they describe the same component.`)
  process.exit(1)
}
console.log(`\nAll ${files.length} specs are valid, use existing tokens and match the code.`)
