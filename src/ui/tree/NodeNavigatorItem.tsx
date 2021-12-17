import { Checkbox, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import classNames from "classnames"
import { ReactNode } from "react"
import { addChange } from "../../analysis/changes"
import { GraphEdge, GraphNode } from "../../analysis/graph"
import NodeName from "../nodes/NodeName"
import NodeSize from "../nodes/NodeSize"
import { useTreeContext } from "./TreeContext"

export type NodeNavigatorItemProps = {
  className?: string
  style?: any

  node: GraphNode
  retainerRootNode?: GraphNode | null
  hidePackage?: boolean

  selected?: boolean
  children?: ReactNode

  onClick?: () => void
  onDoubleClick?: () => void
}

const useStyles = makeStyles({
  NodeNavigatorItem: {},
  disabled: {
    opacity: 0.5,
  },
  chained: {
    border: "1px solid red",
  },
  active: {
    border: "4px solid red",
  },
})

export default function NodeNavigatorItem({
  className,
  style,
  node,
  selected,
  hidePackage,
  retainerRootNode,
  onClick,
  onDoubleClick,
  children,
}: NodeNavigatorItemProps) {
  const classes = useStyles()
  const { graph, updateChanges, activeNodeId } = useTreeContext()
  const active = activeNodeId === node.id
  return (
    <div style={style}>
      <ListItem
        dense
        disableGutters
        // @ts-expect-error mui
        ContainerComponent="div"
        selected={selected}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        className={classNames(
          className,
          classes.NodeNavigatorItem,
          active && classes.active
        )}
      >
        <ListItemText
          primary={<NodeName node={node} hidePackage={hidePackage} tooltip />}
          primaryTypographyProps={{
            noWrap: true,
            color: selected ? "secondary" : "initial",
          }}
          secondary={
            <NodeSize
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
