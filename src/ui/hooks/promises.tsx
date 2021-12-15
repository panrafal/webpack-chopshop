import { useEffect, useMemo, useReducer } from "react"

type CachedPromiseState<T> = {
  loading: boolean
  called: boolean
  error?: any
  value?: T
}
type PromiseState<T> = CachedPromiseState<T> & {
  promise?: Promise<T>
}

const promisesCache = new WeakMap<Promise<any>, CachedPromiseState<any>>()

function isPromise(p: any): p is Promise<any> {
  return p && "then" in p && typeof p.then === "function"
}

const defaultPromiseState = (called: boolean): CachedPromiseState<any> => ({
  called,
  loading: called,
  error: undefined,
  value: undefined,
})

function storePromise<T>(promise: Promise<T>): PromiseState<T> {
  const promiseState = defaultPromiseState(true)
  promisesCache.set(promise, promiseState)
  promise.then(
    (v) => {
      promiseState.loading = false
      promiseState.value = v
    },
    (e) => {
      promiseState.loading = false
      promiseState.error = e
    }
  )
  return promiseState
}

const promiseReducer = (state, action): PromiseState<any> => {
  switch (action.type) {
    case "SET":
      return { ...state, ...action.payload }
    case "START":
      return {
        called: true,
        loading: true,
        error: undefined,
        value: state.value,
        promise: action.payload,
      }
    case "RESOLVE":
      return {
        called: true,
        loading: false,
        error: false,
        value: action.payload,
        promise: state.promise,
      }
    case "REJECT":
      return {
        called: true,
        loading: false,
        error: action.payload,
        value: undefined,
        promise: state.promise,
      }
    default:
      return state
  }
}

const createEffectFn =
  <T extends any>(
    promise: Promise<T>,
    dispatch,
    ctx: { active: boolean } = { active: true }
  ) =>
  () => {
    if (!isPromise(promise)) {
      dispatch({
        type: "SET",
        payload: { promise, value: promise, loading: false },
      })
      return null
    }
    const cachedState = promisesCache.get(promise)
    if (cachedState && !cachedState.loading) {
      dispatch({ type: "SET", payload: { ...cachedState, promise } })
      return null
    }
    if (!cachedState) {
      storePromise(promise)
    }

    dispatch({ type: "START", payload: promise })

    promise.then(
      (result) => {
        if (!ctx.active) {
          return
        }
        dispatch({
          type: "RESOLVE",
          payload: result,
        })
      },
      (error) => {
        if (!ctx.active) {
          return
        }
        console.error(error)
        dispatch({
          type: "REJECT",
          payload: error,
        })
      }
    )

    return () => {
      ctx.active = false
    }
  }

export const useStablePromise = <T extends any>(
  promise: Promise<T>
): PromiseState<T> => {
  const [promiseState, dispatch] = useReducer(
    promiseReducer,
    defaultPromiseState(true)
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(createEffectFn<T>(promise, dispatch), [promise, dispatch])

  return { ...promiseState, promise }
}

export const useCallbackPromise = <T extends any>(
  callback: () => Promise<T>
): [() => Promise<T>, PromiseState<T>] => {
  const [promiseState, dispatch] = useReducer(
    promiseReducer,
    defaultPromiseState(false)
  )

  const [start, abort] = useMemo(() => {
    const ctx = { active: true }
    return [
      () => {
        const promise = callback()
        createEffectFn<T>(promise, dispatch, ctx)()
        return promise
      },
      () => {
        ctx.active = false
      },
    ]
  }, [callback])
  useEffect(() => abort, [abort])

  return [start, promiseState]
}

export function useStablePromiseSuspense<T>(stablePromise: Promise<T> | T): T {
  if (!isPromise(stablePromise)) return stablePromise

  let promiseState = promisesCache.get(stablePromise)
  if (!promiseState) {
    storePromise(stablePromise)
    throw stablePromise
  } else {
    if ("resolved" in promiseState) return promiseState.value
    if ("error" in promiseState) throw promiseState.error
    throw stablePromise
  }
}
