import { mapValues } from "lodash";
import { backgroundProcessor } from "./utils";

export type NodeID = string;
export type EdgeID = string;
export type NodeKind = string;
export type EdgeKind = string;

export type EdgeSpec = {
  name?: string;
  from: NodeID;
  to: NodeID;
  kind: EdgeKind;
  async?: boolean;
  enabled?: boolean;
  // Original source object
  original?: any;
};

export type Edge = {
  enabled: boolean;
} & EdgeSpec;

export type NodeSpec = {
  id: NodeID;
  originalId: string;
  name?: string;
  kind: NodeKind;
  size: number;
  file?: string;
  // Original source object
  original?: any;
};

export type Node = {
  parents: Array<NodeID>;
  // Enabled children of this Node
  children: Array<NodeID>;
  // All children of this Node (enabled or not)
  allChildren: Array<NodeID>;
  treeSize?: number;
} & NodeSpec;

export type Graph = {
  nodes: {
    [k in NodeID]: Node;
  };
  edges: {
    [k in EdgeID]: Edge;
  };
  errors: Array<any>;
  cache: any;
  idle: ReturnType<typeof backgroundProcessor>;
};

export function createGraph(): Graph {
  return {
    nodes: {},
    edges: {},
    errors: [],
    cache: {},
    idle: backgroundProcessor(),
  };
}

export function getNodeId(kind: string, id: string): NodeID {
  return `${kind}:${id}`;
}
export function getEdgeId(from: NodeID, to: NodeID): EdgeID {
  return `${from}->${to}`;
}

export function getNode(graph: Graph, id: NodeID): Node {
  const node = graph.nodes[id];
  if (!node) throw new Error(`Node ${id} not found`);
  return node;
}

export function resolveNode(
  graph: Graph,
  id?: NodeID | null
): Node | undefined | null {
  if (!id) return null;
  return graph.nodes[id] || null;
}

export function getEdge(graph: Graph, id: EdgeID): Edge {
  const edge = graph.edges[id];
  if (!edge) throw new Error(`Edge ${id} not found`);
  return edge;
}

export function resolveEdge(
  graph: Graph,
  id?: EdgeID | null
): Edge | undefined | null {
  if (!id) return null;
  return graph.edges[id] || null;
}

export function resolveEdgeForNodes(
  graph: Graph,
  from?: NodeID | null,
  to?: NodeID | null
): Edge | undefined | null {
  if (!from || !to) return null;
  return graph.edges[getEdgeId(from, to)];
}

export function getNodes(
  graph: Graph,
  ids: ReadonlyArray<NodeID>
): ReadonlyArray<Node> {
  return ids.map(getNode.bind(null, graph));
}

export function getAllNodes(graph: Graph): ReadonlyArray<Node> {
  return Object.values(graph.nodes) as any;
}

export function getEdges(
  graph: Graph,
  ids: ReadonlyArray<EdgeID>
): ReadonlyArray<Edge> {
  return ids.map(getEdge.bind(null, graph));
}

export function getChildren(graph: Graph, node: Node): ReadonlyArray<Edge> {
  return getEdges(
    graph,
    node.children.map((to) => getEdgeId(node.id, to))
  );
}

export function getParents(graph: Graph, node: Node): ReadonlyArray<Edge> {
  return getEdges(
    graph,
    node.parents.map((from) => getEdgeId(from, node.id))
  );
}

export function addNode(graph: Graph, _node: NodeSpec): Node {
  const node = { parents: [], children: [], allChildren: [], ..._node };
  if (graph.nodes[node.id]) throw new Error(`Node ${node.id} already in graph`);
  graph.nodes[node.id] = node;
  return node;
}

export function addEdge(graph: Graph, _edge: EdgeSpec): Edge {
  const edge = { enabled: true, ..._edge };
  const id = getEdgeId(edge.from, edge.to);
  if (graph.edges[id]) {
    // graph.errors.push({
    // message: 'Edge already in graph',
    // edge,
    // graphEdge: graph.edges[id],
    // })
    return graph.edges[id];
  }
  graph.edges[id] = edge;
  const from = getNode(graph, edge.from);
  const to = getNode(graph, edge.to);
  from.allChildren.push(edge.to);
  if (edge.enabled) {
    from.children.push(edge.to);
    to.parents.push(edge.from);
  }
  return edge;
}

export function toggleEdge(graph: Graph, edge: Edge, enabled: boolean) {
  if (edge.enabled === enabled) return;
  const from = getNode(graph, edge.from);
  const to = getNode(graph, edge.to);
  if (enabled) {
    from.children.push(edge.to);
    to.parents.push(edge.from);
  } else {
    from.children = from.children.filter((id) => id !== edge.to);
    to.parents = to.parents.filter((id) => id !== edge.from);
  }
  edge.enabled = enabled;
}

export function abortGraph(graph: Graph) {
  return graph.idle.abort();
}

export function cloneGraph(graph: Graph): Graph {
  const newGraph = {
    nodes: mapValues(graph.nodes, (node) => ({
      ...node,
      parents: [...node.parents],
      children: [...node.children],
      allChildren: [...node.allChildren],
    })),
    edges: mapValues(graph.edges, (edge) => ({ ...edge })),
    errors: [...graph.errors],
    cache: {},
    idle: backgroundProcessor(),
  };
  return newGraph;
}
