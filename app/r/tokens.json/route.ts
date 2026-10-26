import { getTokens } from "@/lib/registry"
import { json } from "@/lib/registry/http"

export const dynamic = "force-static"

export function GET() {
  return json(getTokens())
}
