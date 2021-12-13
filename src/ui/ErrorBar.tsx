import * as React from "react"
import { withStyles, Icon } from "@material-ui/core"

type Props = {
  children: React.ReactNode
  classes: any
}

const styles = (theme) => ({
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
})

const ErrorBar = ({ classes, children }: Props) => (
  <div className={classes.root}>
    <Icon className={classes.icon}>error</Icon>
    <span className={classes.label}>{children}</span>
  </div>
)

export default withStyles(styles)(ErrorBar)
