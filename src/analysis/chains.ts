import { getFilterKey } from "./dependencies"
import type { Graph, GraphEdge, GraphNode, GraphNodeID } from "./graph"
import { getNode } from "./graph"

export type EdgeChain = GraphNodeID[]

async function gatherChains(
  graph: Graph,
  node: GraphNode,
  toId: GraphNodeID,
  path: GraphNodeID[],
  options: {
    visited: {
      [k in GraphNodeID]: GraphNode
    }
    filter?: (e: GraphEdge) => boolean
  }
): Promise<GraphNodeID[][]> {
  const { filter, visited } = options

  const currentPath = [...path, node.id]
  if (node.id === toId) return [currentPath]

  visited[node.id] = node
  const paths = []

  // prefer shortest paths first
  if (node.children.find((e) => e.toId === toId && (!filter || filter(e)))) {
    paths.push([...currentPath, toId])
  }

  for (const edge of node.children) {
    if (visited[edge.toId]) continue
    if (edge.toId === toId) continue
    if (filter && !filter(edge)) continue
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

export async function findAllChains(
  graph: Graph,
  fromNode: GraphNode,
  toNode: GraphNode
): Promise<EdgeChain[]> {
  const key = `findAllChains:${fromNode.id}:${toNode.id}`
  if (!graph.cache[key]) {
    graph.cache[key] = gatherChains(graph, fromNode, toNode.id, [], {
      visited: {},
    })
  }
  return graph.cache[key]
}
