// Style Dictionary platforms for the AI Lab tokens, shared by
// build-tokens.mjs and check-tokens.mjs. Formats, groups and transforms are
// the built-in ones in Style Dictionary 5.7. Its Swift and Compose size
// transforms read values as rem (x16), so source dimensions are in rem.
//
// Every token says whether it is shared or platform-local in
// $extensions["dev.santirequelme"].scope. A platform-local token's $value is
// the web value; its "ios" and "android" entries replace it on those
// platforms, through the two transforms registered below.

import StyleDictionary from "style-dictionary"

export const NS = "dev.santirequelme"

for (const platform of ["ios", "android"]) {
  StyleDictionary.registerTransform({
    name: `value/platform/${platform}`,
    type: "value",
    filter: (token) => token.$extensions?.[NS]?.scope === "platform" && platform in token.$extensions[NS],
    transform: (token) => token.$extensions[NS][platform],
  })
}

const buildPath = "tokens/generated/"

export const platforms = {
  css: {
    transformGroup: "css",
    prefix: "ds",
    buildPath,
    files: [{ destination: "tokens.css", format: "css/variables" }],
  },
  swift: {
    // The ios-swift group, with SwiftUI's Color instead of UIColor.
    transforms: [
      "value/platform/ios",
      "attribute/cti",
      "name/camel",
      "color/ColorSwiftUI",
      "content/swift/literal",
      "asset/swift/literal",
      "size/swift/remToCGFloat",
    ],
    buildPath,
    files: [{ destination: "Tokens.swift", format: "ios-swift/enum.swift", options: { className: "Tokens", import: ["SwiftUI"] } }],
  },
  kotlin: {
    // The compose group, after the Android values.
    transforms: ["value/platform/android", ...StyleDictionary.hooks.transformGroups.compose],
    buildPath,
    files: [{ destination: "Tokens.kt", format: "compose/object", options: { className: "Tokens", packageName: "dev.santirequelme.tokens" } }],
  },
}
