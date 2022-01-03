import type { Graph } from "./graph"
import { addEdge, addNode, createGraph, getNode, getNodeId } from "./graph"
import { getSourceLocation } from "./info"
import { OpenProgressFn, ParseOptions } from "./open"
import { SourceWorkerClient } from "./worker/SourceWorkerClient"

export async function readWebpackStats(
  stats: any,
  { minifySources = false }: ParseOptions,
  reportProgress: OpenProgressFn
): Promise<Graph> {
  const debug = false
  const graph = createGraph()

  const includeChunks = true
  const includeAssets = false

  const { chunks = [], assets = [], modules = [] } = stats
  const moduleMap = new Map()
  let index

  // create chunks
  if (includeChunks) {
    index = 0
    for (const chunk of chunks) {
      if (++index % 1000 === 0)
        reportProgress("creating chunks", 0.3 + (index / chunks.length) * 0.1)
      addNode(graph, {
        id: getNodeId("chunk", chunk.id),
        originalId: chunk.id,
        kind:
          chunk.reason && chunk.reason.indexOf("split chunk")
            ? "split-chunk"
            : "chunk",
        name: chunk.names[0],
        size: 0,
        ...(debug
          ? {
              original: chunk,
            }
          : null),
      })
      // await graph.parallel.yield()
    }
  }

  // create assets
  if (includeAssets) {
    index = 0
    for (const asset of assets) {
      if (++index % 1000 === 0)
        reportProgress("creating assets", 0.4 + (index / assets.length) * 0.1)
      addNode(graph, {
        id: getNodeId("asset", asset.name),
        originalId: asset.name,
        kind: "asset",
        name: asset.name,
        size: asset.size,
        ...(debug
          ? {
              original: asset,
            }
          : null),
      })
      // await graph.parallel.yield()
    }
  }

  index = 0
  // create modules
  for (const module of modules) {
    if (++index % 1000 === 0)
      reportProgress("creating modules", 0.5 + (index / modules.length) * 0.1)
    if (module.id == null) {
      // module has been removed at optimization phase (concatenated, tree-shaken, etc)
      continue
    }
    moduleMap.set(module.identifier, module)
    const isConcat = module.name.indexOf(" + ") > 0
    const isNamespace = module.name.indexOf(" namespace object") > 0
    const kind = isConcat ? "concat" : isNamespace ? "namespace" : "module"
    addNode(graph, {
      id: getNodeId("module", module.identifier),
      originalId: module.id,
      kind,
      name: module.name,
      file: (module.name || "").replace(/^.*!| \+ .+$/, ""),
      size: module.size,
      exports: Array.isArray(module.providedExports)
        ? module.providedExports
        : undefined,
      usedExports: Array.isArray(module.usedExports)
        ? module.usedExports
        : undefined,
      ...(debug
        ? {
            source: module.source,
            original: module,
          }
        : null),
    })
    // await graph.parallel.yield()
  }

  index = 0
  // create edges
  for (const module of modules) {
    if (++index % 1000 === 0)
      reportProgress("creating edges", 0.6 + (index / modules.length) * 0.1)
    if (module.id == null) {
      // module has been removed at optimization phase (concatenated, tree-shaken, etc)
      continue
    }
    const node = getNode(graph, getNodeId("module", module.identifier))
    if (includeChunks) {
      for (const chunkId of module.chunks) {
        addEdge(graph, {
          fromId: getNodeId("chunk", chunkId),
          toId: node.id,
          kind: "chunk child",
          ...(debug
            ? {
                original: module,
              }
            : null),
        })
      }
    }
    if (includeAssets) {
      for (const assetId of module.assets) {
        addEdge(graph, {
          fromId: node.id,
          toId: getNodeId("asset", assetId),
          kind: "asset child",
          ...(debug
            ? {
                original: module,
              }
            : null),
        })
      }
    }
    for (const reason of module.reasons) {
      const type = reason.type || ""
      const isEntry = type.includes("entry")
      if (reason.moduleId == null && !isEntry) {
        // reason has been removed at optimization phase (concatenated, tree-shaken, etc)
        continue
      }
      const fromNode = isEntry
        ? graph.root
        : getNode(graph, getNodeId("module", reason.moduleIdentifier))
      if (fromNode === node) {
        // we ignore self reference (eg. cjs self exports reference)
        continue
      }
      const fromModule =
        reason.moduleIdentifier && moduleMap.get(reason.moduleIdentifier)
      const async =
        isEntry || (type.includes("import()") && !type.includes("eager"))
      addEdge(graph, {
        fromId: fromNode.id,
        toId: node.id,
        kind: type,
        name: isEntry ? node.name : reason.userRequest,
        async,
        enabled: !async,
        fromLoc: reason.loc,
        fromSource: getSourceLocation(fromModule?.source, reason.loc),
        ...(debug
          ? {
              original: reason,
            }
          : null),
      })
    }
    // await graph.parallel.yield()
  }

  // minify
  if (minifySources) {
    const sourceWorker = new SourceWorkerClient()
    let minifiedModules = 0
    const promises = []
    for (const module of modules) {
      const node = graph.nodes[getNodeId("module", module.identifier)]
      const source = module.source
      if (!node || !source) {
        ++minifiedModules
        continue
      }
      promises.push(
        sourceWorker
          .getMinifiedSize(source, minifySources === "gzip")
          // eslint-disable-next-line no-loop-func
          .then((size) => {
            node.size = size
            if (++minifiedModules % 100 === 0) {
              reportProgress(
                "minifying sources",
                0.7 + (minifiedModules / modules.length) * 0.2
              )
            }
          })
      )
    }
    await Promise.allSettled(promises)
    sourceWorker.release()
  }
  return graph
}
