import * as React from "react"
import { Icon } from "@mui/material"
import { makeStyles } from "./makeStyles"

type Props = {
  error?: any
  children?: React.ReactNode
}

const useStyles = makeStyles({ name: "ErrorBox" })((theme) => ({
  root: {
    background: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
    padding: 16,
    display: "flex",
    "align-items": "center",
    "flex-shrink": 0,
  },
  icon: {
    "margin-right": 8,
  },
}))

const ErrorBox = ({ error, children }: Props) => {
  const { classes } = useStyles()
  if (children === undefined) children = String(error)
  return (
    <div className={classes.root}>
      <Icon className={classes.icon}>error</Icon>
      <span>
        {React.isValidElement(children) ? children : String(children)}
      </span>
    </div>
  )
}

export default ErrorBox
