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
import { UpdateChangesFn } from "../../logic/useGraphState"
import { TogglePinnedFn } from "../../logic/usePinnedState"
import { PromiseTrackerFn } from "../hooks/usePromiseTracker"

type TreeContextType = {
  graph: Graph
  pinned: ReadonlyArray<GraphNodeID>
  togglePinned: TogglePinnedFn
  enabledIds: ReadonlyArray<GraphElementID>
  openedNodeIds: ReadonlyArray<GraphNodeID>
  setOpenedNodeIds: (nodes: Array<GraphNodeID>) => void
  activeNodeId: GraphNodeID | null
  setActiveNodeId: (n: GraphNodeID | null) => void
  selectedEdgeId: GraphEdgeID | null
  openNode(n: GraphNode)
  trackLoading: PromiseTrackerFn
  updateChanges: UpdateChangesFn
  chains: EdgeChain[]
  chainedNodeIds: GraphNodeID[]
}

const TreeContext = createContext<TreeContextType>(null)

export function useTreeContext() {
  return useContext(TreeContext)
}

export const TreeContextProvider = TreeContext.Provider