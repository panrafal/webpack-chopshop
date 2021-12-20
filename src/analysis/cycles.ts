import { EdgeChain } from "./chains"
import { getFilterKey } from "./dependencies"
import { Graph, GraphEdge, GraphEdgeID, GraphNode, GraphNodeID } from "./graph"

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

    const cycleStart = branch.indexOf(edge.to.id)
    if (cycleStart >= 0) {
      cycles.push(branch.slice(cycleStart))
    } else {
      if (visited[edge.to.id]) continue
      await collectNodeCycles(graph, edge.to, {
        branch,
        visited,
        filter,
        cycles,
      })
    }
    await graph.idle()
  }
}

export async function findNodeCycles(
  graph: Graph,
  fromNode: GraphNode,
  { filter }: { filter?: (e: GraphEdge) => boolean } = {}
): Promise<EdgeChain[]> {
  const key = `findNodeCycles:${fromNode.id}:${getFilterKey(filter)}`
  if (!graph.cache[key]) {
    const cycles = []
    graph.cache[key] = collectNodeCycles(graph, fromNode, {
      branch: [],
      cycles,
      visited: {},
      filter,
    }).then(() => cycles)
  }
  return graph.cache[key]
}
