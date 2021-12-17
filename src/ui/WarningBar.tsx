import * as React from "react"
import { Icon } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import { amber as orange } from '@mui/material/colors';

type Props = {
  children: React.ReactNode
  classes: any
}

const styles = (theme) => ({
  root: {
    background: orange.A700,
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

const WarningBar = ({ classes, children }: Props) => (
  <div className={classes.root}>
    <Icon className={classes.icon}>warning</Icon>
    <span className={classes.label}>{children}</span>
  </div>
)

export default withStyles(styles)(WarningBar)
