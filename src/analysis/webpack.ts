import type { Graph } from "./graph"
import { addEdge, addNode, createGraph, getNode, getNodeId } from "./graph"
import { getSourceLocation } from "./info"
import { ParseOptions } from "./open"

export async function readWebpackStats(
  stats: any,
  options: ParseOptions
): Promise<Graph> {
  const debug = false
  const graph = createGraph()
  const { reportProgress } = options

  const includeChunks = true
  const includeAssets = true

  const { chunks = [], assets = [], modules = [] } = stats
  const moduleMap = new Map()

  // create chunks
  if (includeChunks) {
    for (const chunk of chunks) {
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
      await graph.parallel.yield()
    }
  }

  // create assets
  if (includeAssets) {
    for (const asset of assets) {
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
      await graph.parallel.yield()
    }
  }

  // create modules
  for (const module of modules) {
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
    await graph.parallel.yield()
  }

  // create edges
  for (const module of modules) {
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
    await graph.parallel.yield()
  }
  return graph
}
