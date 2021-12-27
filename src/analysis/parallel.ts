import { DebouncedFunc, throttle } from "lodash"

export class AbortSignal {
  message: string
  constructor(message: string = "Aborted") {
    this.message = message
  }
  toString() {
    return this.message
  }
}

export function isAbortSignal(e) {
  return e instanceof AbortSignal
}

export const ABORTED = new AbortSignal()

export type ParallelProcessor = {
  // allows to yield to micro or macro tasks (depends on how often it's called)
  yield: () => Promise<void> | void
  // abort processing of all tasks (next time they call yield() or use abortSignal)
  abort: (err?: string | any) => void
  // promise that will be rejected once abort() is called
  abortSignal: Promise<void>
  aborted: any
}

//
export const createParallelProcessor = ({
  maxDelay = typeof window === "undefined" ? 100 : 16,
}: { maxDelay?: number } = {}): ParallelProcessor => {
  let abortSignalReject
  let aborted
  const abortSignal = new Promise<void>((_, reject) => {
    abortSignalReject = reject
  })

  let lastYield = performance.now()

  return {
    yield() {
      if (aborted) throw aborted
      // yield to microtasks
      if (performance.now() - lastYield < maxDelay) return
      lastYield = performance.now()
      // yield to macrotasks
      return new Promise((resolve, reject) => {
        abortSignal.catch((err) => reject(err))
        setTimeout(resolve, 0)
      })
    },
    abort(err) {
      aborted = typeof err === "string" ? new AbortSignal(err) : err || ABORTED
      abortSignalReject(aborted)
    },
    abortSignal,
    get aborted() {
      return aborted
    },
  }
}
