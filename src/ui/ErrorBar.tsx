import * as React from "react"
import { Icon } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import classNames from "classnames"

type Props = {
  children: React.ReactNode
  className?: string
}

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
    padding: "8px 24px 8px 24px",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    justifyContent: "center",
  },
  icon: {
    "margin-right": 8,
  },
}))

export default function ErrorBar({ className, children }: Props) {
  const classes = useStyles()
  return (
    <div className={classNames(className, classes.root)}>
      <Icon className={classes.icon}>error</Icon>
      <span>{children}</span>
    </div>
  )
}
