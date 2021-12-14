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

export type BackgroundProcessor = DebouncedFunc<() => Promise<void>> & {
  abort: (err: any) => Promise<void>
}

//
export const backgroundProcessor = (): BackgroundProcessor => {
  let abort
  let idleReject
  const fn = throttle<() => Promise<void>>(
    () =>
      new Promise((resolve, reject) => {
        if (abort) reject(abort())
        idleReject = reject
        setTimeout(resolve, 0)
      }),
    16
  )
  return Object.assign(fn, {
    abort: (err = ABORTED) => {
      return new Promise<void>((resolve) => {
        abort = () => {
          resolve()
          return err
        }
        if (idleReject) idleReject(abort())
        setTimeout(resolve, 0)
      })
    },
  })
}
