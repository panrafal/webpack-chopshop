// @flow
import type {Node} from '../../analysis/graph'

import * as React from 'react'
import classNames from 'classnames'
import {withStyles, Tooltip} from '@material-ui/core'

import {getModuleInfo} from '../../analysis/info'

type Props = {|
  node: Node,
  hidePackage?: boolean,
  onlyPackage?: boolean,
  tooltip?: boolean | string,
  children?: React.Node,
  classes: Object,
  className?: string,
|}

const styles = theme => ({
  root: {
    maxWidth: '100%',
    display: 'inline-flex',
    flexDirection: 'row',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  packageName: {
    textOverflow: 'ellipsis',
    flexShrink: 10,
    overflow: 'hidden',
  },
  path: {
    textOverflow: 'ellipsis',
    flexShrink: 1000,
    overflow: 'hidden',
    minWidth: 10,
  },
  name: {
    textOverflow: 'ellipsis',
    flexShrink: 1,
    overflow: 'hidden',
  },
  extension: {
    flexShrink: 0,
  },
})

function NodeName({node, hidePackage, onlyPackage, tooltip, children, classes, className}: Props) {
  // {selectFromNode && <a onClick={() => selectFromNode(node.id)}>From</a>}
  // {selectToNode && <a onClick={() => selectToNode(node.id)}>To</a>}

  const info = getModuleInfo(node)

  const packageName = hidePackage ? '' : info.packageName
  const path = onlyPackage ? '' : (info.path || '').replace(/^\/|\/$/g, '')
  const name = onlyPackage ? '' : (info.name || '') + (info.extension || '')

  const text = (
    <span className={classNames(className, classes.root)}>
      {packageName && <span className={classes.packageName}>{packageName}</span>}
      {packageName && path ? '/' : ''}
      {path && <span className={classes.path}>{path}</span>}
      {(packageName || path) && name ? '/' : ''}
      {name && <span className={classes.name}>{name}</span>}
      {(packageName || name) && children ? <span>,&nbsp;</span> : ''}
      {children && <span className={classes.children}>{children}</span>}
    </span>
  )

  if (tooltip) {
    return (
      <Tooltip
        title={typeof tooltip === 'boolean' ? `${node.name || ''} (${String(node.id)})` : tooltip}
        placement="top"
        enterDelay={100}
        disableFocusListener
      >
        {text}
      </Tooltip>
    )
  }

  return text
}
export default withStyles(styles)(NodeName)
