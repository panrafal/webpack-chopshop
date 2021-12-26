import { ChangeCircle } from "@mui/icons-material"
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline"
import DownloadForOfflineOutlinedIcon from "@mui/icons-material/DownloadForOfflineOutlined"
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { MouseEvent, useCallback, useEffect } from "react"
import { addEdgeToggleChange } from "../../analysis/changes"
import {
  currentGraphFilter,
  stopOnAsyncModulesFilter,
} from "../../analysis/filters"
import {
  getEdgeId,
  getEdges,
  getEdgesFromChain,
  getNode,
  Graph,
  GraphEdge,
  GraphNode,
  GraphNodeID,
  resolveEdge,
  resolveNode,
  ROOT_NODE_ID,
} from "../../analysis/graph"
import { getNodeGroup } from "../../analysis/groups"
import { makeStyles } from "../makeStyles"
import NodeName from "../nodes/NodeName"
import NodeSize from "../nodes/NodeSize"
import { AppTheme } from "../theme"
import { useTreeContext } from "./TreeContext"

type Props = {
  className?: string
  style?: any

  edge: GraphEdge
  retainerRootNode?: GraphNode | null
  hidePackage?: boolean
  levelIndex: number

  selected?: boolean

  onClick?: (event: MouseEvent<any>) => void
  onDoubleClick?: (event: MouseEvent<any>) => void
}

type EdgeProps = {
  enabled: boolean
  chained: boolean
  cycled: boolean
}

export function getLineColor(
  theme: AppTheme,
  { enabled, chained, cycled }: EdgeProps
) {
  return !enabled
    ? theme.graph.treeLineColor.disabled
    : cycled
    ? theme.graph.treeLineColor.cycled
    : chained
    ? theme.graph.treeLineColor.chained
    : theme.graph.treeLineColor.enabled
}

type EdgeChainState = false | "start" | "end" | "middle" | "lone"

function getChainedState({
  graph,
  edge,
  chainedNodeIds,
}: {
  graph: Graph
  edge: GraphEdge
  chainedNodeIds: GraphNodeID[]
}): EdgeChainState {
  const hasChainedChildren = getNode(graph, edge.toId).children.some(
    ({ toId }) => chainedNodeIds.includes(toId)
  )
  const isChained = chainedNodeIds.includes(edge.toId)
  if (hasChainedChildren && edge.fromId === ROOT_NODE_ID) return "start"
  if (isChained && hasChainedChildren) return "middle"
  return isChained ? "end" : false
}

function getCycledState({
  graph,
  edge,
  levelIndex,
  openedNodeIds,
  activeNode,
}: {
  graph: Graph
  edge: GraphEdge
  activeNode: GraphNode | undefined
  levelIndex: number
  openedNodeIds: ReadonlyArray<GraphNodeID>
}): EdgeChainState {
  // is this edge already opened?
  const isCycleEnd = openedNodeIds.slice(0, levelIndex + 1).includes(edge.toId)
  const isOpened = openedNodeIds[levelIndex + 1] === edge.toId

  let cycleStartIndex
  let cycleEndIndex = isCycleEnd ? levelIndex : undefined
  if (activeNode) {
    // index where the active node is opened
    const activeLevelIndex = openedNodeIds.indexOf(activeNode.id)
    // find node that imports the active one again
    const cyclingNodeId =
      activeLevelIndex > 0
        ? openedNodeIds
            .slice(activeLevelIndex)
            .find((nodeId) =>
              resolveEdge(graph, getEdgeId(nodeId, activeNode.id))
            )
        : null
    if (cyclingNodeId) {
      cycleStartIndex = activeLevelIndex
      cycleEndIndex = openedNodeIds.indexOf(cyclingNodeId)
    }
  }
  if (isCycleEnd && cycleStartIndex == null) return "lone"
  if (isCycleEnd) return "end"
  if (!isOpened || cycleStartIndex == null || cycleEndIndex == null)
    return false
  if (levelIndex === cycleStartIndex) return "start"
  if (levelIndex > cycleStartIndex && levelIndex < cycleEndIndex)
    return "middle"
  return false
}

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
  const {
    graph,
    graphWorker,
    updateChanges,
    enabledIds,
    chainedNodeIds,
    activeNodeId,
    activeEdgeId,
    openedNodeIds,
    openNode,
  } = useTreeContext()
  const activeNode = activeNodeId === edge.toId
  const activeEdge = activeEdgeId === edge.id
  const opened = openedNodeIds[levelIndex + 1] === edge.toId

  const enabled = enabledIds.includes(edge.id)
  const toggleable =
    edge.async ||
    enabledIds.includes(edge.id) ||
    enabledIds.includes(edge.fromId)

  const chained = getChainedState({ graph, edge, chainedNodeIds })
  const cycled = getCycledState({
    graph,
    edge,
    activeNode: resolveNode(graph, activeNodeId),
    openedNodeIds,
    levelIndex,
  })

  useEffect(() => {
    console.log("Mounted TreeItem")
  }, [])

  const { classes, cx, theme } = useStyles({
    enabled,
    chained,
    activeEdge,
    activeNode,
    opened,
    cycled,
  })

  const handleToggleChange = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      const enabled = (event.target as HTMLInputElement).checked
      const changeEdges = [edge]
      if (edge.async && enabled) {
        // for async edges, we want to enable async parent edges (on a single chain is enough)
        // but only if it's not already enabled...
        const [parentChain] = await graphWorker.findChains(
          graph.root,
          getNode(graph, edge.toId),
          currentGraphFilter
        )
        if (!parentChain) {
          const [parentDisabledChain = []] = await graphWorker.findChains(
            graph.root,
            getNode(graph, edge.toId)
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
          ...getEdges(
            graph,
            await graphWorker.getAsyncEdges(
              getNode(graph, edge.toId),
              event.shiftKey ? stopOnAsyncModulesFilter : undefined
            )
          )
        )
      }
      // if (edge)
      updateChanges((changes) =>
        changeEdges.reduce(
          (changes, changeEdge) =>
            addEdgeToggleChange(graph, changes, changeEdge, enabled),
          changes
        )
      )
    },
    [edge, graph, updateChanges]
  )

  const group = getNodeGroup(getNode(graph, edge.toId))

  const checkboxProps = edge.async
    ? ({
        icon: <DownloadForOfflineOutlinedIcon />,
        checkedIcon: <DownloadForOfflineIcon />,
        color: group.colorName as any, // "graphAsync",
      } as const)
    : {
        color: group.colorName as any,
      }

  return (
    <div style={style} className={classes.root}>
      <ListItem
        dense
        disableGutters
        // @ts-expect-error mui
        ContainerComponent="div"
        selected={selected}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        className={cx(className, classes.edge)}
      >
        <ListItemButton sx={{ width: "100%" }}>
          <ListItemIcon>
            <Checkbox
              checked={edge.enabled}
              disabled={!toggleable}
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
                <NodeName
                  node={getNode(graph, edge.toId)}
                  hidePackage={hidePackage}
                  tooltip
                />
              )
              // <NodeName node={getNode(graph, edge.toId)} hidePackage={hidePackage} tooltip />
            }
            primaryTypographyProps={{
              noWrap: true,
              fontWeight: activeEdge ? "bold" : "initial",
              color: theme.palette[group.colorName].main,
            }}
            secondary={
              <NodeSize
                node={getNode(graph, edge.toId)}
                retainerRootNode={retainerRootNode || graph.root}
              />
            }
          />
          {(cycled === "lone" || cycled === "end") && (
            <IconButton
              className={classes.cycleIcon}
              onClick={(event) => {
                event.stopPropagation()
                openNode(getNode(graph, edge.toId))
              }}
            >
              <ChangeCircle />
            </IconButton>
          )}
        </ListItemButton>
      </ListItem>
      {getNode(graph, edge.fromId) !== graph.root ? (
        <div className={cx(classes.connector, classes.connectorLeft)} />
      ) : null}
      <div className={cx(classes.connector, classes.connectorRight)} />
    </div>
  )
}

