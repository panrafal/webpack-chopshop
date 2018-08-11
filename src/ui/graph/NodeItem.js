// @flow
import type {Graph, Node, NodeID} from '../../analysis/graph'

import * as React from 'react'
import classNames from 'classnames'
import {withStyles, ListItem, ListItemText, ListItemSecondaryAction} from '@material-ui/core'
import NodeSize from './NodeSize'
import NodeName from './NodeName'

type Props = {|
  baseGraph: Graph,
  graph: Graph,
  checked?: boolean,
  node: Node,
  secondaryActions?: React.Node[],
  selectFromNode?: (node: NodeID) => void,
  selectToNode?: (node: NodeID) => void,
  onClick?: () => void,
  style?: Object,
  classes: Object,
  className?: string,
|}

const styles = theme => ({
  root: {
    paddingLeft: 16,
  },
})

function NodeItem({
  baseGraph,
  graph,
  checked,
  onClick,
  node,
  selectFromNode,
  selectToNode,
  selectNode,
  style,
  children,
  classes,
  className,
  secondaryActions = [],
}: Props) {
  // {selectFromNode && <a onClick={() => selectFromNode(node.id)}>From</a>}
  // {selectToNode && <a onClick={() => selectToNode(node.id)}>To</a>}

  return (
    <div style={style}>
      <ListItem
        dense
        disableGutters
        ContainerComponent="div"
        button={!!onClick}
        onClick={onClick}
        className={classNames(className, classes.root)}
      >
        <ListItemText
          primary={<NodeName node={node} hidePackage tooltip />}
          primaryTypographyProps={{noWrap: true, color: checked ? 'secondary' : 'default'}}
          secondary={<NodeSize baseGraph={baseGraph} graph={graph} node={node} />}
        />
        {secondaryActions.map((action, index) => (
          <ListItemSecondaryAction key={index}>{action}</ListItemSecondaryAction>
        ))}
      </ListItem>
    </div>
  )
}
export default withStyles(styles)(NodeItem)
