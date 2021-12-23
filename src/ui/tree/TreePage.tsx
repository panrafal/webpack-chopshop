import {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  getAllNodes,
  getEdgeId,
  getEdges,
  getNode,
  getNodes,
  Graph,
  GraphEdgeID,
  GraphNode,
  GraphNodeID,
  resolveEdge,
  resolveNode,
  ROOT_NODE_ID,
} from "../../analysis/graph"
import TreeLevel from "./TreeLevel"
import {
  getAsyncEdges,
  getDeepNodeChildren,
  getEnabledChildEdges,
} from "../../analysis/dependencies"
import {
  currentGraphFilter,
  stopOnAsyncModulesFilter,
} from "../../analysis/filters"
import { findChains } from "../../analysis/chains"
import { useStablePromise } from "../hooks/promises"
import { TreeContextProvider } from "./TreeContext"
import { UpdateChangesFn } from "../../logic/useGraphState"
import NodeNavigator, { NavigatorModes } from "./NodeNavigator"
import { TogglePinnedFn } from "../../logic/usePinnedState"
import LoadingBoundary from "../LoadingBoundary"
import { PromiseTrackerFn } from "../hooks/usePromiseTracker"
import { makeStyles } from "../makeStyles"
import { uniq } from "lodash"
import { findNodeCycles } from "../../analysis/cycles"
import RootInfo from "./info/RootInfo"
import ActiveEdgeInfo from "./info/ActiveEdgeInfo"
import ActiveNodeInfo from "./info/ActiveNodeInfo"
import { Grid, Paper } from "@mui/material"
import { GraphWorkerClient } from "../../analysis/worker/GraphWorkerClient"

type Props = {
  graph: Graph
  graphWorker: GraphWorkerClient
  pinned: ReadonlyArray<GraphNodeID>
  togglePinned: TogglePinnedFn
  className?: string
  trackLoading: PromiseTrackerFn
  updateChanges: UpdateChangesFn
  mode: "async" | "modules" | "cycles"
}

