import { EdgeChain } from "./chains"
import {
  AbortSignal,
  ParallelProcessor,
  createParallelProcessor,
} from "./parallel"

export const ROOT_NODE_ID = "root"
export type GraphNodeID = string
export type GraphEdgeID = string
export type GraphElementID = string
export type NodeKind = string
export type EdgeKind = string

export type GraphEdgeSpec = {
  name?: string
  fromId: GraphNodeID
  toId: GraphNodeID
  kind: EdgeKind
  async?: boolean
  // IDs related to an async edge being loaded - eg. ID or asset of an async chunk
  asyncIds?: string[]
  enabled?: boolean
  fromSource?: string
  // Location in source code
  fromLoc?: string
  // Original source object
  original?: any
}

export type GraphEdge = GraphEdgeSpec & {
  id: GraphEdgeID
  enabled: boolean
}

export type GraphNodeSpec = {
  id: GraphNodeID
  originalId: string
  name?: string
  kind: NodeKind
  size: number
  file?: string
  exports?: string[]
  usedExports?: string[]
  source?: string
  // Original source object
  original?: any
}

export type GraphNode = GraphNodeSpec & {
  parents: Array<GraphEdge>
  children: Array<GraphEdge>
  treeSize?: number
}

export type GraphElement = GraphNode | GraphEdge

export type Graph = {
  version: number
  root: GraphNode
  nodes: {
    [k in GraphNodeID]: GraphNode
  }
  edges: {
    [k in GraphEdgeID]: GraphEdge
  }
  errors: Array<any>
  cache: any
  parallel: ParallelProcessor
  revert: Array<() => void>
}

function createNode(_node: GraphNodeSpec): GraphNode {
  return { parents: [], children: [], ..._node }
}

export function createGraph(): Graph {
  const root = createNode({
    id: ROOT_NODE_ID,
    originalId: ROOT_NODE_ID,
    kind: "compilation",
    size: 0,
  })
  const graph = {
    version: 1,
    root,
    nodes: { [ROOT_NODE_ID]: root },
    edges: {},
    errors: [],
    cache: {},
    parallel: createParallelProcessor(),
    revert: [],
  }
  return graph
}

export function getNodeId(kind: string, id: string): GraphNodeID {
  return `${kind}:${id}`
}
export function getEdgeId(from: GraphNodeID, to: GraphNodeID): GraphEdgeID {
  return `${from}->${to}`
}

export function getNode(graph: Graph, id: GraphNodeID): GraphNode {
  const node = graph.nodes[id]
  if (!node) throw new Error(`Node ${id} not found`)
  return node
}

export function resolveNode(
  graph: Graph,
  id?: GraphNodeID | null
): GraphNode | undefined | null {
  if (!id) return null
  return graph.nodes[id] || null
}

export function getEdge(graph: Graph, id: GraphEdgeID): GraphEdge {
  const edge = graph.edges[id]
  if (!edge) throw new Error(`Edge ${id} not found`)
  return edge
}

export function resolveEdge(
  graph: Graph,
  id?: GraphEdgeID | null
): GraphEdge | undefined | null {
  if (!id) return null
  return graph.edges[id] || null
}

export function resolveEdgeForNodes(
  graph: Graph,
  from?: GraphNodeID | null,
  to?: GraphNodeID | null
): GraphEdge | undefined | null {
  if (!from || !to) return null
  return graph.edges[getEdgeId(from, to)]
}

export function getNodes(
  graph: Graph,
  ids: ReadonlyArray<GraphNodeID>
): ReadonlyArray<GraphNode> {
  return ids.map(getNode.bind(null, graph))
}

export function getAllNodes(graph: Graph): ReadonlyArray<GraphNode> {
  return Object.values(graph.nodes) as any
}

export function getEdges(
  graph: Graph,
  ids: ReadonlyArray<GraphEdgeID>
): ReadonlyArray<GraphEdge> {
  return ids.map(getEdge.bind(null, graph))
}

export function getEdgesFromChain(
  graph: Graph,
  chain: EdgeChain
): ReadonlyArray<GraphEdge> {
  if (chain.length < 2) return []
  const result = []
  for (let i = 1; i < chain.length; ++i) {
    result.push(getEdge(graph, getEdgeId(chain[i - 1], chain[i])))
  }
  return result
}

export function addNode(graph: Graph, _node: GraphNodeSpec): GraphNode {
  const node = createNode(_node)
  if (graph.nodes[node.id]) throw new Error(`Node ${node.id} already in graph`)
  graph.nodes[node.id] = node
  return node
}

export function addEdge(graph: Graph, _edge: GraphEdgeSpec): GraphEdge {
  const id = getEdgeId(_edge.fromId, _edge.toId)
  const edge = { enabled: true, id, ..._edge }
  if (graph.edges[id]) {
    return graph.edges[id]
  }
  graph.edges[id] = edge
  graph.nodes[edge.fromId].children.push(edge)
  graph.nodes[edge.toId].parents.push(edge)
  return edge
}

export function toggleEdge(graph: Graph, edge: GraphEdge, enabled: boolean) {
  if (edge.enabled === enabled) return
  edge.enabled = enabled
}

export async function modifyGraph(
  graph: Graph,
  fn: (graph: Graph) => void | Promise<void>
): Promise<Graph> {
  const newGraph = {
    ...graph,
    version: graph.version + 1,
    cache: {},
    parallel: createParallelProcessor(),
  }
  await fn(newGraph)
  // Abort the old graph computations only once the new one is set-up
  // This allows the UI to switch to the new version before receiving abort messages
  // workers should not modify the graph itself, they only interact with the graph's cache
  // which is bound to the old `graph` object. So keeping them around should be safe.
  await graph.parallel.abort(new AbortSignal(`Abort v${graph.version}`))
  return newGraph
}
