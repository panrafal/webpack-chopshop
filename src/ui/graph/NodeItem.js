// @flow
import type {Graph, Node, NodeID} from '../../analysis/graph'

import * as React from 'react'
import classNames from 'classnames'
import {withStyles, ListItem, ListItemText} from '@material-ui/core'
import NodeSize from './NodeSize'
import NodeName from './NodeName'

export type Props = {|
  baseGraph: Graph,
  graph: Graph,
  checked?: boolean,
  node: Node,
  hidePackage?: boolean,
  retainerRootNode?: ?Node,
  children?: React.Node,
  selectFromNode?: (node: NodeID) => void,
  selectToNode?: (node: NodeID) => void,
  onClick?: () => void,
  style?: Object,
  classes: Object,
  className?: string,
|}

const styles = theme => ({
  root: {
    // paddingLeft: 16,
  },
})

function NodeItem({
  baseGraph,
  graph,
  checked,
  onClick,
  node,
  retainerRootNode,
  selectFromNode,
  selectToNode,
  selectNode,
  hidePackage,
  style,
  children,
  classes,
  className,
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
          primary={<NodeName node={node} hidePackage={hidePackage} tooltip />}
          primaryTypographyProps={{noWrap: true, color: checked ? 'secondary' : 'default'}}
          secondary={
            <NodeSize
              baseGraph={baseGraph}
              graph={graph}
              node={node}
              retainerRootNode={retainerRootNode}
            />
          }
        />
        {children}
      </ListItem>
    </div>
  )
}
export default withStyles(styles)(NodeItem)
