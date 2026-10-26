// Tests for the public registry routes under /r, called as plain functions.

import assert from "node:assert/strict"
import { describe, it } from "node:test"
import * as component from "@/app/r/[component]/route"
import * as index from "@/app/r/index.json/route"
import * as rules from "@/app/r/rules.json/route"
import * as tokens from "@/app/r/tokens.json/route"

const call = (name: string, query = "") =>
  component.GET(new Request(`https://example.test/r/${name}${query}`), { params: Promise.resolve({ component: name }) })

describe("/r routes", () => {
  it("serve JSON with open CORS and cache headers", async () => {
    for (const res of [index.GET(), tokens.GET(), rules.GET(), await call("card.json", "?stack=vue")]) {
      assert.equal(res.status, 200)
      assert.equal(res.headers.get("access-control-allow-origin"), "*")
      assert.match(res.headers.get("content-type") ?? "", /application\/json/)
      assert.match(res.headers.get("cache-control") ?? "", /s-maxage/)
      assert.ok(await res.json())
    }
  })

  it("index, tokens and rules stay static: force-static and GET only", () => {
    for (const route of [index, tokens, rules]) {
      assert.equal(route.dynamic, "force-static")
      assert.deepEqual(Object.keys(route).filter((key) => key === key.toUpperCase()), ["GET"])
    }
  })

  it("the component route answers CORS preflight requests", () => {
    const res = component.OPTIONS()
    assert.equal(res.status, 204)
    assert.match(res.headers.get("access-control-allow-methods") ?? "", /GET/)
  })

  it("/r/index.json lists the components and endpoints", async () => {
    const body = (await index.GET().json()) as { components: { id: string }[]; endpoints: Record<string, string> }
    assert.deepEqual(body.components.map((c) => c.id), ["button", "card", "input"])
    assert.equal(body.endpoints.component, "/r/{component}.json?stack={stack}")
  })

  it("/r/card.json?stack=angular returns the Angular code", async () => {
    const body = (await (await call("card.json", "?stack=angular")).json()) as { code: { files: { name: string }[] } }
    assert.ok(body.code.files.some((f) => f.name === "card.component.ts"))
  })

  it("unknown stack: 400 with the valid stacks", async () => {
    const res = await call("button.json", "?stack=flutter")
    assert.equal(res.status, 400)
    const body = (await res.json()) as { error: { code: string; valid: string[] } }
    assert.equal(body.error.code, "unknown_stack")
    assert.deepEqual(body.error.valid, ["react", "angular", "vue", "swift", "kotlin"])
  })

  it("unknown component: 404 with the valid components", async () => {
    const res = await call("modal.json")
    assert.equal(res.status, 404)
    const body = (await res.json()) as { error: { code: string; received: string; valid: string[] } }
    assert.equal(body.error.code, "unknown_component")
    assert.equal(body.error.received, "modal")
    assert.deepEqual(body.error.valid, ["button", "card", "input"])
  })

  it("URLs without .json are not found", async () => {
    assert.equal((await call("button")).status, 404)
  })
})
