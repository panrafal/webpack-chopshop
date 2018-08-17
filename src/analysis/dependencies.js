// @flow

import type {Graph, Node, NodeID} from './graph'
import {getNode} from './graph'

async function walkGraph(
  graph: Graph,
  node: Node,
  options: {visited: {[NodeID]: boolean}, nodesKey: string},
) {
  options.visited[node.id] = true

  for (const childId of node[options.nodesKey]) {
    if (options.visited[childId]) continue
    await walkGraph(graph, getNode(graph, childId), options)
    await graph.idle()
  }
}

export function getDeepNodeChildren(graph: Graph, node: Node): Promise<$ReadOnlyArray<NodeID>> {
  const key = `getDeepNodeChildren:${node.id}`
  if (!graph.cache[key]) {
    const visited = {}
    graph.cache[key] = walkGraph(graph, node, {visited, nodesKey: 'children'}).then(() => {
      // $FlowFixMe
      delete visited[node.id]
      return Object.keys(visited)
    })
  }
  return graph.cache[key]
}

export function getDeepNodeParents(graph: Graph, node: Node): Promise<$ReadOnlyArray<NodeID>> {
  const key = `getDeepNodeParents:${node.id}`
  if (!graph.cache[key]) {
    const visited = {}
    graph.cache[key] = walkGraph(graph, node, {visited, nodesKey: 'parents'}).then(() => {
      // $FlowFixMe
      delete visited[node.id]
      return Object.keys(visited)
    })
  }
  return graph.cache[key]
}

export function keepOnlyEntryModules(graph: Graph, nodes: $ReadOnlyArray<Node>) {
  return nodes.filter((node: Node) => {
    if (node.kind !== 'module') return false
    return node.parents.every(parentId => getNode(graph, parentId).kind !== 'module')
  })
}

export function keepOnlyLeafModules(graph: Graph, nodes: $ReadOnlyArray<Node>) {
  return nodes.filter((node: Node) => {
    if (node.kind !== 'module') return false
    return node.children.length === 0
  })
}
