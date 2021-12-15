import { useMemo } from "react"
import { useCallbackPromise } from "./promises"

export type PromiseTrackerFn = (p: Promise<any>) => void
type TrackerState = { loading: boolean; error?: any }

// Allows to display a single loading state for multiple, imperatively added promises
// Same promise may be added multiple times and will only be tracked once
export function usePromiseTracker(): [TrackerState, PromiseTrackerFn] {
  const inst = useMemo(
    () => ({
      seenPromises: new WeakSet(),
      promises: [],
      allPromise: null as Promise<void> | null,
      getPromise: () => inst.allPromise,
      startLoading: null as (() => void) | null,
      addPromise: async (p) => {
        if (inst.seenPromises.has(p)) {
          return inst.allPromise
        }
        inst.seenPromises.add(p)
        inst.promises.push(p)
        const allPromise = Promise.all(inst.promises)
          .then(() => {})
          .finally(() => {
            if (inst.allPromise === allPromise) {
              inst.promises = []
            }
          })
        inst.allPromise = allPromise
        // delay to the next frame
        setTimeout(inst.startLoading, 0)
        return allPromise
      },
    }),
    []
  )

  const [startLoading, state] = useCallbackPromise(inst.getPromise)
  inst.startLoading = startLoading
  return [state, inst.addPromise]
}
