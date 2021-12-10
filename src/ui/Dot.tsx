// @flow

import * as React from 'react'
import {withStyles} from '@material-ui/core'

type Props = {|
  classes: Object,
  children: React.Node,
|}

const styles = theme => ({
  root: {
    background: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    width: '1em',
    height: '1em',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderRadius: '100%',
    textAlign: 'center',
  },
})

const Dot = ({classes, children}: Props) => <div className={classes.root}>{children}</div>

export default withStyles(styles)(Dot)