function TreePage({
  graph,
  graphWorker,
  pinned,
  togglePinned,
  className,
  trackLoading,
  updateChanges,
  mode: modeId,
}: Props) {
  const { classes, cx } = useStyles()
  const [activeEdgeId, setActiveEdgeId] = useState<GraphEdgeID | null>(null)
  const [activeNodeId, setActiveNodeId] = useState<GraphNodeID | null>(null)
  const [openedNodeIds, setOpenedNodeIds] = useState<GraphNodeID[]>([
    ROOT_NODE_ID,
  ])
  const activeEdge = resolveEdge(graph, activeEdgeId)

  // const selectNode = useCallback(() => async (nextNode: GraphNode) => {
  //   // already opened
  //   if (path.includes(nextNode.id)) return
  //   for (const nodeId of path.reverse()) {
  //     const node = getNode(graph, nodeId)
  //     const chains = await findAllChains(graph, node, nextNode)
  //   }
  // }, [path])

  // Tree Mode -------------------------------------
  const { getChildEdges, renderEmptyChildren, navigatorModes, normalizePath } =
    useMemo(() => {
      const defaults = {
        renderEmptyChildren: () => "Module doesn’t import anything",
      }
      switch (modeId) {
        case "async":
          return {
            ...defaults,
            normalizePath: (path: GraphNodeID[]) =>
              path.filter(
                // remove nodes that don't have async connection to the parent
                (nodeId, index) =>
                  index === 0 ||
                  resolveEdge(graph, getEdgeId(path[index - 1], nodeId))?.async
              ),
            getChildEdges: (node: GraphNode) =>
              graphWorker
                .getAsyncEdges(node, stopOnAsyncModulesFilter)
                .then((ids) => getEdges(graph, ids)),
            renderEmptyChildren: () => "There are no deeper split points",
            navigatorModes: {
              all: {
                getNodes: () =>
                  graphWorker
                    .getAsyncEdges(graph.root)
                    .then((ids) => getEdges(graph, ids))
                    .then((edges) =>
                      uniq(edges.map((edge) => getNode(graph, edge.toId)))
                    ),
                renderTitle: () => "All Async Nodes",
                renderEmpty: () => "Nothing found",
              },
              children: {
                getNodes: () =>
                  graphWorker
                    .getAsyncEdges(
                      resolveNode(
                        graph,
                        resolveEdge(graph, activeEdgeId)?.toId
                      ) || graph.root
                    )
                    .then((ids) => getEdges(graph, ids))
                    .then((edges) =>
                      uniq(edges.map((edge) => getNode(graph, edge.toId)))
                    ),
                renderTitle: () => "Child Async Nodes",
                renderEmpty: () => "Nothing found",
              },
            } as NavigatorModes,
          }
        case "modules":
          return {
            ...defaults,
            normalizePath: (path: GraphNodeID[]) => path,
            getChildEdges: (node: GraphNode) => node.children,
            navigatorModes: {
              enabled: {
                getNodes: () =>
                  graphWorker
                    .getDeepNodeChildren(graph.root, currentGraphFilter)
                    .then((ids) => getNodes(graph, ids)),
                renderTitle: () => "Enabled Nodes",
                renderEmpty: () => "Nothing found",
              },
              children: {
                getNodes: () =>
                  graphWorker
                    .getDeepNodeChildren(
                      resolveNode(
                        graph,
                        resolveEdge(graph, activeEdgeId)?.toId
                      ) || graph.root,
                      currentGraphFilter
                    )
                    .then((ids) => getNodes(graph, ids)),
                renderTitle: () => "Enabled Children",
                renderEmpty: () => "Nothing found",
              },
              all: {
                getNodes: () => getAllNodes(graph),
                renderTitle: () => "All Nodes",
                renderEmpty: () => "Nothing found",
              },
            } as NavigatorModes,
          }
        case "cycles":
          return {
            ...defaults,
            normalizePath: (path: GraphNodeID[]) => path,
            getChildEdges: (node: GraphNode) => node.children,
            navigatorModes: {
              cycles: {
                getNodes: () =>
                  graphWorker
                    .findNodeCycles(graph.root, currentGraphFilter)
                    .then((cycles) =>
                      cycles
                        .map((cycle) => cycle[cycle.length - 1])
                        .map((cycleEnd) => getNode(graph, cycleEnd))
                    ),
                renderTitle: () => "Cycles",
                renderEmpty: () => "Nothing found",
              },
            } as NavigatorModes,
          }
      }
    }, [graph, modeId, activeEdgeId])

  const { value: enabledIds, promise: enabledIdsPromise } = useStablePromise(
    useMemo(async () => {
      const edgeIds = await graphWorker.getEnabledChildEdges(graph.root)
      const nodeIds = getEdges(graph, edgeIds).map((e) => e.toId)
      return [...edgeIds, ...nodeIds]
    }, [graph])
  )
  useEffect(() => {
    trackLoading(enabledIdsPromise)
  }, [enabledIdsPromise, trackLoading])

  const { value: [chains, chainedNodeIds] = [], promise: chainsPromise } =
    useStablePromise(
      useMemo(async () => {
        const activeNode = resolveNode(graph, activeNodeId)
        const chains = activeNode
          ? await graphWorker.findChains(
              graph.root,
              activeNode,
              currentGraphFilter
            )
          : []
        const chainedNodeIds = chains.flat()
        return [chains, chainedNodeIds] as const
      }, [graph, activeNodeId])
    )
  useEffect(() => {
    trackLoading(chainsPromise)
  }, [chainsPromise, trackLoading])

  const openNode = useCallback(
    (toNode: GraphNode) => {
      const run = async () => {
        if (openedNodeIds.includes(toNode.id)) {
          setActiveEdgeId(
            getEdgeId(
              openedNodeIds[openedNodeIds.indexOf(toNode.id) - 1],
              toNode.id
            )
          )
          return
        }
        const activeEdge = resolveEdge(graph, activeEdgeId)
        // Pick starting node that is included on the path
        const fromNode =
          activeEdge && openedNodeIds.includes(activeEdge.toId)
            ? getNode(graph, activeEdge.toId)
            : graph.root
        const openedBeforeFromNode = openedNodeIds.slice(
          0,
          openedNodeIds.findIndex((id) => id === fromNode.id)
        )
        // Try to find connection between currently selected & opening node.
        let chains = await graphWorker.findChains(
          fromNode,
          toNode,
          currentGraphFilter
        )
        // If there's no active connection - pick disabled ones
        if (chains.length === 0) {
          chains = await graphWorker.findChains(fromNode, toNode)
        }
        // Remove chains that would open a dependency cycle (they include an opened node)
        chains = chains.filter(
          (chain) => !chain.some((id) => openedBeforeFromNode.includes(id))
        )
        // If there's no connection from selected node, start from root
        if (fromNode !== graph.root) {
          if (chains.length === 0) {
            chains = await graphWorker.findChains(
              graph.root,
              toNode,
              currentGraphFilter
            )
          }
          if (chains.length === 0) {
            chains = await graphWorker.findChains(graph.root, toNode)
          }
        }
        if (chains.length === 0) {
          throw `Node ${toNode.name || toNode.id} is not connected to anything`
        }
        const chain = chains[0]
        const chainStart = chain[0]
        // Add the found chain to the currently opened path
        setOpenedNodeIds(
          normalizePath([
            ...openedNodeIds.slice(
              0,
              openedNodeIds.findIndex((id) => id === chainStart)
            ),
            ...chain,
          ])
        )
        setActiveEdgeId(
          getEdgeId(chain[chain.length - 2], chain[chain.length - 1])
        )
      }
      trackLoading(run())
    },
    [graph, trackLoading, openedNodeIds, activeEdgeId, normalizePath]
  )

  const selectedTreeLevelRef = useRef<HTMLDivElement>()

  // Scroll selected into view
  useEffect(() => {
    if (!activeEdge || !selectedTreeLevelRef.current) return
    selectedTreeLevelRef.current.scrollIntoView()
  }, [activeEdge, selectedTreeLevelRef])

  // Normalize path after node change
  useEffect(() => {
    openNode(resolveNode(graph, activeEdge?.toId) || graph.root)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeId])

  const selectedTreeLevelIndex = openedNodeIds.lastIndexOf(activeEdge?.toId)
  const treeLevels = openedNodeIds.map((nodeId, index) => (
    <TreeLevel
      key={index}
      levelIndex={index}
      className={classes.treeLevel}
      ref={selectedTreeLevelIndex === index ? selectedTreeLevelRef : null}
      node={getNode(graph, nodeId)}
      childNode={resolveNode(graph, openedNodeIds[index + 1])}
      selectEdge={(edge) => {
        const node = getNode(graph, edge.toId)
        // ignore if this edge is already opened or there's a dependency cycle
        const alreadyOpened = openedNodeIds[index + 1] === node.id
        const belongsToCycle = openedNodeIds
          .slice(0, index + 1)
          .includes(node.id)
        if (!alreadyOpened && !belongsToCycle) {
          const newOpened = [...openedNodeIds.slice(0, index + 1), node.id]
          // check if there's a chain starting with these nodes... if yes - open it
          const chain = chains.find((chain) => chain.includes(node.id))
          if (chain) newOpened.push(...chain.slice(chain.indexOf(node.id) + 1))
          setOpenedNodeIds(newOpened)
        }
        setActiveEdgeId(edge.id)
      }}
      activateNode={(node) => {
        setActiveNodeId(node.id)
      }}
      renderEmpty={renderEmptyChildren}
    />
  ))

  return (
    <div className={cx(className, classes.TreePage)}>
      <TreeContextProvider
        value={{
          graph,
          graphWorker,
          pinned,
          togglePinned,
          enabledIds: enabledIds || [],
          activeEdgeId: activeEdgeId,
          openNode,
          openedNodeIds,
          setOpenedNodeIds,
          activeNodeId,
          setActiveNodeId,
          trackLoading,
          updateChanges,
          chains: chains || [],
          chainedNodeIds: chainedNodeIds || [],
          getChildEdges,
        }}
      >
        <div className={classes.info}>
          <RootInfo />
          <ActiveEdgeInfo />
          <ActiveNodeInfo />
        </div>
        <div className={classes.treeLevels}>{treeLevels}</div>
        <div className={classes.treeShadeLeft}></div>
        <div className={classes.treeShadeRight}></div>
        <Paper className={classes.navigator}>
          <LoadingBoundary fallback={"..."}>
            <NodeNavigator modes={navigatorModes} />
          </LoadingBoundary>
        </Paper>
      </TreeContextProvider>
    </div>
  )
}

