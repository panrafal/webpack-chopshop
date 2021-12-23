import ReportIcon from "@mui/icons-material/Report"
import { Skeleton } from "@mui/material"
import { Children, ReactNode } from "react"
import { useStablePromise } from "./hooks/promises"
import { makeStyles } from "./makeStyles"

type Props<T> = {
  className?: string
  promise: Promise<T> | T
  render: (value: T) => ReactNode
  children?: never
}

const useStyles = makeStyles({ name: "PromisedValue" })({
  root: {
    transition: "opacity 100ms",
    opacity: 1,
  },
  oldValue: {
    opacity: 0.5,
  },
  error: {
    marginLeft: 4,
  },
})

export default function PromisedValue<T>({
  promise,
  render,
  className,
}: Props<T>) {
  const { value, error, loading } = useStablePromise(promise)
  const { classes, cx } = useStyles()
  const hasValue = value !== undefined
  return (
    <span
      className={cx(
        className,
        classes.root,
        hasValue && (loading || error) && classes.oldValue
      )}
    >
      {hasValue ? (
        render(value)
      ) : (
        <Skeleton
          style={{ display: "inline-block" }}
          variant="text"
          width="5em"
        />
      )}
      {error ? (
        <span title={String(error)} className={classes.error}>
          <ReportIcon color="error" />
        </span>
      ) : null}
    </span>
  )
}
