import { getRules } from "@/lib/registry"
import { readAgentsGuide } from "@/lib/registry/guide"
import { json } from "@/lib/registry/http"

// Built once at deploy time, so AGENTS.md is read during the build.
export const dynamic = "force-static"

export function GET() {
  return json(getRules(readAgentsGuide()))
}
