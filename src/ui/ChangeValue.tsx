import { Skeleton } from "@mui/material"
import numeral from "numeral"
import { Children, ReactNode } from "react"
import { useStablePromise } from "./hooks/promises"
import { useStyles } from "./makeStyles"

type Props = {
  className?: string
  value: number | undefined | null
  desc?: boolean
  format: string
  children?: never
}

export default function ChangeValue({ value, desc, format, className }: Props) {
  const { theme } = useStyles()
  if (value == null) return null
  const better = desc ? value < 0 : value > 0
  return (
    <span
      className={className}
      style={{
        color: better
          ? theme.palette.success.main
          : value !== 0
          ? theme.palette.error.main
          : "inherit",
      }}
    >
      {value > 0 ? "+" : "-"}
      {numeral(Math.abs(value)).format(format)}
    </span>
  )
}
