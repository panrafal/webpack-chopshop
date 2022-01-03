import {
  getDeepNodeChildren,
  getFilterKey,
  getNodesRetainedByEdge,
  getNodesRetainedByNode,
} from "./dependencies"
import type { Graph, GraphEdge, GraphNode, GraphNodeID } from "./graph"
import { getNode } from "./graph"
import { getNodeGroup, GroupInfo } from "./groups"

export type EdgePath = GraphNodeID[]

export function calculateTreeSize(
  graph: Graph,
  node: GraphNode,
  filter?: (e: GraphEdge) => boolean
): Promise<number> {
  const key = `calculateTreeSize:${node.id}:${getFilterKey(filter)}`

  if (!graph.cache[key]) {
    graph.cache[key] = getDeepNodeChildren(graph, node, filter).then((tree) =>
      tree.reduce((sum, id) => sum + getNode(graph, id).size, node.size)
    )
  }
  return graph.cache[key]
}

export function calculateTreeSizeRetainedByNode(
  graph: Graph,
  rootNode: GraphNode,
  node: GraphNode,
  filter?: (e: GraphEdge) => boolean
): Promise<number | null> {
  const key = `calculateTreeSizeRetainedByNode:${rootNode.id}:${
    node.id
  }:${getFilterKey(filter)}`

  if (!graph.cache[key]) {
    graph.cache[key] = getNodesRetainedByNode(
      graph,
      rootNode,
      node,
      filter
    ).then((tree) =>
      tree.length > 0
        ? tree.reduce((sum, id) => sum + getNode(graph, id).size, 0)
        : null
    )
  }
  return graph.cache[key]
}

export function calculateTreeSizeRetainedByEdge(
  graph: Graph,
  rootNode: GraphNode,
  edge: GraphEdge,
  filter?: (e: GraphEdge) => boolean
): Promise<number> {
  const key = `calculateTreeSizeRetainedByEdge:${rootNode.id}:${
    edge.id
  }:${getFilterKey(filter)}`

  if (!graph.cache[key]) {
    graph.cache[key] = getNodesRetainedByEdge(
      graph,
      rootNode,
      edge,
      filter
    ).then((tree) => tree.reduce((sum, id) => sum + getNode(graph, id).size, 0))
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
  filter?: (e: GraphEdge) => boolean
): Promise<GroupSizeInfo[]> {
  const key = `calculateGroupSizes:${rootNode?.id}:${node.id}:${getFilterKey(
    filter
  )}`

  if (!graph.cache[key]) {
    const promise =
      !rootNode || rootNode === node
        ? getDeepNodeChildren(graph, node, filter)
        : getNodesRetainedByNode(graph, rootNode, node, filter)
    graph.cache[key] = promise.then((tree) => {
      const infos = new Map<GroupInfo, GroupSizeInfo>()
      if (!tree.includes(node.id)) tree = [node.id, ...tree]
      tree.forEach((id) => {
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
