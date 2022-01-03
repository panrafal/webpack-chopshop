import { Graph, GraphNode } from "./graph"
import { getNodeGroup } from "./groups"

function getScore(text: string, search: string, negated: boolean) {
  if (!text) return 0
  let score = 0
  if (text.includes(search)) score += 1
  if (text.includes("/" + search)) score += 1
  if (text.includes("/" + search + "/")) score += 1
  if (text.endsWith(search)) score += 1
  if (negated) score = score > 0 ? 0 : 1
  if (score > 0) {
    score += 1 - Math.min(1, text.length / 1000)
  }
  return score
}

function createMatcher(search: string) {
  search = search.toLocaleLowerCase()
  const negated = search[0] === "!"
  if (negated) search = search.slice(1)
  if (search[0] === "#") {
    search = search.slice(1)
    return (node: GraphNode) => {
      const text = getNodeGroup(node).name.toLocaleLowerCase()
      return getScore(text, search, negated)
    }
  }
  return (node: GraphNode) => {
    const text = (node.file || node.name || node.id).toLocaleLowerCase()
    return getScore(text, search, negated)
  }
}

export function searchItems<T>(
  graph: Graph,
  items: ReadonlyArray<T>,
  search: string,
  getNodeFromItem: (graph: Graph, item: T) => GraphNode
): ReadonlyArray<T> {
  if (!search) return []
  const matchers = search.split(" ").map(createMatcher)
  return items
    .map((item) => {
      const node = getNodeFromItem(graph, item)
      let score = 0
      for (const matcher of matchers) {
        const matched = matcher(node)
        if (!matched) return null
        score += matched
      }
      return score > 0
        ? { item, score, priority: getNodeGroup(node).priority }
        : null
    })
    .filter(Boolean)
    .sort(
      (a, b) =>
        Math.round(b.score) - Math.round(a.score) ||
        b.priority - a.priority ||
        b.score - a.score
    )
    .map(({ item }) => item)
}
