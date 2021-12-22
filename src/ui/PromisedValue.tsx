import { Skeleton } from "@mui/material"
import { Children, ReactNode } from "react"
import { useStablePromise } from "./hooks/promises"

type Props<T> = {
  className?: string
  promise: Promise<T> | T
  render: (value: T) => ReactNode
  children?: never
}

export default function PromisedValue<T>({
  promise,
  render,
  className,
}: Props<T>) {
  const { value, error, loading } = useStablePromise(promise)
  return (
    <span className={className}>
      {value !== undefined && !loading ? (
        render(value)
      ) : (
        <Skeleton variant="text" />
      )}
    </span>
  )
}
