import type { GraphEdge, GraphNode } from "../../analysis/graph"

import { Icon, LinearProgress } from "@mui/material"

import EmptyBox from "../EmptyBox"
import ElementList from "./ElementList"
import { useTreeContext } from "./TreeContext"
import TreeItem from "./TreeItem"
import { forwardRef } from "react"
import { makeStyles } from "../makeStyles"
import { useStablePromise } from "../hooks/promises"
import ErrorBox from "../ErrorBox"

type Props = {
  parentNode?: GraphNode | null
  node: GraphNode
  childNode?: GraphNode | null
  selectEdge: (node: GraphEdge) => void
  activateNode: (node: GraphNode) => void
  className?: string
}

const useStyles = makeStyles({ name: "TreeLevel" })({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  list: {
    flexGrow: 1,
  },
})

function TreeLevel(
  { node, childNode, selectEdge, activateNode, className }: Props,
  ref
) {
  const { graph, pinned, getChildEdges } = useTreeContext()
  const { classes, cx } = useStyles()
  const { value: edges, loading, error } = useStablePromise(getChildEdges(node))
  return (
    <div className={cx(className, classes.root)} ref={ref}>
      <LinearProgress
        sx={{
          position: "absolute",
          visibility: loading ? "visible" : "hidden",
        }}
      />
      {error && <ErrorBox error={error} />}
      <ElementList
        className={classes.list}
        items={edges || []}
        graph={graph}
        pinned={pinned}
        renderItem={({ item, ...itemProps }) => (
          <TreeItem
            {...itemProps}
            edge={item}
            selected={item.to === childNode}
            retainerRootNode={graph.root}
            onClick={() => {
              selectEdge(item)
            }}
            onDoubleClick={() => {
              activateNode(item.to)
            }}
            // checked={selected ? selected.id === itemProps.node.id : false}
          />
        )}
        renderEmpty={() => (
          <EmptyBox icon={<Icon>block</Icon>}>Yada yada</EmptyBox>
        )}
      />
    </div>
  )
}

export default forwardRef(TreeLevel)
