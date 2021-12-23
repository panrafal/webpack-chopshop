import { Graph, GraphEdge, GraphNode } from "../graph"
import {
  calculateRetainedTreeSize,
  calculateTreeSize,
  calculateGroupSizes,
} from "../size"
import { findAllChains, findChains } from "../chains"
import { findNodeCycles } from "../cycles"
import {
  getAsyncEdges,
  getDeepNodeChildren,
  getEnabledChildEdges,
  getRetainedNodes,
  getDeepNodeParents,
} from "../dependencies"
import { expose } from "comlink"
import { registerTransferHandlers } from "./transferHandlers"
import { createParallelProcessor } from "../parallel"

let graph: Graph

function bindGraph<Args extends Array<any>, Ret>(
  fn: (graph: Graph, ...args: Args) => Ret
): (...args: Args) => Ret {
  return (...args) => {
    if (!graph) throw new Error("Graph is not set on worker!")
    return fn(graph, ...args)
  }
}

const backend = {
  async setGraph(
    newGraph: Omit<Graph, "cache" | "errors" | "revert" | "parallel">
  ) {
    if (graph) {
      graph.parallel.abort(`Worker Abort v${graph.version}`)
    }
    registerTransferHandlers()
    console.log("[worker] setting graph")
    graph = {
      ...newGraph,
      cache: {},
      errors: [],
      revert: [],
      parallel: createParallelProcessor({ maxDelay: 100 }),
    }
  },

  calculateGroupSizes: bindGraph(calculateGroupSizes),
  calculateRetainedTreeSize: bindGraph(calculateRetainedTreeSize),
  calculateTreeSize: bindGraph(calculateTreeSize),
  findChains: bindGraph(findChains),
  findAllChains: bindGraph(findAllChains),
  findNodeCycles: bindGraph(findNodeCycles),
  getAsyncEdges: bindGraph(getAsyncEdges),
  getDeepNodeChildren: bindGraph(getDeepNodeChildren),
  getEnabledChildEdges: bindGraph(getEnabledChildEdges),
  getRetainedNodes: bindGraph(getRetainedNodes),
  getDeepNodeParents: bindGraph(getDeepNodeParents),
}

export type GraphWorkerBackend = typeof backend

export { backend as localBackend }

expose(backend)
