// Line-level diff (longest common subsequence). Small inputs only — the
// comparison snippets are a few dozen lines, so O(n·m) is fine.

export type DiffLine = { type: "same" | "add" | "del"; text: string; oldNo?: number; newNo?: number }

export function diffLines(before: string, after: string): DiffLine[] {
  const a = before.split("\n")
  const b = after.split("\n")
  const lcs: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1])
    }
  }
  const out: DiffLine[] = []
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      out.push({ type: "same", text: a[i], oldNo: i + 1, newNo: j + 1 })
      i++
      j++
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      out.push({ type: "del", text: a[i], oldNo: i + 1 })
      i++
    } else {
      out.push({ type: "add", text: b[j], newNo: j + 1 })
      j++
    }
  }
  while (i < a.length) out.push({ type: "del", text: a[i], oldNo: ++i })
  while (j < b.length) out.push({ type: "add", text: b[j], newNo: ++j })
  return out
}
