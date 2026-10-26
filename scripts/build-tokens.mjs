// Builds tokens/lab.tokens.json (DTCG format) into CSS variables, SwiftUI and
// Jetpack Compose files in tokens/generated/. Run with `pnpm tokens:build`.

import StyleDictionary from "style-dictionary"
import { platforms } from "./tokens.config.mjs"

const sd = new StyleDictionary({ source: ["tokens/lab.tokens.json"], usesDtcg: true, platforms })
await sd.buildAllPlatforms()
