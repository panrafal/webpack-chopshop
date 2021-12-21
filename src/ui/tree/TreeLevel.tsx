import type { GraphEdge, GraphNode } from "../../analysis/graph"

import { Icon, LinearProgress } from "@mui/material"
import BlockIcon from "@mui/icons-material/Block"

import EmptyBox from "../EmptyBox"
import ElementList from "./ElementList"
import { useTreeContext } from "./TreeContext"
import TreeItem from "./TreeItem"
import { forwardRef, ReactNode, useMemo } from "react"
import { makeStyles } from "../makeStyles"
import { useStablePromise } from "../hooks/promises"
import ErrorBox from "../ErrorBox"
import NodeName from "../nodes/NodeName"

type Props = {
  parentNode?: GraphNode | null
  node: GraphNode
  childNode?: GraphNode | null
  selectEdge: (node: GraphEdge) => void
  activateNode: (node: GraphNode) => void
  className?: string
  levelIndex: number
  renderEmpty: () => ReactNode
}

const useStyles = makeStyles({ name: "TreeLevel" })((theme) => {
  const railWidth = theme.graph.treeRailSize
  return {
    root: {
      display: "flex",
      flexDirection: "column",
    },
    list: {
      flexGrow: 1,
    },
    listContainer: {
      marginLeft: -theme.graph.treeLevelGap / 2 - railWidth / 2,
      marginRight: -theme.graph.treeLevelGap / 2 - railWidth / 2,
    },
    rail: {
      width: railWidth,
      background: theme.graph.treeRailColor,
      position: "absolute",
      top: theme.graph.treeItemHeight / 2,
      bottom: theme.graph.treeItemHeight / 2,
      borderRadius: railWidth,
    },
    left: {
      left: 0,
    },
    right: {
      right: 0,
    },
  }
})

function TreeLevel(
  {
    node,
    childNode,
    selectEdge,
    activateNode,
    className,
    levelIndex,
    renderEmpty,
  }: Props,
  ref
) {
  const { graph, pinned, getChildEdges, chainedNodeIds, activeNodeId } =
    useTreeContext()
  const { classes, cx } = useStyles()
  const { value: edges, loading, error } = useStablePromise(getChildEdges(node))
  const stickyItems = useMemo(
    () =>
      [
        ...(edges || []).filter((e) => e.to === childNode),
        ...(edges || []).filter((e) => e.to.id === activeNodeId),
        ...(edges || []).filter((e) => chainedNodeIds.includes(e.to.id)),
      ].slice(0, 5),
    [activeNodeId, chainedNodeIds, childNode, edges]
  )

  return (
    <div className={cx(className, classes.root)} ref={ref}>
      <LinearProgress
        sx={{
          position: "absolute",
          visibility: loading ? "visible" : "hidden",
        }}
      />
      {error && <ErrorBox error={error} />}
      <NodeName node={node} />
      <ElementList
        className={classes.list}
        listClassName={classes.listContainer}
        items={edges || []}
        graph={graph}
        pinned={pinned}
        itemSize={64}
        stickyItems={stickyItems}
        renderItem={({ item, ...itemProps }) => (
          <TreeItem
            {...itemProps}
            edge={item}
            levelIndex={levelIndex}
            selected={item.to === childNode}
            retainerRootNode={graph.root}
            onClick={(event) => {
              if (event.shiftKey) {
                activateNode(item.to)
              }
              selectEdge(item)
            }}
            onDoubleClick={() => {
              activateNode(item.to)
            }}
            // checked={selected ? selected.id === itemProps.node.id : false}
          />
        )}
        renderEmpty={() => <EmptyBox>{renderEmpty()}</EmptyBox>}
      >
        <div className={cx(classes.rail, classes.left)} />
        <div className={cx(classes.rail, classes.right)} />
      </ElementList>
    </div>
  )
}

export default forwardRef(TreeLevel)
