import { ChangeCircle } from "@mui/icons-material"
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { MouseEvent } from "react"
import { ChangeEvent, useCallback } from "react"
import { findChains } from "../../analysis/chains"
import { addChange } from "../../analysis/changes"
import {
  currentGraphFilter,
  getAsyncEdges,
  stopOnAsyncModulesFilter,
} from "../../analysis/dependencies"
import { getEdgesFromChain, GraphEdge, GraphNode } from "../../analysis/graph"
import { makeStyles } from "../makeStyles"
import NodeName from "../nodes/NodeName"
import NodeSize from "../nodes/NodeSize"
import { useTreeContext } from "./TreeContext"

import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline"
import DownloadForOfflineOutlinedIcon from "@mui/icons-material/DownloadForOfflineOutlined"

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
    openNode,
  } = useTreeContext()
  const enabled =
    edge.async ||
    enabledIds.includes(edge.id) ||
    enabledIds.includes(edge.from.id)
  const chained = chainedNodeIds.includes(edge.to.id)
  const active = activeNodeId === edge.to.id
  const cycle = openedNodeIds.slice(0, levelIndex + 1).includes(edge.to.id)

  const handleToggleChange = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      const enabled = (event.target as HTMLInputElement).checked
      const changeEdges = [edge]
      if (edge.async && enabled) {
        // for async edges, we want to enable async parent edges (on a single chain is enough)
        // but only if it's not already enabled...
        const [parentChain] = await findChains(graph, graph.root, edge.to, {
          filter: currentGraphFilter,
        })
        if (!parentChain) {
          const [parentDisabledChain = []] = await findChains(
            graph,
            graph.root,
            edge.to
          )
          changeEdges.push(
            ...getEdgesFromChain(graph, parentDisabledChain).filter(
              (e) => !e.enabled
            )
          )
        }
      }
      if (edge.async && (event.shiftKey || event.altKey)) {
        // toggle all child async edges
        changeEdges.push(
          ...(await getAsyncEdges(graph, edge.to, {
            filter: event.shiftKey ? stopOnAsyncModulesFilter : undefined,
          }))
        )
      }
      // if (edge)
      updateChanges((changes) =>
        changeEdges.reduce(
          (changes, changeEdge) =>
            addChange(graph, changes, {
              change: "edge",
              from: changeEdge.from.id,
              to: changeEdge.to.id,
              enabled,
            }),
          changes
        )
      )
    },
    [edge, graph, updateChanges]
  )

  const checkboxProps = edge.async
    ? ({
        icon: <DownloadForOfflineOutlinedIcon />,
        checkedIcon: <DownloadForOfflineIcon />,
        color: "graphAsync",
      } as const)
    : {}

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
              {...checkboxProps}
              onClick={(event) => {
                // so that edge isn't selected by clicking
                event.stopPropagation()
                // @ts-expect-error
                handleToggleChange(event)
              }}
              // onChange={handleToggleChange}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              edge.name || (
                <NodeName node={edge.to} hidePackage={hidePackage} tooltip />
              )
              // <NodeName node={edge.to} hidePackage={hidePackage} tooltip />
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
          {cycle && (
            <IconButton
              className={classes.cycle}
              onClick={(event) => {
                event.stopPropagation()
                openNode(edge.to)
              }}
            >
              <ChangeCircle />
            </IconButton>
          )}
        </ListItemButton>
      </ListItem>
    </div>
  )
}
