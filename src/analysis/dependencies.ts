import { difference } from "lodash"
import type {
  Graph,
  GraphEdge,
  GraphEdgeID,
  GraphNode,
  GraphNodeID,
} from "./graph"
import { getNode } from "./graph"

const filterKeys = new WeakMap()
let filterKeysCounter = 0
export function getFilterKey(f?: Function | null | undefined): string {
  if (!f) return ""
  if (!filterKeys.has(f)) {
    filterKeys.set(f, `${f.name}${++filterKeysCounter}`)
  }
  return filterKeys.get(f)
}

export const LAST_ITEM_IN_BRANCH = "last" as const

async function collectNodes(
  graph: Graph,
  node: GraphNode,
  options: {
    visited: {
      [k in GraphNodeID]: GraphNode
    }
    direction: "children" | "parents"
    filter?: (e: GraphEdge) => boolean | typeof LAST_ITEM_IN_BRANCH
  }
) {
  const { direction, visited, filter } = options
  visited[node.id] = node

  for (const edge of node[direction]) {
    if (visited[edge.toId]) continue
    let included = filter ? filter(edge) : true
    if (!included) continue
    if (included === LAST_ITEM_IN_BRANCH) {
      visited[node.id] = node
      continue
    }
    await collectNodes(
      graph,
      direction === "children"
        ? getNode(graph, edge.toId)
        : getNode(graph, edge.fromId),
      options
    )
    await graph.parallel.yield()
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
    filter?: (e: GraphEdge) => boolean | typeof LAST_ITEM_IN_BRANCH
  }
) {
  const { direction, visited, filter } = options

  for (const edge of node[direction]) {
    if (visited[edge.id]) continue
    let included = filter ? filter(edge) : true
    if (!included) continue
    visited[edge.id] = edge
    if (included === LAST_ITEM_IN_BRANCH) {
      continue
    }
    await collectEdges(
      graph,
      direction === "children"
        ? getNode(graph, edge.toId)
        : getNode(graph, edge.fromId),
      options
    )
    await graph.parallel.yield()
  }
}

export function getDeepNodeChildren(
  graph: Graph,
  node: GraphNode,
  filter?: (e: GraphEdge) => boolean
): Promise<ReadonlyArray<GraphNodeID>> {
  const key = `getDeepNodeChildren:${node.id}:${getFilterKey(filter)}`
  if (!graph.cache[key]) {
    const visited = {}
    graph.cache[key] = collectNodes(graph, node, {
      visited,
      direction: "children",
      filter,
    }).then(() => {
      delete visited[node.id]
      return Object.keys(visited)
    })
  }
  return graph.cache[key]
}

export function getDeepNodeParents(
  graph: Graph,
  node: GraphNode,
  filter?: (e: GraphEdge) => boolean
): Promise<ReadonlyArray<GraphNodeID>> {
  const key = `getDeepNodeParents:${node.id}:${getFilterKey(filter)}`
  if (!graph.cache[key]) {
    const visited = {}
    graph.cache[key] = collectNodes(graph, node, {
      visited,
      direction: "parents",
      filter,
    }).then(() => {
      delete visited[node.id]
      return Object.keys(visited)
    })
  }
  return graph.cache[key]
}

// Returns all nodes introduced to the dependency tree of rootNode by adding the node to it.
// In another word - how many modules are retained in the dependency tree because of the `node`
// Does include the node itself
export function getNodesRetainedByNode(
  graph: Graph,
  rootNode: GraphNode,
  node: GraphNode,
  filter?: (e: GraphEdge) => boolean
): Promise<ReadonlyArray<GraphNodeID>> {
  const key = `getNodesRetainedByNode:${rootNode.id}:${node.id}:${getFilterKey(
    filter
  )}`
  if (!graph.cache[key]) {
    // Gather all children of the rootNode
    const allChildrenPromise = getDeepNodeChildren(graph, rootNode, filter)

    // Mark `node` as visited and gather children again - children of `node` will be ignored
    // The difference between these two will show which nodes were included by the introduction of `node` to the tree
    const visited = {
      [node.id]: node,
    }
    const filteredChildrenPromise = collectNodes(graph, rootNode, {
      visited,
      direction: "children",
      filter,
    }).then(() => {
      return Object.keys(visited)
    })
    graph.cache[key] = Promise.all([
      allChildrenPromise,
      filteredChildrenPromise,
    ]).then(([allChildren, filteredChildren]) => {
      // If they're not connected - there's no retention
      if (allChildren.indexOf(node.id) < 0) {
        return []
      }
      // Keep only children that were introduced by having the `node` in the tree
      const ids = difference(allChildren, filteredChildren)
      // + the node itself
      if (allChildren.includes(node.id)) ids.push(node.id)
      return ids
    })
  }
  return graph.cache[key]
}

