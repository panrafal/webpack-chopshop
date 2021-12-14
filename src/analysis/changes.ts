import type { Graph, GraphNodeID } from "./graph"

import { reject, pick } from "lodash"
import { toggleEdge, addEdge, resolveEdgeForNodes } from "./graph"

export type EdgeChange = {
  change: "edge"
  from: GraphNodeID
  to: GraphNodeID
  enabled: boolean
}

export type Change = EdgeChange

export const MOCKED_EDGE_KIND = "mocked"

export function addChange(
  graph: Graph,
  changes: ReadonlyArray<Change>,
  change: Change
): ReadonlyArray<Change> {
  // Remove same changes from queue
  // @ts-expect-error
  const newChanges: Array<Change> = reject(
    changes,
    pick(change, ["change", "from", "to"])
  )
  if (change.change === "edge") {
    const edge = resolveEdgeForNodes(graph, change.from, change.to)
    const wasOriginallyEnabled = edge
      ? edge.kind !== MOCKED_EDGE_KIND && !edge.async
      : false
    // Add to queue only if it's a different state than originally
    if (change.enabled !== wasOriginallyEnabled) {
      newChanges.push(change)
    }
  }
  return newChanges
}

export function revertGraph(graph: Graph) {
  for (const revert of graph.revert.reverse()) {
    revert()
  }
  graph.revert.splice(0)
}

export function applyChanges(graph: Graph, changes: ReadonlyArray<Change>) {
  for (const change of changes) {
    if (change.change === "edge") {
      const fromNode = graph.nodes[change.from]
      const toNode = graph.nodes[change.to]
      if (!fromNode || !toNode) {
        graph.errors.push({
          message: `One of the nodes is missing, cannot apply the change`,
          change,
        })
        continue
      }

      let edge = resolveEdgeForNodes(graph, change.from, change.to)
      if (!edge) {
        console.warn(`Edge ${change.from} -> ${change.to} doesnt exist`)
      }
      const prevEnabled = edge.enabled
      graph.revert.push(() => {
        toggleEdge(graph, edge, prevEnabled)
      })
      toggleEdge(graph, edge, change.enabled)
    }
  }
}
