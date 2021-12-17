import * as React from "react"
import withStyles from '@mui/styles/withStyles';

type Props = {
  classes: any
  children: React.ReactNode
}

const styles = (theme) => ({
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
})

const Dot = ({ classes, children }: Props) => (
  <div className={classes.root}>{children}</div>
)

// @ts-expect-error mui
export default withStyles(styles)(Dot)
