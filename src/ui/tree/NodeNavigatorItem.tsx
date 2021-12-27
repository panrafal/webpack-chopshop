import { ListItem, ListItemText, ListItemButton } from "@mui/material"
import { MouseEvent, ReactNode } from "react"
import { GraphNode, resolveEdge } from "../../analysis/graph"
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

  onClick?: (event: MouseEvent<any>) => void
  onDoubleClick?: (event: MouseEvent<any>) => void
}

const useStyles = makeStyles({ name: "NodeNavigatorItem" })((theme) => ({
  NodeNavigatorItem: {
    padding: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  activeNode: {
    border: `1px solid ${theme.graph.treeLineColor.chained}`,
    borderRadius: 2,
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
  const { graph, graphWorker, updateChanges, activeNodeId, activeEdgeId } =
    useTreeContext()
  const activeEdge = resolveEdge(graph, activeEdgeId)
  const isActiveNode = activeNodeId === node.id
  const isActiveEdge = activeEdge?.toId === node.id
  const group = getNodeGroup(node)

  return (
    <div style={style}>
      <ListItem
        dense
        disableGutters
        // @ts-expect-error mui
        ContainerComponent="div"
        selected={isActiveEdge}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        className={cx(
          className,
          classes.NodeNavigatorItem,
          isActiveNode && classes.activeNode
        )}
      >
        <ListItemButton>
          <ListItemText
            primary={<NodeName node={node} hidePackage={hidePackage} tooltip />}
            primaryTypographyProps={{
              noWrap: true,
              color: theme.palette[group.colorName].main,
              fontWeight: isActiveEdge ? "bold" : "initial",
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
