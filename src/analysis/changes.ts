import {
  getEdge,
  Graph,
  GraphEdge,
  GraphEdgeID,
  GraphNodeID,
  resolveEdge,
} from "./graph"

import { reject, pick, omit, omitBy } from "lodash"
import { toggleEdge, addEdge, resolveEdgeForNodes } from "./graph"
import { nullFormat } from "numeral"

export type Changes = {
  edgeToggles?: Record<GraphEdgeID, boolean>
}

export const MOCKED_EDGE_KIND = "mocked"

export function hasChanges(changes: Changes): boolean {
  return (
    (changes.edgeToggles && Object.values(changes.edgeToggles).length > 0) ||
    false
  )
}

export function countVisibleChanges(changes: Changes): number {
  return changes.edgeToggles
    ? Object.values(changes.edgeToggles).reduce(
        (sum, enabled) => sum + (enabled ? 0 : 1),
        0
      )
    : 0
}

export function addEdgeToggleChange(
  graph: Graph,
  changes: Changes,
  edge: GraphEdge,
  enabled: boolean
): Changes {
  const wasOriginallyEnabled = edge
    ? edge.kind !== MOCKED_EDGE_KIND && !edge.async
    : false
  // Add to queue only if it's a different state than originally
  if (enabled !== wasOriginallyEnabled) {
    return {
      ...changes,
      edgeToggles: { ...changes.edgeToggles, [edge.id]: enabled },
    }
  }
  if (changes.edgeToggles && changes.edgeToggles[edge.id] != null) {
    return { ...changes, edgeToggles: omit(changes.edgeToggles, [edge.id]) }
  }
  return changes
}

export function resetEdgeToggles(changes: Changes, async: boolean): Changes {
  return {
    // async edges are enabled, sync edges are disabled - so we can just remove either one or the other
    edgeToggles: omitBy(
      changes.edgeToggles || {},
      (enabled) => enabled === async
    ),
  }
}

export function revertGraph(graph: Graph) {
  for (const revert of graph.revert.reverse()) {
    revert()
  }
  graph.revert.splice(0)
}

export function applyChanges(graph: Graph, changes: Changes) {
  for (const [edgeId, enabled] of Object.entries(changes.edgeToggles || {})) {
    const edge = resolveEdge(graph, edgeId)
    if (!edge) {
      graph.errors.push({
        message: `Edge ${edgeId} doesnt exist`,
      })
      continue
    }
    const prevEnabled = edge.enabled
    graph.revert.push(() => {
      toggleEdge(graph, edge, prevEnabled)
    })
    toggleEdge(graph, edge, enabled)
  }
}
