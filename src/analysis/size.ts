import type { Graph, GraphEdge, GraphNode, GraphNodeID } from "./graph"
import { getNode } from "./graph"
import {
  getDeepNodeChildren,
  getFilterKey,
  getRetainedNodes,
} from "./dependencies"
import { groupBy, sortBy } from "lodash"
import { getNodeGroup, GroupInfo } from "./groups"

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

export type GroupSizeInfo = {
  group: GroupInfo
  size: number
  count: number
}
export function calculateGroupSizes(
  graph: Graph,
  rootNode: GraphNode | undefined,
  node: GraphNode,
  { filter }: { filter?: (e: GraphEdge) => boolean } = {}
): Promise<GroupSizeInfo[]> {
  const key = `calculateGroupSizes:${node.id}:${getFilterKey(filter)}`

  if (!graph.cache[key]) {
    const promise =
      !rootNode || rootNode === node
        ? getDeepNodeChildren(graph, node, { filter })
        : getRetainedNodes(graph, rootNode, node, { filter })
    graph.cache[key] = promise.then((tree) => {
      const infos = new Map<GroupInfo, GroupSizeInfo>()
      ;[node.id, ...tree].forEach((id) => {
        const node = getNode(graph, id)
        const group = getNodeGroup(node)
        let info = infos.get(group)
        if (!info) {
          info = { group, count: 0, size: 0 }
          infos.set(group, info)
        }
        info.count += 1
        info.size += node.size
      })
      return Array.from(infos.values()).sort(
        (a, b) => b.group.priority - a.group.priority
      )
    })
  }
  return graph.cache[key]
}
