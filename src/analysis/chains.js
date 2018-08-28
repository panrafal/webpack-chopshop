// @flow

import type {Graph, Node, NodeID} from './graph'
import {getNode} from './graph'

export type EdgeChain = NodeID[]

async function gatherChains(
  graph: Graph,
  node: Node,
  toId: NodeID,
  path: NodeID[],
  options: {visited: {[NodeID]: Node}, nodesKey: string},
) {
  const {nodesKey, visited} = options

  const currentPath = [...path, node.id]
  if (node.id === toId) return [currentPath]

  visited[node.id] = node
  const paths = []

  // prefer shortest paths first
  if (node[nodesKey].indexOf(toId) >= 0) {
    paths.push([...currentPath, toId])
  }

  for (const childId of node[nodesKey]) {
    if (visited[childId]) continue
    if (childId === toId) continue
    const result = await gatherChains(graph, getNode(graph, childId), toId, currentPath, options)
    if (result.length > 0) {
      paths.push(...result)
    }
    await graph.idle()
  }
  return paths
}

export async function findChains(graph: Graph, fromNode: Node, toNode: Node): Promise<EdgeChain[]> {
  const key = `findChains:${fromNode.id}:${toNode.id}`
  if (!graph.cache[key]) {
    graph.cache[key] = gatherChains(graph, fromNode, toNode.id, [], {
      visited: {},
      nodesKey: 'children',
    })
  }
  return graph.cache[key]
}

export async function findAllChains(
  graph: Graph,
  fromNode: Node,
  toNode: Node,
): Promise<EdgeChain[]> {
  const key = `findAllChains:${fromNode.id}:${toNode.id}`
  if (!graph.cache[key]) {
    graph.cache[key] = gatherChains(graph, fromNode, toNode.id, [], {
      visited: {},
      nodesKey: 'allChildren',
    })
  }
  return graph.cache[key]
}
