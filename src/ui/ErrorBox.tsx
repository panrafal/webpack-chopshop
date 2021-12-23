import * as React from "react"
import { Icon } from "@mui/material"
import { makeStyles } from "./makeStyles"
import ErrorIcon from "@mui/icons-material/Error"

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
    alignItems: "center",
    flexShrink: 0,
  },
  icon: {
    marginRight: 8,
  },
}))

const ErrorBox = ({ error, children }: Props) => {
  const { classes } = useStyles()
  if (children === undefined) children = String(error)
  return (
    <span className={classes.root}>
      <ErrorIcon className={classes.icon} />
      <span>
        {React.isValidElement(children) ? children : String(children)}
      </span>
    </span>
  )
}

export default ErrorBox
