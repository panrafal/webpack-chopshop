import { GraphEdge } from "./graph"
import { LAST_ITEM_IN_BRANCH } from "./dependencies"

export function currentGraphFilter(edge: GraphEdge) {
  return edge.enabled
}
// Checks only async edges - all the rest are considered enabled

export function baseGraphFilter(edge: GraphEdge) {
  return !edge.async || edge.enabled
}

export function stopOnAsyncModulesFilter(edge: GraphEdge) {
  return edge.async ? LAST_ITEM_IN_BRANCH : true
}

export function allAsyncAndEnabledFilter(edge: GraphEdge) {
  return edge.async || edge.enabled
}
