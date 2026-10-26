// JSON responses for the public registry routes: read-only, CORS open, cacheable.

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8",
  // Cached at the edge for a day; the content only changes with a deploy.
  "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
}

export function json(data: unknown, status = 200) {
  return new Response(`${JSON.stringify(data, null, 2)}\n`, { status, headers: HEADERS })
}

export function preflight() {
  return new Response(null, { status: 204, headers: HEADERS })
}
