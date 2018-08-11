// @flow

import type {Graph, NodeID} from '../../analysis/graph'

import * as React from 'react'
import {withStyles, ListItem, ListItemText} from '@material-ui/core'

import {getNode} from '../../analysis/graph'
import NodeName from './NodeName'

type Props = {|
  graph: Graph,
  chain: $ReadOnlyArray<NodeID>,
  through: $ReadOnlyArray<NodeID>,
  checked?: boolean,

  onClick: Function,

  style: Object,
  classes: Object,
|}

const styles = theme => ({
  root: {},
  nodes: {
    display: 'flex',
    flexDirection: 'row',
  },
  node: {
    width: 300,
    marginRight: 24,
    position: 'relative',
  },
  link: {
    position: 'absolute',
    left: -24,
    top: 0,
  },
})

function ChainItem({graph, chain, through, onClick, style, classes, checked}: Props) {
  return (
    <div style={style}>
      <ListItem dense ContainerComponent="div" button onClick={onClick} disableGutters>
        <ListItemText
          primary={through.length ? <NodeName node={getNode(graph, through[0])} /> : 'Direct'}
          secondary={`${chain.length - 1} nodes deep`}
          primaryTypographyProps={{noWrap: true, color: checked ? 'secondary' : 'default'}}
        />
      </ListItem>
    </div>
  )
}

export default withStyles(styles)(ChainItem)
