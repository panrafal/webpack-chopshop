// @flow

import * as React from 'react'
import {withStyles, Icon} from '@material-ui/core'

type Props = {|
  error?: any,
  children?: React.Node,
  classes: Object,
|}

const styles = theme => ({
  root: {
    background: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
    padding: 16,
    display: 'flex',
    'align-items': 'center',
    'flex-shrink': 0,
  },
  icon: {
    'margin-right': 8,
  },
})

const ErrorBox = ({classes, error, children}: Props) => {
  if (children === undefined) children = String(error)
  return (
    <div className={classes.root}>
      <Icon className={classes.icon}>error</Icon>
      <span className={classes.label}>
        {React.isValidElement(children) ? children : String(children)}
      </span>
    </div>
  )
}

export default withStyles(styles)(ErrorBox)
