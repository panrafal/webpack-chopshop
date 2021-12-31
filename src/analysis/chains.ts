import { getFilterKey } from "./dependencies"
import type {
  Graph,
  GraphEdge,
  GraphEdgeID,
  GraphNode,
  GraphNodeID,
} from "./graph"
import { getNode } from "./graph"

export type EdgeChain = GraphNodeID[]

async function gatherChains(
  graph: Graph,
  node: GraphNode,
  toId: GraphNodeID,
  path: GraphNodeID[],
  options: {
    visited: {
      [k in GraphEdgeID]: GraphEdge
    }
    filter?: (e: GraphEdge) => boolean
  }
): Promise<GraphNodeID[][]> {
  const { filter, visited } = options

  const currentPath = [...path, node.id]
  if (node.id === toId) return [currentPath]

  const paths = []

  // prefer shortest paths first
  if (node.children.find((e) => e.toId === toId && (!filter || filter(e)))) {
    paths.push([...currentPath, toId])
  }

  for (const edge of node.children) {
    if (visited[edge.id]) continue
    if (edge.toId === toId) continue // already included above
    if (filter && !filter(edge)) continue

    visited[edge.id] = edge
    const result = await gatherChains(
      graph,
      getNode(graph, edge.toId),
      toId,
      currentPath,
      options
    )
    if (result.length > 0) {
      paths.push(...result)
    }
    await graph.parallel.yield()
  }
  return paths
}

export async function findChains(
  graph: Graph,
  fromNode: GraphNode,
  toNode: GraphNode,
  filter?: (e: GraphEdge) => boolean
): Promise<EdgeChain[]> {
  const key = `findChains:${fromNode.id}:${toNode.id}:${getFilterKey(filter)}`
  if (!graph.cache[key]) {
    graph.cache[key] = gatherChains(graph, fromNode, toNode.id, [], {
      visited: {},
      filter,
    })
  }
  return graph.cache[key]
}
