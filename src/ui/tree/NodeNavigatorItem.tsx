import { ListItem, ListItemText, ListItemButton } from "@mui/material"
import { ReactNode } from "react"
import { GraphNode } from "../../analysis/graph"
import { getNodeGroup } from "../../analysis/groups"
import { makeStyles } from "../makeStyles"
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

const useStyles = makeStyles({ name: "NodeNavigatorItem" })((theme) => ({
  NodeNavigatorItem: {
    padding: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  chained: {
    border: "1px solid red",
  },
  active: {
    border: "4px solid red",
  },
}))

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
  const { classes, cx, theme } = useStyles()
  const { graph, graphWorker, updateChanges, activeNodeId } = useTreeContext()
  const active = activeNodeId === node.id
  const group = getNodeGroup(node)

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
        className={cx(
          className,
          classes.NodeNavigatorItem,
          active && classes.active
        )}
      >
        <ListItemButton>
          <ListItemText
            primary={<NodeName node={node} hidePackage={hidePackage} tooltip />}
            primaryTypographyProps={{
              noWrap: true,
              color: theme.palette[group.colorName].main,
            }}
            secondary={
              <NodeSize node={node} retainerRootNode={retainerRootNode} />
            }
          />
          {children}
        </ListItemButton>
      </ListItem>
    </div>
  )
}
