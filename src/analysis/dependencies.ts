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
    if (visited[edge.to.id]) continue
    let included = filter ? filter(edge) : true
    if (!included) continue
    if (included === LAST_ITEM_IN_BRANCH) {
      visited[node.id] = node
      continue
    }
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
      direction === "children" ? edge.to : edge.from,
      options
    )
    await graph.idle()
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
// Does not include the node itself
export function getRetainedNodes(
  graph: Graph,
  rootNode: GraphNode,
  node: GraphNode,
  filter?: (e: GraphEdge) => boolean
): Promise<ReadonlyArray<GraphNodeID>> {
  const key = `getRetainedNodes:${rootNode.id}:${node.id}:${getFilterKey(
    filter
  )}`
  if (!graph.cache[key]) {
    // Gather all children of the rootNode
    const allChildrenPromise = getDeepNodeChildren(graph, rootNode, filter)
    // Mark `node` as visited and gather children again - children of `node` will be ignored
    // The difference between these two will be our answear
    const visited = {
      [node.id]: node,
    }
    const rootsChildrenPromise = collectNodes(graph, rootNode, {
      visited,
      direction: "children",
      filter,
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

export function getAsyncEdges(
  graph: Graph,
  node: GraphNode,
  filter?: (e: GraphEdge) => boolean | typeof LAST_ITEM_IN_BRANCH,
  {
    direction = "children",
  }: {
    direction?: "children" | "parents"
  } = {}
): Promise<ReadonlyArray<GraphEdge>> {
  const key = `getAsyncEdges:${node.id}:${direction}:${getFilterKey(filter)}`
  if (!graph.cache[key]) {
    const visited: Record<GraphEdgeID, GraphEdge> = {}
    graph.cache[key] = collectEdges(graph, node, {
      visited,
      direction,
      filter,
    }).then(() => {
      return Object.values(visited).filter((e) => e.async)
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
