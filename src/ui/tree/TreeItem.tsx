import { ChangeCircle } from "@mui/icons-material"
import {
  Checkbox,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { addChange } from "../../analysis/changes"
import { GraphEdge, GraphNode } from "../../analysis/graph"
import { makeStyles } from "../makeStyles"
import NodeName from "../nodes/NodeName"
import NodeSize from "../nodes/NodeSize"
import { useTreeContext } from "./TreeContext"

type Props = {
  className?: string
  style?: any

  edge: GraphEdge
  retainerRootNode?: GraphNode | null
  hidePackage?: boolean
  levelIndex: number

  selected?: boolean

  onClick?: () => void
  onDoubleClick?: () => void
}

const useStyles = makeStyles({ name: "TreeItem" })({
  root: {},
  disabled: {
    opacity: 0.5,
  },
  chained: {
    border: "1px solid red",
  },
  active: {
    border: "4px solid red",
  },
  cycle: {
    position: "absolute",
    right: 0,
  },
})

export default function TreeItem({
  className,
  style,
  edge,
  selected,
  hidePackage,
  retainerRootNode,
  onClick,
  onDoubleClick,
  levelIndex,
}: Props) {
  const { classes, cx } = useStyles()
  const {
    graph,
    updateChanges,
    enabledIds,
    chainedNodeIds,
    activeNodeId,
    openedNodeIds,
  } = useTreeContext()
  const enabled =
    edge.async ||
    enabledIds.includes(edge.id) ||
    enabledIds.includes(edge.from.id)
  const chained = chainedNodeIds.includes(edge.to.id)
  const active = activeNodeId === edge.to.id
  const cycle = openedNodeIds.slice(0, levelIndex + 1).includes(edge.to.id)
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
          classes.root,
          !enabled && classes.disabled,
          chained && classes.chained,
          active && classes.active
        )}
      >
        <ListItemButton sx={{ width: "100%" }}>
          <ListItemIcon>
            <Checkbox
              checked={edge.enabled}
              disabled={!enabled}
              onClick={(event) => {
                event.stopPropagation()
              }}
              onChange={(event) => {
                updateChanges((changes) =>
                  addChange(graph, changes, {
                    change: "edge",
                    from: edge.from.id,
                    to: edge.to.id,
                    enabled: event.target.checked,
                  })
                )
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              <NodeName node={edge.to} hidePackage={hidePackage} tooltip />
            }
            primaryTypographyProps={{
              noWrap: true,
              // color: selected ? "secondary" : "initial",
            }}
            secondary={
              <NodeSize
                graph={graph}
                node={edge.to}
                retainerRootNode={retainerRootNode || graph.root}
              />
            }
          />
          {cycle && <ChangeCircle className={classes.cycle} />}
        </ListItemButton>
      </ListItem>
    </div>
  )
}
