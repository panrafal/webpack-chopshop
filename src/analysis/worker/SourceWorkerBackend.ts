import { expose } from "comlink"
import { minify } from "terser"
import { deflate } from "pako"

type MinifiedSizes = {
  min: number
  gzip: number
}

const backend = {
  async getMinifiedSizes(source: string): Promise<MinifiedSizes> {
    const minSource =
      (await (
        await minify(source, { toplevel: true, sourceMap: false })
      ).code) || ""
    const gzipSource = deflate(minSource)
    return {
      min: minSource.length,
      gzip: gzipSource.length,
    }
  },
}

export type SourceWorkerBackend = typeof backend

expose(backend)

if ("hot" in module) {
  // @ts-expect-error
  module.hot.accept()
}
