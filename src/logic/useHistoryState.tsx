import pako from "pako"
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react"
import { Changes } from "../analysis/changes"
import { GraphEdgeID, GraphNodeID, ROOT_NODE_ID } from "../analysis/graph"
import { formatSize } from "../ui/format"

type HistoryState = {
  changes: Changes
  activeEdgeId: GraphEdgeID | null
  activeNodeId: GraphNodeID | null
  openedNodeIds: GraphNodeID[]
}

const defaultState = {
  changes: [],
  activeEdgeId: null,
  activeNodeId: null,
  openedNodeIds: [ROOT_NODE_ID],
}

const DEFLATE_HEADER = "deflate:"
export function encodeUrlStateHash(state: any) {
  return btoa(
    DEFLATE_HEADER +
      pako.deflate(JSON.stringify(state), { to: "string", level: 9 })
  )
}

export function decodeUrlStateHash(hash: string) {
  try {
    const decoded = atob(hash)
    const json = decoded.startsWith(DEFLATE_HEADER)
      ? pako.inflate(decoded.slice(DEFLATE_HEADER.length), { to: "string" })
      : decoded
    const state = JSON.parse(json)
    if (!state || typeof state !== "object")
      throw new Error(`Url is not an object`)
    return state
  } catch (error) {
    console.error("Decoding url failed", error)
    return {}
  }
}

function decodeFromCurrentLocation(oldState?: any) {
  const hash = (window.location.hash || "#").slice(1)
  if (!hash) return defaultState
  console.time("decode hash")
  const state = decodeUrlStateHash(hash)
  console.timeEnd("decode hash")
  return { ...defaultState, ...state }
}

function encodeToCurrentLocation(state: HistoryState, push: boolean) {
  console.time("encode hash")
  const encoded = encodeUrlStateHash(state)
  console.timeEnd("encode hash")
  console.log(`Encoded state is ${formatSize(encoded.length)}`)
  if (push) {
    window.history.pushState(null, null, "#" + encoded)
  } else {
    window.history.replaceState(null, null, "#" + encoded)
  }
}

type UpdateStateAction<T> = Partial<T> | ((state: T) => T)
type UpdateStateFn<T> = (action: UpdateStateAction<T>) => void

type UpdateStateLenseAction<T> = T | ((state: T) => T)
type UpdateStateLenseFn<T> = (action: UpdateStateAction<T>) => void

const HistoryContext = createContext<{
  state: HistoryState
  updateState: (action: UpdateStateAction<HistoryState>) => void
}>(null)

export function useHistoryState(): [HistoryState, UpdateStateFn<HistoryState>] {
  const { state, updateState } = useContext(HistoryContext)
  return [state, updateState]
}

export function useHistoryStateLense<P extends keyof HistoryState>(
  prop: P,
  validate?: (v: HistoryState[P]) => any
): [HistoryState[P], UpdateStateLenseFn<HistoryState[P]>] {
  const { state, updateState } = useContext(HistoryContext)
  const updateStateLense = useCallback(
    (action) =>
      updateState((state) => {
        const newLenseState =
          typeof action === "function" ? action(state[prop]) : action
        if (state[prop] === newLenseState) return state
        return { ...state, [prop]: newLenseState }
      }),
    [prop, updateState]
  )
  let value = state[prop]
  try {
    if (!validate(value)) value = defaultState[prop]
  } catch (e) {
    value = defaultState[prop]
  }
  return [value, updateStateLense]
}

let queuedIdle

function reduceLocationState(
  state: HistoryState,
  action: UpdateStateAction<HistoryState>
) {
  const newState =
    typeof action === "function" ? action(state) : { ...state, ...action }
  if (action !== decodeFromCurrentLocation && state !== newState) {
    if (queuedIdle) cancelIdleCallback(queuedIdle)
    requestIdleCallback(() => encodeToCurrentLocation(newState, false))
  }
  return newState
}

type Props = {
  children: ReactNode
}

export function HistoryContextProvider({ children }: Props) {
  const [state, updateState] = useReducer(
    reduceLocationState,
    undefined,
    decodeFromCurrentLocation
  )

  // handle pop states
  useEffect(() => {
    try {
      const handleHistoryChange = () => {
        updateState(decodeFromCurrentLocation)
      }
      window.addEventListener("popstate", handleHistoryChange)
      return () => {
        window.removeEventListener("popstate", handleHistoryChange)
      }
    } catch (error) {
      console.error("History failed to initialize", error)
    }
  }, [])

  // handle push states
  const context = useMemo(
    () => ({
      state,
      updateState: (action) => {
        updateState(action)
      },
    }),
    [state]
  )

  return (
    <HistoryContext.Provider value={context}>
      {children}
    </HistoryContext.Provider>
  )
}
