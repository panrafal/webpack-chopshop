import { green, red } from "@mui/material/colors"
import { useMemo } from "react"
import { baseGraphFilter, currentGraphFilter } from "../../analysis/filters"
import type { GraphNode } from "../../analysis/graph"
import { formatSize } from "../format"
import { makeStyles } from "../makeStyles"
import PromisedValue from "../PromisedValue"
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
  const { classes } = useStyles()
  const { graph, graphWorker } = useTreeContext()

  const promise = useMemo(async () => {
    const treeSizeCalculator = retainerRootNode
      ? (filter: any) =>
          graphWorker.calculateTreeSizeRetainedByNode(
            retainerRootNode,
            node,
            filter
          )
      : (filter: any) => graphWorker.calculateTreeSize(node, filter)
    return {
      baseTreeSize: await treeSizeCalculator(baseGraphFilter),
      treeSize: await treeSizeCalculator(currentGraphFilter),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph, graphWorker, node, retainerRootNode])

  return (
    <PromisedValue
      promise={promise}
      render={({ baseTreeSize, treeSize }) => (
        <>
          {treeSize != null ? (
            <>
              <span>{formatSize(node.size)}</span>
              {" + "}
              <span>{formatSize(treeSize - node.size)}</span>
            </>
          ) : (
            "disconnected"
          )}
          {baseTreeSize != null &&
          treeSize != null &&
          treeSize !== baseTreeSize ? (
            <span
              className={
                treeSize > baseTreeSize ? classes.bigger : classes.smaller
              }
            >
              {" ("}
              {treeSize > baseTreeSize ? "+" : "-"}
              {formatSize(Math.abs(treeSize - baseTreeSize))}
              {")"}
            </span>
          ) : null}
        </>
      )}
    />
  )
}
