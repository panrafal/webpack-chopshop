import {
  createGraph,
  addNode,
  getNodeId,
  addEdge,
  ROOT_NODE_ID,
  getNode,
} from "./graph"

import type { Graph } from "./graph"

export async function readWebpackStats(
  stats: any,
  options: {
    enableAllAsyncImports?: boolean
    includeChunks?: boolean
    includeAssets?: boolean
  } = {}
): Promise<Graph> {
  const graph = createGraph()
  const {
    enableAllAsyncImports = false,
    includeChunks = true,
    includeAssets = true,
  } = options

  const { chunks = [], assets = [], modules = [] } = stats

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
        original: chunk,
      })
      await graph.idle()
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
        original: asset,
      })
      await graph.idle()
    }
  }

  // create modules
  for (const module of modules) {
    if (module.id == null) {
      // module has been removed at optimization phase (concatenated, tree-shaken, etc)
      continue
    }
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
      source: module.source,
      original: module,
    })
    await graph.idle()
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
          from: getNode(graph, getNodeId("chunk", chunkId)),
          to: node,
          kind: "chunk child",
          original: module,
        })
      }
    }
    if (includeAssets) {
      for (const assetId of module.assets) {
        addEdge(graph, {
          from: node,
          to: getNode(graph, getNodeId("asset", assetId)),
          kind: "asset child",
          original: module,
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
      const async =
        isEntry || (type.includes("import()") && !type.includes("eager"))
      addEdge(graph, {
        from: fromNode,
        to: node,
        kind: type,
        name: isEntry ? node.name : reason.userRequest,
        async,
        enabled: !async || enableAllAsyncImports ? true : false,
        location: reason.loc,
        original: reason,
      })
    }
    await graph.idle()
  }
  return graph
}
