import { omit } from "lodash"
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react"
import { applyChanges, Change, revertGraph } from "../analysis/changes"
import { Graph, modifyGraph } from "../analysis/graph"
import { GraphWorkerClient } from "../analysis/worker/GraphWorkerClient"
import { readWebpackStats } from "../analysis/webpack"

export type ChangesReducerFn = (
  changes: ReadonlyArray<Change>
) => ReadonlyArray<Change>
export type UpdateChangesFn = (reducer: ChangesReducerFn) => void

export function useGraphState({ trackLoading, onLoaded }) {
  const [graph, setLocalGraph] = useState<Graph | undefined | null>()
  const graphWorker = useMemo(() => new GraphWorkerClient(), [])

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
        graphWorker.setGraph(graph)
        setLocalGraph(graph)
        onLoaded()
      }
      trackLoading(run())
    },
    [trackLoading]
  )

  const [changes, updateChanges] = useReducer(
    (changes: Change[], fn: ChangesReducerFn) => fn(changes),
    []
  )

  useEffect(() => {
    if (!graph || (changes.length === 0 && graph.revert.length === 0)) return
    modifyGraph(graph, (newGraph) => {
      revertGraph(newGraph)
      applyChanges(newGraph, changes)
      console.log("will set new graph", newGraph.version)
      // graphWorker.setGraphAndApplyChanges(newGraph, changes)
      graphWorker.setGraph(newGraph)
      setLocalGraph(newGraph)
      console.log("new graph set", newGraph.version)
    })
    //
  }, [changes])

  // const updateChanges = useCallback((fn: ChangesReducerFn) => {
  //   const newChanges = dispatchUpdateChanges(fn)
  // }, [])

  return { graph, graphWorker, openGraph, changes, updateChanges }
}
