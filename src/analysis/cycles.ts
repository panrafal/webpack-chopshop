import { EdgeChain } from "./chains"
import { getFilterKey } from "./dependencies"
import { getNode, Graph, GraphEdge, GraphNode, GraphNodeID } from "./graph"

async function collectNodeCycles(
  graph: Graph,
  node: GraphNode,
  options: {
    visited: {
      [k in GraphNodeID]: GraphNode
    }
    branch: GraphNodeID[]
    cycles: GraphNodeID[][]
    filter?: (e: GraphEdge) => boolean
  }
): Promise<void> {
  const { visited, filter, cycles } = options
  const branch = [...options.branch, node.id]
  visited[node.id] = node

  for (const edge of node.children) {
    const included = filter ? filter(edge) : true
    if (!included) continue

    const cycleStart = branch.indexOf(edge.toId)
    if (cycleStart >= 0) {
      cycles.push([...branch.slice(cycleStart), edge.toId])
    } else {
      if (visited[edge.toId]) continue
      await collectNodeCycles(graph, getNode(graph, edge.toId), {
        branch,
        visited,
        filter,
        cycles,
      })
    }
    await graph.parallel.yield()
  }
}

export async function findNodeCycles(
  graph: Graph,
  fromNode: GraphNode,
  filter?: (e: GraphEdge) => boolean
): Promise<EdgeChain[]> {
  const key = `findNodeCycles:${fromNode.id}:${getFilterKey(filter)}`
  if (!graph.cache[key]) {
    const cycles: GraphNodeID[][] = []
    graph.cache[key] = collectNodeCycles(graph, fromNode, {
      branch: [],
      cycles,
      visited: {},
      filter,
    }).then(() => cycles)
  }
  return graph.cache[key]
}
