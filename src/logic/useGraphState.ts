import { useCallback, useEffect, useMemo, useState } from "react"
import {
  addEdgeToggleChange,
  applyChanges,
  Changes,
  hasChanges,
  revertGraph,
} from "../analysis/changes"
import { Graph, modifyGraph } from "../analysis/graph"
import { ParseOptions } from "../analysis/open"
import { GraphWorkerClient } from "../analysis/worker/GraphWorkerClient"
import { useHistoryState } from "./useHistoryState"

export type ChangesReducerFn = (changes: Changes) => Changes
export type UpdateChangesFn = (reducer: ChangesReducerFn) => void
export type GraphLoadState =
  | null
  | { message: string; progress: number }
  | Error

const appliedChanges = Symbol("appliedChanges")

function modifyLocalAndWorkerGraphs(
  graph,
  graphWorker,
  changes,
  setLocalGraph
) {
  return modifyGraph(graph, (newGraph) => {
    revertGraph(newGraph)
    applyChanges(newGraph, changes)
    newGraph[appliedChanges] = changes
    graphWorker.setGraphAndApplyChanges(newGraph, changes)
    setLocalGraph(newGraph)
  })
}

export function useGraphState({ trackLoading, onLoaded }) {
  const [graphLoadState, setGraphLoadState] = useState<GraphLoadState>(null)
  const [graph, setLocalGraph] = useState<Graph | undefined | null>()
  const graphWorker = useMemo(() => new GraphWorkerClient(), [])

  const [historyState, updateHistoryState] = useHistoryState()
  const [changes, updateChanges] = useMemo(
    () => [
      historyState.changes,
      (fn: ChangesReducerFn) =>
        updateHistoryState((state) => ({
          ...state,
          changes: fn(state.changes),
        })),
    ],
    [historyState, updateHistoryState]
  )

  const openGraph = useCallback(
    async (
      file: string | File,
      options: Omit<ParseOptions, "reportProgress">
    ) => {
      const run = async () => {
        try {
          if (graph) graph.parallel.abort()
          let lastProgressMessage
          const reportProgress = (message, progress) => {
            if (message !== lastProgressMessage || progress === 1) {
              if (lastProgressMessage)
                console.timeEnd(`[Open] ${lastProgressMessage}`)
              if (progress !== 1) console.time(`[Open] ${message}`)
              lastProgressMessage = message
            }
            console.log(message, progress)
            setGraphLoadState(progress === 1 ? null : { message, progress })
          }
          reportProgress("initializing", 0)
          const newGraph = await graphWorker.openGraph(
            file,
            options,
            reportProgress
          )

          reportProgress("applying changes", 0.9)
          modifyLocalAndWorkerGraphs(
            newGraph,
            graphWorker,
            changes,
            setLocalGraph
          )

          reportProgress("done", 1)
          onLoaded()
        } catch (err) {
          console.error(err)
          setGraphLoadState(err)
        }
      }
      trackLoading(run())
    },
    [trackLoading, graph, graphWorker, changes, onLoaded]
  )

  useEffect(() => {
    if (!graph || (!hasChanges(changes) && graph.revert.length === 0)) return
    // this effect is called from the last update
    if (graph[appliedChanges] === changes) return
    modifyLocalAndWorkerGraphs(graph, graphWorker, changes, setLocalGraph)
  }, [graph, changes, graphWorker])

  return {
    graph,
    graphWorker,
    graphLoadState,
    openGraph,
    changes,
    updateChanges,
  }
}