const useStyles = makeStyles({ name: "TreePage" })((theme) => ({
  TreePage: {
    flexGrow: 1,
    display: "grid",
    grid: "[info] auto [navigation] 1fr / 1fr 350px",
    gap: theme.spacing(3),
    padding: theme.spacing(3),
  },
  info: {
    gridArea: "info / span 2",
    display: "grid",
    gridAutoFlow: "column",
    gridAutoColumns: "1fr",
    gap: theme.spacing(3),
  },
  treeLevels: {
    position: "relative",
    gridArea: "navigation / 1",
    display: "grid",
    grid: "100% / auto-flow",
    gap: theme.graph.treeLevelGap,
    overflowX: "auto",
    justifyContent: "flex-start",
    marginLeft: `-${theme.spacing(2)}`,
    padding: `0px ${theme.spacing(2)}`,
  },
  treeShadeLeft: {
    gridArea: "navigation / 1",
    width: theme.spacing(2),
    marginLeft: `-${theme.spacing(2)}`,
    background: `linear-gradient(90deg, ${theme.palette.background.default}, transparent)`,
    zIndex: 1,
  },
  treeShadeRight: {
    gridArea: "navigation / 1",
    width: theme.spacing(2),
    justifySelf: "self-end",
    background: `linear-gradient(-90deg, ${theme.palette.background.default}, transparent)`,
    zIndex: 1,
  },

  treeLevel: {
    width: 350,
    height: "100%",
  },
  navigator: {
    gridArea: "navigation / span 1",
    padding: theme.spacing(2),
    display: "grid",
  },
}))

export default TreePage
