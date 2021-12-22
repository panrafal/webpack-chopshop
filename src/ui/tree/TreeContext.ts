import { createContext, useContext } from "react"
import { EdgeChain } from "../../analysis/chains"
import {
  Graph,
  GraphEdge,
  GraphEdgeID,
  GraphElementID,
  GraphNode,
  GraphNodeID,
} from "../../analysis/graph"
import { GraphWorkerClient } from "../../analysis/worker/GraphWorkerClient"
import { UpdateChangesFn } from "../../logic/useGraphState"
import { TogglePinnedFn } from "../../logic/usePinnedState"
import { PromiseTrackerFn } from "../hooks/usePromiseTracker"

export type TreeContextType = {
  graph: Graph
  graphWorker: GraphWorkerClient
  pinned: ReadonlyArray<GraphNodeID>
  togglePinned: TogglePinnedFn
  enabledIds: ReadonlyArray<GraphElementID>
  openedNodeIds: ReadonlyArray<GraphNodeID>
  setOpenedNodeIds: (nodes: Array<GraphNodeID>) => void
  activeNodeId: GraphNodeID | null
  setActiveNodeId: (n: GraphNodeID | null) => void
  activeEdgeId: GraphEdgeID | null
  openNode(n: GraphNode)
  trackLoading: PromiseTrackerFn
  updateChanges: UpdateChangesFn
  chains: EdgeChain[]
  chainedNodeIds: GraphNodeID[]
  getChildEdges: (
    node: GraphNode
  ) => ReadonlyArray<GraphEdge> | Promise<ReadonlyArray<GraphEdge>>
}

const TreeContext = createContext<TreeContextType>(null)

export function useTreeContext() {
  return useContext(TreeContext)
}

export const TreeContextProvider = TreeContext.Provider
