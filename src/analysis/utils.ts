import { DebouncedFunc, throttle } from "lodash"

export const ABORTED = "[ABORTED]"

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
