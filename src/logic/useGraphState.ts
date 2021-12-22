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
import { GraphWorkerClient } from "../analysis/GraphWorkerClient"
import { readWebpackStats } from "../analysis/webpack"

export type ChangesReducerFn = (
  changes: ReadonlyArray<Change>
) => ReadonlyArray<Change>
export type UpdateChangesFn = (reducer: ChangesReducerFn) => void

export function useGraphState({ trackLoading, onLoaded }) {
  const [graph, setGraphObject] = useState<Graph | undefined | null>()
  const graphWorker = useMemo(() => new GraphWorkerClient(), [])
  const setGraph = useCallback(
    async (graph: Graph) => {
      setGraphObject(graph)
      await graphWorker.setGraph(omit(graph, ["idle"]))
    },
    [setGraphObject, graphWorker]
  )

  const openGraph = useCallback(
    async (callback: () => Promise<any | null>) => {
      const run = async () => {
        setGraph(null)
        const json = await callback()
        if (json === null) {
          this.setState({ loading: false })
          return
        }
        console.time("conversion")
        const graph = await readWebpackStats(json)
        console.timeEnd("conversion")
        console.log("Graph: ", graph)
        console.warn("Errors found: ", graph.errors)
        setGraph(graph)
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
      setGraph(newGraph)
      console.log("new graph set", newGraph.version)
    })
    //
  }, [changes])

  // const updateChanges = useCallback((fn: ChangesReducerFn) => {
  //   const newChanges = dispatchUpdateChanges(fn)
  // }, [])

  return { graph, graphWorker, openGraph, changes, updateChanges }
}