const useStyles = makeStyles<
  {
    enabled: boolean
    chained: EdgeChainState
    cycled: EdgeChainState
    activeNode: boolean
    activeEdge: boolean
    opened: boolean
  },
  "connectorLeft"
>({ name: "TreeItem" })(
  (
    theme,
    { enabled, chained, activeNode, activeEdge, opened, cycled },
    classes
  ) => {
    const background = theme.palette.background.default
    const lineWidth = theme.graph.treeLevelGap / 2
    const lineSize = theme.graph.treeLineSize
    const lineColor = getLineColor(theme, {
      enabled,
      chained: activeNode || !!chained,
      cycled: !!cycled,
    })
    const parentLineColor = getLineColor(theme, {
      enabled,
      chained: chained && chained !== "start",
      cycled: cycled && cycled !== "start" && cycled !== "lone",
    })
    const childLineColor = getLineColor(theme, {
      enabled,
      chained: chained && chained !== "end",
      cycled: cycled && cycled !== "end" && cycled !== "lone",
    })
    return {
      root: {
        height: 64,
        padding: `2px ${lineWidth + 1}px`,
        background: `linear-gradient(90deg, transparent, ${background} ${
          lineWidth - 4
        }px, ${background} calc(100% - ${lineWidth - 4}px), transparent)`,
        [`&:hover .${classes.connectorLeft}`]: {
          opacity: 1,
        },
      },
      edge: {
        height: "100%",
        border: "1px solid",
        borderRadius: 2,
        borderColor: lineColor,
        borderLeftWidth:
          cycled === "start" || (!cycled && chained === "start") ? 4 : 1,
        borderRightWidth:
          cycled === "end" || (!cycled && chained === "end") ? 4 : 1,
        borderTopWidth: activeNode ? 4 : 1,
        borderBottomWidth: activeNode ? 4 : 1,
      },
      cycleIcon: {
        position: "absolute",
        right: 0,
      },
      connector: {
        position: "absolute",
        width: lineWidth,
        height: lineSize,
        top: `calc(50% - ${lineSize / 2}px)`,
      },
      connectorLeft: {
        left: 0,
        opacity: opened ? 1 : 0,
        background: `linear-gradient(90deg, ${theme.graph.treeRailColor}, ${parentLineColor})`,
      },
      connectorRight: {
        right: 0,
        opacity: opened ? 1 : 0,
        background: `linear-gradient(90deg, ${childLineColor}, ${theme.graph.treeRailColor})`,
      },
    }
  }
)
