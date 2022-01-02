import { useEffect, useReducer } from "react"
import { GraphNodeID } from "../analysis/graph"

type PinnedState = GraphNodeID[]
type TogglePinnedPayload = { id: GraphNodeID; set?: boolean } | GraphNodeID[]
export type TogglePinnedFn = (p: TogglePinnedPayload) => void

export function usePinnedState(): [PinnedState, (TogglePinnedPayload) => void] {
  const [pinned, togglePinned] = useReducer(
    (currentPinned, payload: TogglePinnedPayload): PinnedState => {
      let newPinned
      if (Array.isArray(payload)) {
        newPinned = payload
      } else {
        const { id } = payload
        const wasPinned = currentPinned.includes(id)
        const isPinned = payload.set ?? !wasPinned
        if (wasPinned === isPinned) return currentPinned
        newPinned = isPinned
          ? [id, ...currentPinned]
          : currentPinned.filter((pin) => pin !== id)
      }
      window.localStorage.setItem("pinned", JSON.stringify(newPinned))
      return newPinned
    },
    []
  )

  useEffect(() => {
    try {
      togglePinned(JSON.parse(window.localStorage.getItem("pinned") || "[]"))

      const handleStorageEvent = (event: StorageEvent) => {
        if (event.key === "pinned" && event.newValue) {
          togglePinned(JSON.parse(event.newValue))
        }
      }

      window.addEventListener("storage", handleStorageEvent)

      return () => {
        window.removeEventListener("storage", handleStorageEvent)
      }
    } catch (error) {
      console.error("Local storage failed to initialize", error)
    }
  }, [])

  return [pinned, togglePinned]
}
