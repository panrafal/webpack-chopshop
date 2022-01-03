import * as React from "react"
import { Icon, IconButton } from "@mui/material"
import { makeStyles } from "./makeStyles"
import ErrorIcon from "@mui/icons-material/Error"
import ReplayIcon from "@mui/icons-material/Replay"

type Props = {
  error?: any
  resetErrorBoundary?: () => void
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
    height: "max-content",
  },
  icon: {
    marginRight: 8,
  },
}))

const ErrorBox = ({ error, resetErrorBoundary, children }: Props) => {
  const { classes } = useStyles()
  if (children === undefined) children = String(error)
  return (
    <span className={classes.root}>
      <ErrorIcon className={classes.icon} />
      <span>
        {React.isValidElement(children) ? children : String(children)}
      </span>
      {resetErrorBoundary && (
        <IconButton onClick={() => resetErrorBoundary()}>
          <ReplayIcon />
        </IconButton>
      )}
    </span>
  )
}

export default ErrorBox
