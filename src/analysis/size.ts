// @flow

import type {Graph, Node, NodeID} from './graph'
import {getNode} from './graph'
import {getDeepNodeChildren, getRetainedNodes} from './dependencies'

export type EdgePath = NodeID[]

export function calculateTreeSize(graph: Graph, node: Node): Promise<number> {
  const key = `calculateTreeSize:${node.id}`

  if (!graph.cache[key]) {
    graph.cache[key] = getDeepNodeChildren(graph, node).then(tree =>
      tree.reduce((sum, id) => sum + getNode(graph, id).size, node.size),
    )
  }
  return graph.cache[key]
}

export function calculateRetainedTreeSize(
  graph: Graph,
  rootNode: Node,
  node: Node,
): Promise<number> {
  const key = `calculateRetainedTreeSize:${rootNode.id}:${node.id}`

  if (!graph.cache[key]) {
    graph.cache[key] = getRetainedNodes(graph, rootNode, node).then(tree =>
      tree.reduce((sum, id) => sum + getNode(graph, id).size, 0),
    )
  }
  return graph.cache[key]
}
