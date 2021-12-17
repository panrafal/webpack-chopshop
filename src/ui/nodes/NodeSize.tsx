import type { Graph, GraphNode } from "../../analysis/graph"

import numeral from "numeral"
import { Tooltip } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import Skeleton from '@mui/material/Skeleton'

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

import { red, green } from '@mui/material/colors';

type Props = {
  graph: Graph
  retainerRootNode?: GraphNode | null
  node: GraphNode
}

const useStyles = makeStyles((theme) => ({
  bigger: {
    color: red.A700,
  },
  smaller: {
    color: green.A700,
  },
}))

export default function NodeSize({ graph, node, retainerRootNode }: Props) {
  const classes = useStyles()
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
          <Tooltip title="Node size" enterDelay={500}>
            <span>{numeral(node.size).format("0[.]0b")}</span>
          </Tooltip>
          {" + "}
          <Tooltip
            title={
              retainerRootNode
                ? "Size of retained dependencies "
                : "Size of dependencies"
            }
            enterDelay={500}
          >
            <span>{numeral(treeSize - node.size).format("0[.]0b")}</span>
          </Tooltip>
        </>
      ) : (
        "disconnected"
      )}
      {baseTreeSize != null && treeSize !== baseTreeSize ? (
        <Tooltip title="Difference without changes" enterDelay={500}>
          <span
            className={
              treeSize > baseTreeSize ? classes.bigger : classes.smaller
            }
          >
            {" ("}
            {treeSize > baseTreeSize ? "+" : "-"}
            {numeral(Math.abs(treeSize - baseTreeSize)).format("0[.]0b")}
            {")"}
          </span>
        </Tooltip>
      ) : null}
    </>
  )
}
