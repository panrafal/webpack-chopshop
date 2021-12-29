import { GroupAddSharp } from "@mui/icons-material"
import { useCallback, useEffect, useMemo, useState } from "react"
import {
  applyChanges,
  Changes,
  hasChanges,
  revertGraph,
} from "../analysis/changes"
import { Graph, modifyGraph } from "../analysis/graph"
import { ParseOptions } from "../analysis/open"
import { readWebpackStats } from "../analysis/webpack"
import { GraphWorkerClient } from "../analysis/worker/GraphWorkerClient"
import { useHistoryState } from "./useHistoryState"

export type ChangesReducerFn = (changes: Changes) => Changes
export type UpdateChangesFn = (reducer: ChangesReducerFn) => void
export type GraphLoadState =
  | null
  | { message: string; progress: number }
  | Error

const appliedChanges = Symbol("appliedChanges")

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
        setGraphLoadState({ message: "loading", progress: 0 })
        try {
          if (graph) graph.parallel.abort()
          const newGraph = await graphWorker.openGraph(file, {
            ...options,
            reportProgress: (message, progress) =>
              setGraphLoadState({ message, progress }),
          })
          setLocalGraph(newGraph)
          // changes will be applied as an effect of switching to a new graph
          setGraphLoadState(null)
          onLoaded()
        } catch (err) {
          console.error(err)
          setGraphLoadState(err)
        }
      }
      trackLoading(run())
    },
    [trackLoading, graph, graphWorker, onLoaded]
  )

  useEffect(() => {
    if (!graph || (!hasChanges(changes) && graph.revert.length === 0)) return
    // this effect is called from the last update
    if (graph[appliedChanges] === changes) return
    modifyGraph(graph, (newGraph) => {
      revertGraph(newGraph)
      applyChanges(newGraph, changes)
      newGraph[appliedChanges] = changes
      console.log("will set new graph", newGraph.version)
      graphWorker.setGraphAndApplyChanges(newGraph, changes)
      // graphWorker.setGraph(newGraph)
      setLocalGraph(newGraph)
      console.log("new graph set", newGraph.version)
    })
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
