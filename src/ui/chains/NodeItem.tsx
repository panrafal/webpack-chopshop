import type { Graph, GraphNode, GraphNodeID } from "../../analysis/graph"

import * as React from "react"
import classNames from "classnames"
import { withStyles, ListItem, ListItemText } from "@material-ui/core"
import NodeSize from "./NodeSize"
import NodeName from "./NodeName"

export type Props = {
  baseGraph: Graph
  graph: Graph
  checked?: boolean
  node: GraphNode
  hidePackage?: boolean
  retainerRootNode?: GraphNode | null
  children?: React.ReactNode
  selectFromNode?: (node: GraphNodeID) => void
  selectToNode?: (node: GraphNodeID) => void
  onClick?: () => void
  style?: any
  classes: any
  className?: string
}

const styles = (theme) => ({
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
        // @ts-expect-error mui
        ContainerComponent="div"
        button={true}
        onClick={onClick}
        className={classNames(className, classes.root)}
      >
        <ListItemText
          primary={<NodeName node={node} hidePackage={hidePackage} tooltip />}
          primaryTypographyProps={{
            noWrap: true,
            color: checked ? "secondary" : "initial",
          }}
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
