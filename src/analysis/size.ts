import type { Graph, GraphEdge, GraphNode, GraphNodeID } from "./graph"
import { getNode } from "./graph"
import {
  getDeepNodeChildren,
  getFilterKey,
  getRetainedNodes,
} from "./dependencies"

export type EdgePath = GraphNodeID[]

export function calculateTreeSize(
  graph: Graph,
  node: GraphNode,
  { filter }: { filter?: (e: GraphEdge) => boolean } = {}
): Promise<number> {
  const key = `calculateTreeSize:${node.id}:${getFilterKey(filter)}`

  if (!graph.cache[key]) {
    graph.cache[key] = getDeepNodeChildren(graph, node, { filter }).then(
      (tree) =>
        tree.reduce((sum, id) => sum + getNode(graph, id).size, node.size)
    )
  }
  return graph.cache[key]
}

export function calculateRetainedTreeSize(
  graph: Graph,
  rootNode: GraphNode,
  node: GraphNode,
  { filter }: { filter?: (e: GraphEdge) => boolean } = {}
): Promise<number> {
  const key = `calculateRetainedTreeSize:${rootNode.id}:${
    node.id
  }:${getFilterKey(filter)}`

  if (!graph.cache[key]) {
    graph.cache[key] = getRetainedNodes(graph, rootNode, node, { filter }).then(
      (tree) => tree.reduce((sum, id) => sum + getNode(graph, id).size, 0)
    )
  }
  return graph.cache[key]
}
