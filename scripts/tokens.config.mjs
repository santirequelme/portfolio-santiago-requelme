// Style Dictionary platforms for the AI Lab tokens, shared by
// build-tokens.mjs and check-tokens.mjs. Formats, groups and transforms are
// the built-in ones in Style Dictionary 5.7. Its Swift and Compose size
// transforms read values as rem (x16), so source dimensions are in rem.

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
    transforms: ["attribute/cti", "name/camel", "color/ColorSwiftUI", "content/swift/literal", "asset/swift/literal", "size/swift/remToCGFloat"],
    buildPath,
    files: [{ destination: "Tokens.swift", format: "ios-swift/enum.swift", options: { className: "Tokens", import: ["SwiftUI"] } }],
  },
  kotlin: {
    transformGroup: "compose",
    buildPath,
    files: [{ destination: "Tokens.kt", format: "compose/object", options: { className: "Tokens", packageName: "dev.santirequelme.tokens" } }],
  },
}
