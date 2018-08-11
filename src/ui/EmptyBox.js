// @flow

import * as React from 'react'
import {withStyles} from '@material-ui/core'

type Props = {|
  children: React.Node,
  icon: React.Node,
  classes: Object,
|}

const styles = theme => ({
  root: {
    color: theme.palette.text.secondary,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    textAlign: 'center',
  },
  icon: {
    'margin-bottom': 8,
  },
})

const EmptyBox = ({classes, children, icon}: Props) => (
  <div className={classes.root}>
    <div className={classes.icon}>{icon}</div>
    <div>{children}</div>
  </div>
)

export default withStyles(styles)(EmptyBox)
