// @flow

import type {Graph, Node, NodeID} from './graph'
import {getNode} from './graph'

export type EdgeChain = NodeID[]

async function gatherChains(
  graph: Graph,
  node: Node,
  toId: NodeID,
  path: NodeID[],
  visited: {[NodeID]: boolean},
) {
  const currentPath = [...path, node.id]
  if (node.id === toId) return [currentPath]

  visited[node.id] = true
  const paths = []

  // prefer shortes paths first
  if (node.children.indexOf(toId) >= 0) {
    paths.push([...currentPath, toId])
  }

  for (const childId of node.children) {
    if (visited[childId]) continue
    if (childId === toId) continue
    const result = await gatherChains(graph, getNode(graph, childId), toId, currentPath, visited)
    if (result.length > 0) {
      paths.push(...result)
    }
    await graph.idle()
  }
  return paths
}

export async function findChains(graph: Graph, fromNode: Node, toNode: Node): Promise<EdgeChain[]> {
  return gatherChains(graph, fromNode, toNode.id, [], {})
}
