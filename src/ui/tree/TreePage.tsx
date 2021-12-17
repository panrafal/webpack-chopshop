import { createRef, useCallback, useEffect, useMemo, useState } from "react"
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
  currentGraphFilter,
  getDeepNodeChildren,
  getEnabledChildEdges,
} from "../../analysis/dependencies"
import { findChains } from "../../analysis/chains"
import { useStablePromise } from "../hooks/promises"
import { TreeContextProvider } from "./TreeContext"
import { UpdateChangesFn } from "../../logic/useGraphState"
import NodeNavigator, { NavigatorModes } from "./NodeNavigator"
import { TogglePinnedFn } from "../../logic/usePinnedState"
import LoadingBoundary from "../LoadingBoundary"
import { PromiseTrackerFn } from "../hooks/usePromiseTracker"
import { makeStyles } from "../makeStyles"

type Props = {
  graph: Graph
  pinned: ReadonlyArray<GraphNodeID>
  togglePinned: TogglePinnedFn
  className?: string
  trackLoading: PromiseTrackerFn
  updateChanges: UpdateChangesFn
}

const useStyles = makeStyles({ name: "TreePage" })((theme) => ({
  TreePage: {
    flexGrow: 1,
    display: "grid",
    grid: "[info] auto [navigation] 100% / 1fr 1fr 1fr",
    gap: theme.spacing(3),
    padding: theme.spacing(3),
  },
  info: {
    gridArea: "info / span 4",
  },
  treeLevels: {
    position: "relative",
    gridArea: "navigation / span 3",
    display: "grid",
    grid: "100% / auto-flow",
    gap: theme.spacing(2),
    overflowX: "auto",
    justifyContent: "flex-start",
    marginLeft: -theme.spacing(2),
    "&:before": {
      content: '""',
      display: "block",
      position: "sticky",
      left: 0,
      top: 0,
      width: theme.spacing(2),
      marginRight: -theme.spacing(2),
      height: "100%",
      background: `linear-gradient(90deg, ${theme.palette.background.default}, transparent)`,
      zIndex: 1,
    },
    "&:after": {
      content: '""',
      display: "block",
      position: "sticky",
      right: 0,
      top: 0,
      width: theme.spacing(2),
      marginLeft: -theme.spacing(2),
      height: "100%",
      background: `linear-gradient(-90deg, ${theme.palette.background.default}, transparent)`,
      zIndex: 1,
    },
  },

  treeLevel: {
    width: 300,
    height: "100%",
    flexShrink: 0,
    flexGrow: 0,
  },
  navigator: {
    gridArea: "navigation / span 1",
  },
}))