// Returns all nodes introduced to the dependency tree of rootNode by adding the edge to it.
// In another word - how many modules are retained in the dependency tree because of the `edge`
// Includes the node itself
export function getNodesRetainedByEdge(
  graph: Graph,
  rootNode: GraphNode,
  edge: GraphEdge,
  filter?: (e: GraphEdge) => boolean
): Promise<ReadonlyArray<GraphNodeID>> {
  const key = `getNodesRetainedByEdge:${rootNode.id}:${edge.id}:${getFilterKey(
    filter
  )}`
  if (!edge.enabled) return Promise.resolve([])
  if (!graph.cache[key]) {
    // Gather all children of the rootNode
    const allChildrenPromise = getDeepNodeChildren(graph, rootNode, filter)

    // Gather children again, but with `edge` disabled
    // The difference between these two will show which nodes were included by the introduction of `node` to the tree
    const visited = {}
    const filteredChildrenPromise = collectNodes(graph, rootNode, {
      visited,
      direction: "children",
      filter: (e) => e.id !== edge.id && (!filter || filter(e)),
    }).then(() => {
      return Object.keys(visited)
    })
    graph.cache[key] = Promise.all([
      allChildrenPromise,
      filteredChildrenPromise,
    ]).then(([allChildren, filteredChildren]) => {
      // Keep only children that were introduced by having the `node` in the tree
      const ids = difference(allChildren, filteredChildren)
      return ids
    })
  }
  return graph.cache[key]
}

export function getEnabledChildEdges(
  graph: Graph,
  node: GraphNode
): Promise<ReadonlyArray<GraphEdgeID>> {
  const key = `getEnabledChildEdges:${node.id}`
  if (!graph.cache[key]) {
    const visited = {}
    graph.cache[key] = collectEdges(graph, node, {
      visited,
      direction: "children",
      filter: isEdgeEnabled,
    }).then(() => {
      return Object.keys(visited)
    })
  }
  return graph.cache[key]
}

export function getEnabledParentEdges(
  graph: Graph,
  node: GraphNode,
  filter?: (e: GraphEdge) => boolean
): Promise<ReadonlyArray<GraphEdgeID>> {
  const key = `getEnabledParentEdges:${node.id}:${getFilterKey(filter)}`
  if (!graph.cache[key]) {
    const visited = {}
    graph.cache[key] = collectEdges(graph, graph.root, {
      visited,
      direction: "children",
      filter,
    }).then(() => {
      return node.parents
        .filter((edge) => edge.enabled && edge.id in visited)
        .map((edge) => edge.id)
    })
  }
  return graph.cache[key]
}

export function getAsyncEdges(
  graph: Graph,
  node: GraphNode,
  filter?: (e: GraphEdge) => boolean | typeof LAST_ITEM_IN_BRANCH,
  {
    direction = "children",
  }: {
    direction?: "children" | "parents"
  } = {}
): Promise<ReadonlyArray<GraphEdgeID>> {
  const key = `getAsyncEdges:${node.id}:${direction}:${getFilterKey(filter)}`
  if (!graph.cache[key]) {
    const visited: Record<GraphEdgeID, GraphEdge> = {}
    graph.cache[key] = collectEdges(graph, node, {
      visited,
      direction,
      filter,
    }).then(() => {
      return Object.values(visited)
        .filter((e) => e.async)
        .map((e) => e.id)
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
    return node.parents.every(
      (edge) => getNode(graph, edge.fromId).kind !== "module"
    )
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
