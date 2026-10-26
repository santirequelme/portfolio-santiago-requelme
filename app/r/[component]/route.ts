import { getComponent } from "@/lib/registry"
import { json, preflight } from "@/lib/registry/http"

// /r/button.json, optionally ?stack=angular. Unknown names get a structured
// error listing the valid options.
export async function GET(request: Request, { params }: { params: Promise<{ component: string }> }) {
  const { component } = await params
  if (!component.endsWith(".json")) {
    return json({ error: { code: "not_found", message: "Component URLs end in .json, e.g. /r/button.json.", received: component, valid: [] } }, 404)
  }
  const stack = new URL(request.url).searchParams.get("stack")
  const result = getComponent(component.slice(0, -".json".length), stack ?? undefined)
  if (!result.ok) return json({ error: result.error }, result.error.code === "unknown_component" ? 404 : 400)
  return json(result.data)
}

export const OPTIONS = preflight
