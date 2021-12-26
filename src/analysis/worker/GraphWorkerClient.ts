import { Remote, wrap } from "comlink"
import throat from "throat"
import { Changes } from "../changes"
import { getFilterKey } from "../dependencies"
import { Graph } from "../graph"
import { AbortSignal } from "../parallel"
import { GraphWorkerBackend } from "./GraphWorkerBackend"
import { registerTransferHandlers } from "./transferHandlers"
// import { GraphWorkerBackend } from "./GraphWorkerBackend"

function getCacheKey(...args: any[]): string {
  let key = ""
  for (const arg of args) {
    if (typeof arg === "function") {
      key += getFilterKey(arg)
    } else if (typeof arg === "object" && arg && "id" in arg) {
      key += arg.id
    } else {
      key += JSON.stringify(arg)
    }
  }
  return key
}

function timeout(ms: number) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new AbortSignal("Timeout")), ms)
  )
}

export class GraphWorkerClient
  implements Omit<GraphWorkerBackend, "applyChanges">
{
  private backend: Remote<GraphWorkerBackend>
  private cache = {}
  private graph: Graph
  private throttled = throat(1)
  constructor() {
    registerTransferHandlers()
    this.backend = this.createBackend()
  }

  get currentGraph(): Graph | null {
    return this.graph
  }

  private createBackend() {
    const worker = new Worker(new URL("./GraphWorkerBackend", import.meta.url))
    const backend = wrap<GraphWorkerBackend>(worker)
    return backend
  }

  private implement<Prop extends keyof GraphWorkerBackend>(
    prop: Prop
  ): GraphWorkerBackend[Prop] {
    return (...args: any) => {
      const graph = this.graph
      if (!graph) throw new Error("Graph is not set!")
      const cacheKey = `${graph.version}:${prop}:${getCacheKey(...args)}`
      if (this.cache[cacheKey]) return this.cache[cacheKey]
      const queueStart = performance.now()
      const promise = this.throttled(async () => {
        // don't make a call when aborted
        if (graph.parallel.aborted) {
          console.warn("ABORTING", prop)
          throw graph.parallel.aborted
        }
        const workStart = performance.now()
        let error
        try {
          return await Promise.race([
            graph.parallel.abortSignal,
            timeout(15000),
            this.backend[prop](...args),
          ])
        } finally {
          console.log(
            `[RPC] ${prop}: work: ${Math.round(
              performance.now() - workStart
            )}ms queue: ${Math.round(performance.now() - queueStart)}ms`
          )
        }
      })

      this.cache[cacheKey] = promise
      return promise
    }
  }

  setGraph(graph: Graph): any {
    this.graph = graph
    this.cache = {}
    console.time("graph copy")
    const promise = this.backend.setGraph({
      version: graph.version,
      root: graph.root,
      nodes: graph.nodes,
      edges: graph.edges,
    })
    console.timeEnd("graph copy")
    return promise
  }

  async setGraphAndApplyChanges(graph: Graph, changes: Changes) {
    this.graph = graph
    this.cache = {}
    return this.backend.applyChanges(changes)
  }

  calculateGroupSizes = this.implement("calculateGroupSizes")
  calculateRetainedTreeSize = this.implement("calculateRetainedTreeSize")
  calculateTreeSize = this.implement("calculateTreeSize")
  findChains = this.implement("findChains")
  findAllChains = this.implement("findAllChains")
  findNodeCycles = this.implement("findNodeCycles")
  getAsyncEdges = this.implement("getAsyncEdges")
  getDeepNodeChildren = this.implement("getDeepNodeChildren")
  getEnabledChildEdges = this.implement("getEnabledChildEdges")
  getRetainedNodes = this.implement("getRetainedNodes")
  getDeepNodeParents = this.implement("getDeepNodeParents")
}
