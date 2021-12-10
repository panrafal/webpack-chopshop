import numeral from "numeral"

export function formatSize(size: number) {
  return numeral(size).format("0[.]0b")
}
