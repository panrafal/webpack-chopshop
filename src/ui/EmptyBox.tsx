import * as React from "react"
import { makeStyles } from "./makeStyles"

type Props = {
  children: React.ReactNode
  icon: React.ReactNode
}

const useStyles = makeStyles({ name: "EmptyBox" })((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    textAlign: "center",
  },
  icon: {
    "margin-bottom": 8,
  },
}))

export default function EmptyBox({ children, icon }: Props) {
  const { classes } = useStyles()
  return (
    <div className={classes.root}>
      <div className={classes.icon}>{icon}</div>
      <div>{children}</div>
    </div>
  )
}
