import * as React from "react"
import { Icon } from "@mui/material"
import { amber as orange } from "@mui/material/colors"
import { makeStyles } from "./makeStyles"
import WarningIcon from "@mui/icons-material/Warning"

type Props = {
  children: React.ReactNode
}

const useStyles = makeStyles({ name: "WarningBar" })((theme) => ({
  root: {
    background: orange.A700,
    padding: "8px 24px 8px 24px",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    justifyContent: "center",
    height: "max-content",
  },
  icon: {
    marginRight: 8,
  },
}))

export default function WarningBar({ children }: Props) {
  const { classes } = useStyles()

  return (
    <div className={classes.root}>
      <WarningIcon className={classes.icon} />
      <span>{children}</span>
    </div>
  )
}
