import { useCallback, useEffect, useMemo, useState } from "react"
import {
  applyChanges,
  Changes,
  hasChanges,
  revertGraph,
} from "../analysis/changes"
import { Graph, modifyGraph } from "../analysis/graph"
import { readWebpackStats } from "../analysis/webpack"
import { GraphWorkerClient } from "../analysis/worker/GraphWorkerClient"
import { useHistoryState } from "./useHistoryState"

export type ChangesReducerFn = (changes: Changes) => Changes
export type UpdateChangesFn = (reducer: ChangesReducerFn) => void

const appliedChanges = Symbol("appliedChanges")

export function useGraphState({ trackLoading, onLoaded }) {
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
    async (callback: () => Promise<any | null>) => {
      const run = async () => {
        // setLocalGraph(null)
        const json = await callback()
        if (json === null) {
          return
        }
        console.time("conversion")
        const graph = await readWebpackStats(json)
        console.timeEnd("conversion")
        console.log("Graph: ", graph)
        console.warn("Errors found: ", graph.errors)
        applyChanges(graph, changes)
        graphWorker.setGraph(graph)
        setLocalGraph(graph)
        onLoaded()
      }
      trackLoading(run())
    },
    [trackLoading, changes]
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
    //
  }, [graph, changes])

  // const updateChanges = useCallback((fn: ChangesReducerFn) => {
  //   const newChanges = dispatchUpdateChanges(fn)
  // }, [])

  return { graph, graphWorker, openGraph, changes, updateChanges }
}
