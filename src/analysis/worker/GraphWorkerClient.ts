import { Remote, wrap } from "comlink"
import { omit } from "lodash"
import { getFilterKey } from "../dependencies"
import { Graph } from "../graph"
import { GraphWorkerBackend, localBackend } from "./GraphWorkerBackend"
import { registerTransferHandlers } from "./transferHandlers"
import throat from "throat"
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

export class GraphWorkerClient implements GraphWorkerBackend {
  private backend: Remote<GraphWorkerBackend>
  private cache = {}
  private graph: Graph
  private throttled = throat(1)
  constructor() {
    registerTransferHandlers()
    this.backend = this.createBackend()
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
      if (!this.graph) throw new Error("Graph is not set!")
      const cacheKey = getCacheKey(...args) + this.graph.version
      if (this.cache[cacheKey]) return this.cache[cacheKey]
      console.time(`rpc: ${prop}`)
      const promise = this.throttled(() => this.backend[prop](...args) as any)
      console.timeEnd(`rpc: ${prop}`)
      this.cache[cacheKey] = promise
      return promise
    }
  }

  setGraph(graph: Graph): any {
    this.graph = graph
    if (!graph) return
    console.time("graph copy")
    const promise = this.throttled(async () => {
      await this.backend.test("hello!")
      console.log("helloed")
      await this.backend.test(
        Object.values(graph.nodes).map((e) => omit(e, ["parents", "children"]))
      )
      console.log("edged")
      await this.backend.setGraph(
        // @ts-ignore
        omit(graph, ["idle", "cache", "errors", "revert"])
      )
    })
    console.timeEnd("graph copy")
    return promise
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
  test = this.implement("test")
}
