import { listComponents } from "@/lib/registry"
import { json } from "@/lib/registry/http"

// Prerendered at build time. Only GET is exported: any other method would make
// Next.js render the route on every request. A plain GET needs no preflight.
export const dynamic = "force-static"

export function GET() {
  return json({
    ...listComponents(),
    endpoints: {
      index: "/r/index.json",
      tokens: "/r/tokens.json",
      rules: "/r/rules.json",
      component: "/r/{component}.json?stack={stack}",
    },
  })
}
