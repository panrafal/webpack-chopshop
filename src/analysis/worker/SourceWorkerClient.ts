import { Remote, wrap } from "comlink"
import { get } from "idb-keyval"
import md5 from "md5"
import throat from "throat"
import { SourceWorkerBackend } from "./SourceWorkerBackend"

export class SourceWorkerClient {
  private maxWorkers = 4
  private throttled = throat(this.maxWorkers * 4)
  private workers: Worker[]
  private backends: Remote<SourceWorkerBackend>[]
  private roundRobinIndex = 0

  private getBackend(index: number) {
    const workerIndex = index % this.maxWorkers
    if (!this.backends[workerIndex]) {
      this.workers[workerIndex] = new Worker(
        new URL("./SourceWorkerBackend", import.meta.url)
      )
      this.backends[workerIndex] = wrap<SourceWorkerBackend>(
        this.workers[workerIndex]
      )
    }
    return this.backends[workerIndex]
  }

  release() {
    this.workers.forEach((worker) => worker && worker.terminate())
  }

  async getMinifiedSize(source: string, gzip: boolean = true): Promise<number> {
    // check cache
    const hash = md5(source)
    const key = `minifiedSize:v0:${hash}`
    let sizes = await get(key)
    if (!sizes) {
      sizes = await this.throttled(() =>
        this.getBackend(this.roundRobinIndex++).getMinifiedSizes(source)
      )
      //await set(key, sizes)
    }
    return gzip ? sizes.gzip : sizes.min
  }
}
