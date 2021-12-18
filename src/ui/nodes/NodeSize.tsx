import type { Graph, GraphNode } from "../../analysis/graph"

import numeral from "numeral"
import { Tooltip } from "@mui/material"
import Skeleton from "@mui/material/Skeleton"

import {
  calculateTreeSize,
  calculateRetainedTreeSize,
} from "../../analysis/size"
import { useStablePromise } from "../hooks/promises"
import {
  baseGraphFilter,
  currentGraphFilter,
} from "../../analysis/dependencies"
import ErrorBox from "../ErrorBox"

import { red, green } from "@mui/material/colors"
import { makeStyles } from "../makeStyles"

type Props = {
  graph: Graph
  retainerRootNode?: GraphNode | null
  node: GraphNode
}

const useStyles = makeStyles({ name: "NodeSize" })((theme) => ({
  bigger: {
    color: red.A700,
  },
  smaller: {
    color: green.A700,
  },
}))

export default function NodeSize({ graph, node, retainerRootNode }: Props) {
  const { classes, cx } = useStyles()
  const treeSizeCalculator = retainerRootNode
    ? (filter) =>
        calculateRetainedTreeSize(graph, retainerRootNode, node, { filter })
    : (filter) => calculateTreeSize(graph, node, { filter })

  const {
    value: baseTreeSize,
    loading: baseLoading,
    error: baseError,
  } = useStablePromise(treeSizeCalculator(baseGraphFilter))
  const {
    value: treeSize,
    loading: currentLoading,
    error: currentError,
  } = useStablePromise(treeSizeCalculator(currentGraphFilter))
  if (baseLoading || currentLoading) return <Skeleton variant="text" />
  if (baseError || currentError)
    return <ErrorBox>"Failed to calculate size"</ErrorBox>

  return (
    <>
      {!retainerRootNode || treeSize > 0 ? (
        <>
          <span>{numeral(node.size).format("0[.]0b")}</span>
          {" + "}
          <span>{numeral(treeSize - node.size).format("0[.]0b")}</span>
        </>
      ) : (
        "disconnected"
      )}
      {baseTreeSize != null && treeSize !== baseTreeSize ? (
        <span
          className={treeSize > baseTreeSize ? classes.bigger : classes.smaller}
        >
          {" ("}
          {treeSize > baseTreeSize ? "+" : "-"}
          {numeral(Math.abs(treeSize - baseTreeSize)).format("0[.]0b")}
          {")"}
        </span>
      ) : null}
    </>
  )
}
