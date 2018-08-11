// @flow

import {mapValues} from 'lodash'
import {backgroundProcessor} from './utils'

export type NodeID = string
export type EdgeID = string
export type NodeKind = string
export type EdgeKind = string

export type EdgeSpec = {|
  name?: string,
  from: NodeID,
  to: NodeID,
  kind: EdgeKind,
  async?: boolean,
  enabled?: boolean,
  // Original source object
  original?: any,
|}

export type Edge = {
  ...EdgeSpec,
  enabled: boolean,
}

export type NodeSpec = {|
  id: NodeID,
  name?: string,
  kind: NodeKind,
  size: number,
  file?: string,
  // Original source object
  original?: any,
|}

export type Node = {
  ...NodeSpec,
  parents: Array<NodeID>,
  children: Array<NodeID>,
}

export type Graph = {|
  nodes: {[NodeID]: Node},
  edges: {[EdgeID]: Edge},
  errors: Array<any>,
  cache: Object,
  idle: $Call<typeof backgroundProcessor>,
|}

export function createGraph(): Graph {
  return {
    nodes: {},
    edges: {},
    errors: [],
    cache: {},
    idle: backgroundProcessor(),
  }
}

export function getNodeId(kind: string, id: string): NodeID {
  return `${kind}:${id}`
}
export function getEdgeId(from: NodeID, to: NodeID): EdgeID {
  return `${from}->${to}`
}

export function getNode(graph: Graph, id: NodeID): Node {
  const node = graph.nodes[id]
  if (!node) throw new Error(`Node ${id} not found`)
  return node
}

export function resolveNode(graph: Graph, id: ?NodeID): ?Node {
  if (!id) return null
  return graph.nodes[id] || null
}

export function getEdge(graph: Graph, id: EdgeID): Edge {
  const edge = graph.edges[id]
  if (!edge) throw new Error(`Edge ${id} not found`)
  return edge
}

export function resolveEdge(graph: Graph, id: ?EdgeID): ?Edge {
  if (!id) return null
  return graph.edges[id] || null
}

export function resolveEdgeForNodes(graph: Graph, from: ?NodeID, to: ?NodeID): ?Edge {
  if (!from || !to) return null
  return graph.edges[getEdgeId(from, to)]
}

export function getNodes(graph: Graph, ids: $ReadOnlyArray<NodeID>): $ReadOnlyArray<Node> {
  return ids.map(getNode.bind(null, graph))
}

export function getEdges(graph: Graph, ids: $ReadOnlyArray<EdgeID>): $ReadOnlyArray<Edge> {
  return ids.map(getEdge.bind(null, graph))
}

export function getChildren(graph: Graph, node: Node): $ReadOnlyArray<Edge> {
  return getEdges(graph, node.children.map(to => getEdgeId(node.id, to)))
}

export function getParents(graph: Graph, node: Node): $ReadOnlyArray<Edge> {
  return getEdges(graph, node.parents.map(from => getEdgeId(from, node.id)))
}

export function addNode(graph: Graph, _node: NodeSpec): Node {
  const node = {parents: [], children: [], ..._node}
  if (graph.nodes[node.id]) throw new Error(`Node ${node.id} already in graph`)
  graph.nodes[node.id] = node
  return node
}

export function addEdge(graph: Graph, _edge: EdgeSpec): Edge {
  const edge = {enabled: true, ..._edge}
  const id = getEdgeId(edge.from, edge.to)
  if (graph.edges[id]) {
    // graph.errors.push({
    // message: 'Edge already in graph',
    // edge,
    // graphEdge: graph.edges[id],
    // })
    return graph.edges[id]
  }
  graph.edges[id] = edge
  const from = getNode(graph, edge.from)
  const to = getNode(graph, edge.to)
  if (edge.enabled) {
    from.children.push(edge.to)
    to.parents.push(edge.from)
  }
  return edge
}

export function toggleEdge(graph: Graph, edge: Edge, enabled: boolean) {
  if (edge.enabled === enabled) return
  const from = getNode(graph, edge.from)
  const to = getNode(graph, edge.to)
  if (enabled) {
    from.children.push(edge.to)
    to.parents.push(edge.from)
  } else {
    from.children = from.children.filter(id => id !== edge.to)
    to.parents = to.parents.filter(id => id !== edge.from)
  }
  edge.enabled = enabled
}

export function abortGraph(graph: Graph) {
  return graph.idle.abort()
}

export function cloneGraph(graph: Graph): Graph {
  const newGraph = {
    nodes: mapValues(graph.nodes, node => ({
      ...node,
      parents: [...node.parents],
      children: [...node.children],
    })),
    edges: mapValues(graph.edges, edge => ({...edge})),
    errors: [...graph.errors],
    cache: {},
    idle: backgroundProcessor(),
  }
  return newGraph
}
