import { Paper } from "@mui/material"
import { first, intersection, isEqual, last, nth, uniq } from "lodash"
import { normalize } from "path/posix"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useVirtual } from "react-virtual"
import { EdgeChain } from "../../analysis/chains"
import {
  currentGraphFilter,
  stopOnAsyncModulesFilter,
} from "../../analysis/filters"
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
import { GraphWorkerClient } from "../../analysis/worker/GraphWorkerClient"
import { UpdateChangesFn } from "../../logic/useGraphState"
import { TogglePinnedFn } from "../../logic/usePinnedState"
import { useStablePromise } from "../hooks/promises"
import { PromiseTrackerFn } from "../hooks/usePromiseTracker"
import LoadingBoundary from "../LoadingBoundary"
import { makeStyles } from "../makeStyles"
import ActiveEdgeInfo from "./info/ActiveEdgeInfo"
import ActiveNodeInfo from "./info/ActiveNodeInfo"
import RootInfo from "./info/RootInfo"
import NodeNavigator, { NavigatorMode, NavigatorModes } from "./NodeNavigator"
import { TreeContextProvider } from "./TreeContext"
import TreeLevel from "./TreeLevel"

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

const getTreeLevelWidth = () => 350

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
  const { classes, cx, theme } = useStyles()
  const [activeEdgeId, setActiveEdgeId] = useState<GraphEdgeID | null>(null)
  const [activeNodeId, setActiveNodeId] = useState<GraphNodeID | null>(null)
  const [openedNodeIds, setOpenedNodeIds] = useState<GraphNodeID[]>([
    ROOT_NODE_ID,
  ])
  const activeEdge = resolveEdge(graph, activeEdgeId)

  // Tree Modes -------------------------------------

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
                getItems: () =>
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
                getItems: () =>
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
                getItems: () =>
                  graphWorker
                    .getDeepNodeChildren(graph.root, currentGraphFilter)
                    .then((ids) => getNodes(graph, ids)),
                renderTitle: () => "Enabled Nodes",
                renderEmpty: () => "Nothing found",
              },
              children: {
                getItems: () =>
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
                getItems: () => getAllNodes(graph),
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
                getItems: () =>
                  graphWorker.findNodeCycles(graph.root, currentGraphFilter),
                getItemNode: (graph, cycle) =>
                  getNode(graph, cycle[cycle.length - 1]),
                activateItem: (cycle, event) => {
                  setActiveNodeId(first(cycle))
                  openNodeChain(getNodes(graph, cycle))
                },
                renderTitle: () => "Cycles",
                renderEmpty: () => "Nothing found",
              } as NavigatorMode<EdgeChain>,
            } as NavigatorModes,
          }
      }
    }, [modeId, graph, graphWorker, activeEdgeId])

  // Analyse tree based on current choice

  const { value: enabledIds, promise: enabledIdsPromise } = useStablePromise(
    useMemo(async () => {
      const edgeIds = await graphWorker.getEnabledChildEdges(graph.root)
      const nodeIds = getEdges(graph, edgeIds).map((e) => e.toId)
      return [...edgeIds, ...nodeIds]
    }, [graph, graphWorker])
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
      }, [graph, activeNodeId, graphWorker])
    )
  useEffect(() => {
    trackLoading(chainsPromise)
  }, [chainsPromise, trackLoading])

  // Smooth scrolling to index ------------------------------

  const treeLevelsRef = useRef<HTMLDivElement>()
  const scrollToTimerRef = useRef<number>()
  const scrollToTreeIndex = useCallback(
    (index) => {
      if (scrollToTimerRef.current)
        cancelAnimationFrame(scrollToTimerRef.current)
      scrollToTimerRef.current = null

      const levelWidth = getTreeLevelWidth()
      const padding = 16
      const left = padding + index * (levelWidth + theme.graph.treeLevelGap)
      const maxScrollLeft = left - padding
      const minScrollLeft = Math.max(
        0,
        maxScrollLeft -
          treeLevelsRef.current.offsetWidth +
          levelWidth +
          2 * padding
      )
      if (
        treeLevelsRef.current.scrollLeft >= minScrollLeft &&
        treeLevelsRef.current.scrollLeft <= maxScrollLeft
      ) {
        // within bounds - nothing to do
        return
      }
      const scrollTo =
        treeLevelsRef.current.scrollLeft > maxScrollLeft
          ? maxScrollLeft
          : minScrollLeft
      console.log("scroll!")
      const diff = scrollTo - treeLevelsRef.current.scrollLeft
      if (Math.abs(diff) > 5) {
        treeLevelsRef.current.scrollLeft += diff / 2
        if (scrollToTimerRef.current)
          cancelAnimationFrame(scrollToTimerRef.current)
        scrollToTimerRef.current = requestAnimationFrame(() =>
          scrollToTreeIndex(index)
        )
      } else {
        treeLevelsRef.current.scrollLeft = scrollTo
      }
    },
    [theme]
  )

  // Opens a specific node or chain of nodes trying not to change the currently opened tree as much as possible
  // To open a cycle, first and last nodes should be the same
  const openNodeChain = useCallback(
    (nodes: ReadonlyArray<GraphNode>) => {
      const run = async () => {
        const nodeIds = nodes.map(({ id }) => id)
        const openingCycle = nodes.length > 1 && first(nodes) === last(nodes)

        // Checks if one array contains another in full
        function includesArray(
          big: ReadonlyArray<any>,
          small: ReadonlyArray<any>
        ) {
          if (big.length < small.length) return false
          for (let i = 0; i <= big.length - small.length; ++i) {
            if (isEqual(big.slice(i, i + small.length), small)) return true
          }
          return false
        }

        // Checks if path prefix doesn't introduce cycles when combined with suffix
        function isCorrectNodePathPrefix(
          prefix: GraphNodeID[],
          suffix: GraphNodeID[]
        ) {
          // prefix cannot contain cycles itself
          if (prefix.length !== uniq(prefix).length) return false
          return intersection(prefix, suffix).length === 0
        }

        // yields chains that lead to the node in order of their usefullness
        async function* findPrefixChains(toNode: GraphNode) {
          const openedIndex = openedNodeIds.indexOf(toNode.id)
          if (openedIndex > 0) {
            // start with currently opened
            yield openedNodeIds.slice(0, openedIndex + 1)
          }
          if (activeEdge && openedNodeIds.includes(activeEdge.id)) {
            const prefix = openedNodeIds.slice(
              0,
              openedNodeIds.indexOf(activeEdge.id)
            )
            // try enabled chains starting from active edge
            let chains = await graphWorker.findChains(
              getNode(graph, activeEdge.toId),
              toNode,
              currentGraphFilter
            )
            yield* chains.map((chain) => [...prefix, ...chain])
            // try all chains starting from active edge
            chains = await graphWorker.findChains(
              getNode(graph, activeEdge.toId),
              toNode,
              currentGraphFilter
            )
            yield* chains.map((chain) => [...prefix, ...chain])
          }
          // enabled chains from root
          yield* await graphWorker.findChains(
            graph.root,
            toNode,
            currentGraphFilter
          )
          // all chains from root
          yield* await graphWorker.findChains(graph.root, toNode)
        }

        let newOpenedNodeIds
        let prefixedNodeIds
        // if path is already opened - don't change it
        if (includesArray(openedNodeIds, normalizePath(nodeIds))) {
          newOpenedNodeIds = openedNodeIds
          prefixedNodeIds = openedNodeIds.slice(
            0,
            openedNodeIds.lastIndexOf(last(nodeIds)) + 1
          )
        } else if (first(nodes) === graph.root) {
          newOpenedNodeIds = nodeIds
        } else {
          // iterate through possible path prefixes. choose the first that creates an acceptable path (without cycles)
          for await (let prefix of findPrefixChains(first(nodes))) {
            prefix = prefix.slice(0, -1) // prefix includes the first node
            if (isCorrectNodePathPrefix(prefix, nodeIds)) {
              newOpenedNodeIds = [...prefix, ...nodeIds]
              break
            }
          }
        }
        // if there's a path to activeNode (and it isn't on the path already) - open it as well
        prefixedNodeIds ??= newOpenedNodeIds
        if (
          newOpenedNodeIds &&
          activeNodeId &&
          !openingCycle &&
          !newOpenedNodeIds.includes(activeNodeId)
        ) {
          for await (let suffix of await graphWorker.findChains(
            getNode(graph, last(newOpenedNodeIds)),
            getNode(graph, activeNodeId)
          )) {
            suffix = suffix.slice(1) // suffix contains the fromNode
            if (isCorrectNodePathPrefix(newOpenedNodeIds, suffix)) {
              newOpenedNodeIds = [...newOpenedNodeIds, ...suffix]
              break
            }
          }
        }
        if (!newOpenedNodeIds) {
          // eslint-disable-next-line no-throw-literal
          throw `Node ${
            first(nodes).name || first(nodes).id
          } is not connected to anything`
        }

        if (prefixedNodeIds.length > 1) {
          setActiveEdgeId(
            getEdgeId(nth(prefixedNodeIds, -2), nth(prefixedNodeIds, -1))
          )
        }

        if (openingCycle) {
          // remove the last cycled node
          newOpenedNodeIds = newOpenedNodeIds.slice(0, -1)
        }

        // activate the last node (or edge if there's a cycle) - ignore the suffixed part leading to active node
        if (newOpenedNodeIds !== openedNodeIds) {
          setOpenedNodeIds(normalizePath(newOpenedNodeIds))
        }
        scrollToTreeIndex(
          Math.min(prefixedNodeIds.length, newOpenedNodeIds.length) - 1
        )
      }
      trackLoading(run())
    },
    [
      trackLoading,
      openedNodeIds,
      normalizePath,
      activeNodeId,
      scrollToTreeIndex,
      activeEdge,
      graphWorker,
      graph,
    ]
  )

  // Normalize path after mode change
  useEffect(() => {
    if (activeEdge) {
      openNodeChain([
        resolveNode(graph, activeEdge.fromId),
        resolveNode(graph, activeEdge.toId),
      ])
    } else {
      openNodeChain([graph.root])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeId])

  const { virtualItems: virtualTreeLevels } = useVirtual({
    size: openedNodeIds.length,
    parentRef: treeLevelsRef,
    horizontal: true,
    estimateSize: useCallback(
      () => getTreeLevelWidth() + theme.graph.treeLevelGap,
      [theme]
    ),
  })

  const treeLevels = openedNodeIds.map((nodeId, index) => {
    if (!virtualTreeLevels.find((vtr) => vtr.index === index))
      return <div key={index} className={classes.treeLevel}></div>
    return (
      <TreeLevel
        key={index}
        levelIndex={index}
        className={classes.treeLevel}
        node={getNode(graph, nodeId)}
        childNode={resolveNode(graph, openedNodeIds[index + 1])}
        activateEdge={(edge) => {
          if (openedNodeIds.includes(edge.toId)) {
            // handle cycles (opening the from->to edge will cause opening a path that doesn't have a cycle)
            openNodeChain([getNode(graph, edge.toId)])
          } else {
            openNodeChain([
              getNode(graph, edge.fromId),
              getNode(graph, edge.toId),
            ])
          }
        }}
        activateNode={(node) => {
          setActiveNodeId(node.id)
        }}
        renderEmpty={renderEmptyChildren}
      />
    )
  })

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
          openNodeChain,
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
        <div className={classes.treeLevels} ref={treeLevelsRef}>
          {treeLevels}
        </div>
        <div className={classes.treeShadeLeft}></div>
        <div className={classes.treeShadeRight}></div>
        <Paper className={classes.navigator}>
          <LoadingBoundary fallback={"..."}>
            <NodeNavigator modes={navigatorModes} key={modeId} />
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
    width: getTreeLevelWidth(),
    height: "100%",
  },
  navigator: {
    gridArea: "navigation / span 1",
    padding: theme.spacing(2),
    display: "grid",
  },
}))

export default TreePage
