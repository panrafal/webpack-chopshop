import type { Graph, GraphNode } from "../../analysis/graph"

import numeral from "numeral"
import { Tooltip } from "@mui/material"
import Skeleton from "@mui/material/Skeleton"

import {
  calculateTreeSize,
  calculateRetainedTreeSize,
} from "../../analysis/size"
import { useStablePromise } from "../hooks/promises"
import { baseGraphFilter, currentGraphFilter } from "../../analysis/filters"
import ErrorBox from "../ErrorBox"

import { red, green } from "@mui/material/colors"
import { makeStyles } from "../makeStyles"
import { formatSize } from "../format"
import { GraphWorkerClient } from "../../analysis/worker/GraphWorkerClient"
import { useTreeContext } from "../tree/TreeContext"

type Props = {
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

export default function NodeSize({ node, retainerRootNode }: Props) {
  const { classes, cx } = useStyles()
  const { graphWorker } = useTreeContext()
  const treeSizeCalculator = retainerRootNode
    ? (filter) =>
        graphWorker.calculateRetainedTreeSize(retainerRootNode, node, filter)
    : (filter) => graphWorker.calculateTreeSize(node, filter)

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
          <span>{formatSize(node.size)}</span>
          {" + "}
          <span>{formatSize(treeSize - node.size)}</span>
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
          {formatSize(Math.abs(treeSize - baseTreeSize))}
          {")"}
        </span>
      ) : null}
    </>
  )
}
