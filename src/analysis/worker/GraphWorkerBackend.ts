import { expose } from "comlink"
import { findAllChains, findChains } from "../chains"
import { applyChanges, Changes, revertGraph } from "../changes"
import { findNodeCycles } from "../cycles"
import {
  getAsyncEdges,
  getDeepNodeChildren,
  getDeepNodeParents,
  getEnabledChildEdges,
  getRetainedNodes,
} from "../dependencies"
import { Graph, modifyGraph } from "../graph"
import { createParallelProcessor } from "../parallel"
import {
  calculateGroupSizes,
  calculateRetainedTreeSize,
  calculateTreeSize,
} from "../size"
import { registerTransferHandlers } from "./transferHandlers"

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

  async applyChanges(changes: Changes) {
    await modifyGraph(graph, (newGraph) => {
      revertGraph(newGraph)
      applyChanges(newGraph, changes)
      newGraph.parallel = createParallelProcessor({ maxDelay: 100 })
      graph = newGraph
    })
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
