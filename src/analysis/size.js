// @flow

import type {Graph, Node, NodeID} from './graph'
import {getNode} from './graph'
import {getDeepNodeChildren} from './dependencies'

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
