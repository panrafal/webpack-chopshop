import * as React from "react"
import { makeStyles } from "./makeStyles"

type Props = {
  classes: any
  children: React.ReactNode
}

const useStyles = makeStyles({ name: "Dot" })((theme) => ({
  root: {
    background: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    width: "1em",
    height: "1em",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: "100%",
    textAlign: "center",
  },
}))

export default function Dot({ children }: Props) {
  const { classes } = useStyles()
  return <div className={classes.root}>{children}</div>
}
