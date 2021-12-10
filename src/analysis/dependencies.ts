import { difference } from "lodash";
import type { Graph, Node, NodeID } from "./graph";
import { getNode } from "./graph";

async function walkGraph(
  graph: Graph,
  node: Node,
  options: {
    visited: {
      [k in NodeID]: Node;
    };
    nodesKey: string;
  }
) {
  const { nodesKey, visited } = options;
  visited[node.id] = node;

  for (const childId of node[nodesKey]) {
    if (visited[childId]) continue;
    await walkGraph(graph, getNode(graph, childId), options);
    await graph.idle();
  }
}

export function getDeepNodeChildren(
  graph: Graph,
  node: Node
): Promise<ReadonlyArray<NodeID>> {
  const key = `getDeepNodeChildren:${node.id}`;
  if (!graph.cache[key]) {
    const visited = {};
    graph.cache[key] = walkGraph(graph, node, {
      visited,
      nodesKey: "children",
    }).then(() => {
      // $FlowFixMe
      delete visited[node.id];
      return Object.keys(visited);
    });
  }
  return graph.cache[key];
}

export function getDeepNodeParents(
  graph: Graph,
  node: Node
): Promise<ReadonlyArray<NodeID>> {
  const key = `getDeepNodeParents:${node.id}`;
  if (!graph.cache[key]) {
    const visited = {};
    graph.cache[key] = walkGraph(graph, node, {
      visited,
      nodesKey: "parents",
    }).then(() => {
      // $FlowFixMe
      delete visited[node.id];
      return Object.keys(visited);
    });
  }
  return graph.cache[key];
}

// Returns all children nodes, whose edge is disabled. It doesn't go into the disabled
// nodes, so it's useful to find first nodes where dependency chain was broken apart.
export function getDisabledLeafChildren(
  graph: Graph,
  node: Node
): Promise<ReadonlyArray<NodeID>> {
  const key = `getDisabledLeafChildren:${node.id}`;
  if (!graph.cache[key]) {
    const visited = {};

    // Get all accessible children
    graph.cache[key] = walkGraph(graph, node, {
      visited,
      nodesKey: "children",
    }).then(() => {
      const children: Node[] = Object.values(visited) as any;
      const found = {};
      // Gather all children. If they were not visited in the first pass,
      // then they HAVE to be disabled
      for (const child of children) {
        for (const deepChildId of child.allChildren) {
          if (!visited[deepChildId]) {
            found[deepChildId] = true;
          }
        }
      }
      return Object.keys(found);
    });
  }
  return graph.cache[key];
}

// Returns all nodes introduced to the dependency tree of rootNode by adding the node to it.
// In another word - how many modules are retained in the dependency tree because of the `node`
// Does not include the node itself
export function getRetainedNodes(
  graph: Graph,
  rootNode: Node,
  node: Node
): Promise<ReadonlyArray<NodeID>> {
  const key = `getRetainedNodes:${rootNode.id}:${node.id}`;
  if (!graph.cache[key]) {
    const visited = {
      [node.id]: node,
    };
    const allChildrenPromise = getDeepNodeChildren(graph, rootNode);
    const rootsChildrenPromise = walkGraph(graph, rootNode, {
      visited,
      nodesKey: "children",
    }).then(() => {
      return Object.keys(visited);
    });
    graph.cache[key] = Promise.all([
      allChildrenPromise,
      rootsChildrenPromise,
    ]).then(([allChildren, rootsChildren]) => {
      // If they're not connected - there's no retention
      if (allChildren.indexOf(node.id) < 0) {
        return [];
      }
      // All children in the tree except the ones connected to the root
      const ids = difference(allChildren, rootsChildren);
      ids.push(node.id);
      return ids;
    });
  }
  return graph.cache[key];
}

export function keepOnlyEntryModules(graph: Graph, nodes: ReadonlyArray<Node>) {
  return nodes.filter((node: Node) => {
    if (node.kind !== "module") return false;
    return node.parents.every(
      (parentId) => getNode(graph, parentId).kind !== "module"
    );
  });
}

export function keepOnlyLeafModules(graph: Graph, nodes: ReadonlyArray<Node>) {
  return nodes.filter((node: Node) => {
    if (node.kind !== "module") return false;
    return node.children.length === 0;
  });
}
