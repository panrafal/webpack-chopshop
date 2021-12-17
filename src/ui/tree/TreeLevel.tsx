import type { GraphEdge, GraphNode } from "../../analysis/graph"

import classNames from "classnames"
import { Icon } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

import EmptyBox from "../EmptyBox"
import LoadingBoundary from "../LoadingBoundary"
import ElementList from "./ElementList"
import { useTreeContext } from "./TreeContext"
import TreeItem from "./TreeItem"
import { forwardRef } from "react"

type Props = {
  parentNode?: GraphNode | null
  node: GraphNode
  childNode?: GraphNode | null
  selectEdge: (node: GraphEdge) => void
  activateNode: (node: GraphNode) => void
  className?: string
}

const useStyles = makeStyles({
  TreeLevel: {
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
  const { graph, pinned } = useTreeContext()
  const classes = useStyles()
  const edges = node.children
  return (
    <div className={classNames(className, classes.TreeLevel)} ref={ref}>
      <ElementList
        className={classes.list}
        items={edges}
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
