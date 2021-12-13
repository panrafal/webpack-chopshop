import { difference } from "lodash"
import type {
  Graph,
  GraphEdge,
  GraphEdgeID,
  GraphNode,
  GraphNodeID,
} from "./graph"
import { getNode } from "./graph"

async function collectNodes(
  graph: Graph,
  node: GraphNode,
  options: {
    visited: {
      [k in GraphNodeID]: GraphNode
    }
    direction: "children" | "parents"
    filter?: (e: GraphEdge) => boolean
  }
) {
  const { direction, visited, filter } = options
  visited[node.id] = node

  for (const edge of node[direction]) {
    if (visited[edge.to.id]) continue
    if (filter && !filter(edge)) continue
    await collectNodes(
      graph,
      direction === "children" ? edge.to : edge.from,
      options
    )
    await graph.idle()
  }
}

async function collectEdges(
  graph: Graph,
  node: GraphNode,
  options: {
    visited: {
      [k in GraphEdgeID]: GraphEdge
    }
    direction: "children" | "parents"
    filter: (e: GraphEdge) => boolean
  }
) {
  const { direction, visited, filter } = options

  for (const edge of node[direction]) {
    if (visited[edge.to.id]) continue
    if (filter && !filter(edge)) continue
    await collectEdges(
      graph,
      direction === "children" ? edge.to : edge.from,
      options
    )
    await graph.idle()
  }
}

export function getDeepNodeChildren(
  graph: Graph,
  node: GraphNode
): Promise<ReadonlyArray<GraphNodeID>> {
  const key = `getDeepNodeChildren:${node.id}`
  if (!graph.cache[key]) {
    const visited = {}
    graph.cache[key] = collectNodes(graph, node, {
      visited,
      direction: "children",
    }).then(() => {
      delete visited[node.id]
      return Object.keys(visited)
    })
  }
  return graph.cache[key]
}

export function getDeepNodeParents(
  graph: Graph,
  node: GraphNode
): Promise<ReadonlyArray<GraphNodeID>> {
  const key = `getDeepNodeParents:${node.id}`
  if (!graph.cache[key]) {
    const visited = {}
    graph.cache[key] = collectNodes(graph, node, {
      visited,
      direction: "parents",
    }).then(() => {
      delete visited[node.id]
      return Object.keys(visited)
    })
  }
  return graph.cache[key]
}

// Returns all nodes introduced to the dependency tree of rootNode by adding the node to it.
// In another word - how many modules are retained in the dependency tree because of the `node`
// Does not include the node itself
export function getRetainedNodes(
  graph: Graph,
  rootNode: GraphNode,
  node: GraphNode
): Promise<ReadonlyArray<GraphNodeID>> {
  const key = `getRetainedNodes:${rootNode.id}:${node.id}`
  if (!graph.cache[key]) {
    const visited = {
      [node.id]: node,
    }
    const allChildrenPromise = getDeepNodeChildren(graph, rootNode)
    const rootsChildrenPromise = collectNodes(graph, rootNode, {
      visited,
      direction: "children",
    }).then(() => {
      return Object.keys(visited)
    })
    graph.cache[key] = Promise.all([
      allChildrenPromise,
      rootsChildrenPromise,
    ]).then(([allChildren, rootsChildren]) => {
      // If they're not connected - there's no retention
      if (allChildren.indexOf(node.id) < 0) {
        return []
      }
      // All children in the tree except the ones connected to the root
      const ids = difference(allChildren, rootsChildren)
      ids.push(node.id)
      return ids
    })
  }
  return graph.cache[key]
}

export function keepOnlyEntryModules(
  graph: Graph,
  nodes: ReadonlyArray<GraphNode>
) {
  return nodes.filter((node: GraphNode) => {
    if (node.kind !== "module") return false
    return node.parents.every((edge) => edge.from.kind !== "module")
  })
}

export function keepOnlyLeafModules(
  graph: Graph,
  nodes: ReadonlyArray<GraphNode>
) {
  return nodes.filter((node: GraphNode) => {
    if (node.kind !== "module") return false
    return node.children.length === 0
  })
}

export function isEdgeEnabled(edge: GraphEdge) {
  return edge.enabled
}
