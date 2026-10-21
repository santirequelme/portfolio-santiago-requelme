// Minimal, dependency-free syntax highlighter for the snippets shown in the
// lab (TSX / TS / HTML / CSS). It is deliberately small: a single pass with an
// ordered list of patterns, good enough for code we generate ourselves.

export type TokenType =
  | "comment"
  | "string"
  | "keyword"
  | "tag"
  | "attr"
  | "number"
  | "type"
  | "fn"
  | "punct"
  | "plain"

export interface Token {
  type: TokenType
  text: string
}

const KEYWORDS = new Set([
  "import", "from", "export", "const", "let", "var", "function", "return", "type", "interface",
  "extends", "as", "default", "if", "else", "new", "class", "get", "readonly", "true", "false",
  "null", "undefined", "typeof", "keyof", "satisfies", "async", "await", "for", "of", "in",
])

// Order matters: the first pattern that matches at the cursor wins.
const RULES: { type: TokenType; re: RegExp }[] = [
  { type: "comment", re: /\/\/[^\n]*|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->|\{\/\*[\s\S]*?\*\/\}/y },
  { type: "string", re: /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/y },
  { type: "tag", re: /<\/?[A-Za-z][\w.-]*|\/?>/y },
  { type: "attr", re: /@?[A-Za-z_\[\(][\w\-:.\]\)]*(?==)/y },
  { type: "keyword", re: /@[A-Za-z]+/y },
  { type: "number", re: /-?\b\d+(?:\.\d+)?(?:px|rem|%|ms|s)?\b/y },
  { type: "plain", re: /[A-Za-z_$][\w$]*/y },
  { type: "punct", re: /[{}()[\];,.:=?!&|+\-*/<>]+/y },
  { type: "plain", re: /\s+|./y },
]

export function tokenize(code: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  // After a closing ">" we are in JSX text ("Save changes"), which must not be
  // coloured as identifiers. Anything that opens an expression ends it.
  let jsxText = false
  while (i < code.length) {
    let matched = false
    for (const rule of RULES) {
      rule.re.lastIndex = i
      const m = rule.re.exec(code)
      if (!m || m[0].length === 0) continue
      let type = rule.type
      const text = m[0]
      if (type === "plain" && /^[A-Za-z_$]/.test(text) && !jsxText) {
        if (KEYWORDS.has(text) && code[i + text.length] !== "-") type = "keyword"
        else if (/^[A-Z]/.test(text)) type = "type"
        else if (code[i + text.length] === "(") type = "fn"
      }
      if (type === "tag") jsxText = text.endsWith(">")
      else if (type === "punct" || type === "comment" || type === "string") jsxText = false
      const last = tokens[tokens.length - 1]
      if (last && last.type === type && type === "plain") last.text += text
      else tokens.push({ type, text })
      i += text.length
      matched = true
      break
    }
    if (!matched) {
      tokens.push({ type: "plain", text: code[i] })
      i++
    }
  }
  return tokens
}

/** Split tokens into lines so the code view can number and mark them. */
export function tokenizeLines(code: string): Token[][] {
  const lines: Token[][] = [[]]
  for (const token of tokenize(code)) {
    const parts = token.text.split("\n")
    parts.forEach((part, idx) => {
      if (idx > 0) lines.push([])
      if (part) lines[lines.length - 1].push({ type: token.type, text: part })
    })
  }
  return lines
}
