// @flow

import {createGraph, addNode, getNodeId, addEdge} from './graph'

import type {Graph} from './graph'

export async function readWebpackStats(
  stats: Object,
  options?: {
    enableAllAsyncImports?: boolean,
    includeChunks?: boolean,
    includeAssets?: boolean,
  } = {},
): Promise<Graph> {
  const graph = createGraph()
  const {enableAllAsyncImports = false, includeChunks = false, includeAssets = true} = options

  const {chunks = [], assets = [], modules = []} = stats

  // create chunks
  if (includeChunks) {
    for (const chunk of chunks) {
      addNode(graph, {
        id: getNodeId('chunk', chunk.id),
        originalId: chunk.id,
        kind: chunk.reason && chunk.reason.indexOf('split chunk') ? 'split-chunk' : 'chunk',
        name: chunk.names[0],
        size: 0,
        original: chunk,
      })
      await graph.idle()
    }
  }

  // create chunks
  if (includeAssets) {
    for (const asset of assets) {
      addNode(graph, {
        id: getNodeId('asset', asset.name),
        originalId: asset.name,
        kind: 'asset',
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
    const isConcat = module.name.indexOf(' + ') > 0
    const isNamespace = module.name.indexOf(' namespace object') > 0
    const kind = isConcat ? 'concat' : isNamespace ? 'namespace' : 'module'
    addNode(graph, {
      id: getNodeId('module', module.identifier),
      originalId: module.id,
      kind,
      name: module.name,
      file: isConcat ? undefined : (module.name || '').replace(/^.*!/),
      size: module.size,
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
    if (includeChunks) {
      for (const chunkId of module.chunks) {
        addEdge(graph, {
          from: getNodeId('chunk', chunkId),
          to: getNodeId('module', module.identifier),
          kind: 'chunk child',
          original: module,
        })
      }
    }
    if (includeAssets) {
      for (const assetId of module.assets) {
        addEdge(graph, {
          from: getNodeId('module', module.identifier),
          to: getNodeId('asset', assetId),
          kind: 'asset child',
          original: module,
        })
      }
    }
    for (const reason of module.reasons) {
      const type = reason.type || ''
      if (reason.moduleId == null) {
        // reason has been removed at optimization phase (concatenated, tree-shaken, etc)
        continue
      }
      const async = type.indexOf('import()') >= 0 && type.indexOf('eager') < 0
      addEdge(graph, {
        from: getNodeId('module', reason.moduleIdentifier),
        to: getNodeId('module', module.identifier),
        kind: type,
        name: reason.userRequest,
        async,
        enabled: !async || enableAllAsyncImports ? true : false,
        original: reason,
      })
    }
    await graph.idle()
  }
  return graph
}