function TreePage({
  graph,
  pinned,
  togglePinned,
  className,
  trackLoading,
  updateChanges,
}: Props) {
  const { classes, cx } = useStyles()
  const [selectedEdgeId, setSelectedEdgeId] = useState<GraphEdgeID | null>(null)
  const [activeNodeId, setActiveNodeId] = useState<GraphNodeID | null>(null)
  const [openedNodeIds, setOpenedNodeIds] = useState<GraphNodeID[]>([
    ROOT_NODE_ID,
  ])
  const selectedEdge = resolveEdge(graph, selectedEdgeId)

  // const selectNode = useCallback(() => async (nextNode: GraphNode) => {
  //   // already opened
  //   if (path.includes(nextNode.id)) return
  //   for (const nodeId of path.reverse()) {
  //     const node = getNode(graph, nodeId)
  //     const chains = await findAllChains(graph, node, nextNode)
  //   }
  // }, [path])

  const { value: enabledIds, promise: enabledIdsPromise } = useStablePromise(
    useMemo(async () => {
      const edgeIds = await getEnabledChildEdges(graph, graph.root)
      const nodeIds = getEdges(graph, edgeIds).map((e) => e.to.id)
      return [...edgeIds, ...nodeIds]
    }, [graph])
  )
  trackLoading(enabledIdsPromise)

  const { value: [chains, chainedNodeIds] = [], promise: chainsPromise } =
    useStablePromise(
      useMemo(async () => {
        const activeNode = resolveNode(graph, activeNodeId)
        const chains = activeNode
          ? await findChains(graph, graph.root, activeNode)
          : []
        const chainedNodeIds = chains.flat()
        return [chains, chainedNodeIds] as const
      }, [graph, activeNodeId])
    )
  trackLoading(chainsPromise)

  const openNode = useCallback(
    (toNode: GraphNode) => {
      const run = async () => {
        const selectedEdge = resolveEdge(graph, selectedEdgeId)
        // Pick starting node that is included on the path
        const fromNode =
          selectedEdge && openedNodeIds.includes(selectedEdge.to.id)
            ? selectedEdge.to
            : graph.root
        // Try to find connection between currently selected & opening node.
        let chains = await findChains(graph, fromNode, toNode, {
          filter: currentGraphFilter,
        })
        // If there's no active connection - pick disabled ones
        if (chains.length === 0) {
          chains = await findChains(graph, fromNode, toNode)
        }
        // If there's no connection from selected node, start from root
        if (fromNode !== graph.root) {
          if (chains.length === 0) {
            chains = await findChains(graph, graph.root, toNode, {
              filter: currentGraphFilter,
            })
          }
          if (chains.length === 0) {
            chains = await findChains(graph, graph.root, toNode)
          }
        }
        if (chains.length === 0) {
          throw `Node ${toNode.name || toNode.id} is not connected to anything`
        }
        const chain = chains[0]
        const chainStart = chain[0]
        // Add the found chain to the currently opened path
        setOpenedNodeIds([
          ...openedNodeIds.slice(
            0,
            openedNodeIds.findIndex((id) => id === chainStart)
          ),
          ...chain,
        ])
        setSelectedEdgeId(
          getEdgeId(chain[chain.length - 2], chain[chain.length - 1])
        )
      }
      trackLoading(run())
    },
    [graph, trackLoading, openedNodeIds, selectedEdgeId]
  )

  const selectedTreeLevelRef = createRef<HTMLDivElement>()

  useEffect(() => {
    if (!selectedEdge || !selectedTreeLevelRef.current) return
    selectedTreeLevelRef.current.scrollIntoView()
  }, [selectedEdge, selectedTreeLevelRef])

  const selectedTreeLevelIndex = openedNodeIds.lastIndexOf(selectedEdge?.to.id)
  const treeLevels = openedNodeIds.map((nodeId, index) => (
    <TreeLevel
      key={index}
      className={classes.treeLevel}
      ref={selectedTreeLevelIndex === index ? selectedTreeLevelRef : null}
      node={getNode(graph, nodeId)}
      childNode={resolveNode(graph, openedNodeIds[index + 1])}
      selectEdge={(edge) => {
        const node = edge.to
        if (openedNodeIds[index + 1] !== node.id) {
          const newOpened = [...openedNodeIds.slice(0, index + 1), node.id]
          // check if there's a chain starting with these nodes... if yes - open it
          const chain = chains.find((chain) => chain.includes(node.id))
          if (chain) newOpened.push(...chain.slice(chain.indexOf(node.id) + 1))
          setOpenedNodeIds(newOpened)
        }
        setSelectedEdgeId(edge.id)
      }}
      activateNode={(node) => {
        setActiveNodeId(node.id)
      }}
    />
  ))

  const navigatorModes: NavigatorModes = useMemo(
    () => ({
      all: {
        getNodes: () => getAllNodes(graph),
        renderTitle: () => "All Nodes",
        renderInfo: () => "Select node to start from",
        renderEmpty: () => "Nothing found",
      },
      enabled: {
        getNodes: () =>
          getDeepNodeChildren(graph, graph.root, {
            filter: currentGraphFilter,
          }).then((ids) => getNodes(graph, ids)),
        renderTitle: () => "Enabled Nodes",
        renderInfo: () => "Select node to start from",
        renderEmpty: () => "Nothing found",
      },
      children: {
        getNodes: () =>
          getDeepNodeChildren(
            graph,
            resolveEdge(graph, selectedEdgeId)?.to || graph.root,
            {
              filter: currentGraphFilter,
            }
          ).then((ids) => getNodes(graph, ids)),
        renderTitle: () => "Enabled Children",
        renderInfo: () => "Select node to start from",
        renderEmpty: () => "Nothing found",
      },
    }),
    [graph, selectedEdgeId]
  )

  return (
    <div className={cx(className, classes.TreePage)}>
      <TreeContextProvider
        value={{
          graph,
          pinned,
          togglePinned,
          enabledIds: enabledIds || [],
          selectedEdgeId,
          openNode,
          openedNodeIds,
          setOpenedNodeIds,
          activeNodeId,
          setActiveNodeId,
          trackLoading,
          updateChanges,
          chains: chains || [],
          chainedNodeIds: chainedNodeIds || [],
        }}
      >
        <div className={classes.info}></div>
        <div className={classes.treeLevels}>{treeLevels}</div>
        <LoadingBoundary fallback={"..."}>
          <NodeNavigator
            className={classes.navigator}
            modes={navigatorModes}
            defaultMode="children"
          />
        </LoadingBoundary>
      </TreeContextProvider>
    </div>
  )
}

export default TreePage
