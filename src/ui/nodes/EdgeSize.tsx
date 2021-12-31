import { green, red } from "@mui/material/colors"
import { useMemo } from "react"
import { baseGraphFilter, currentGraphFilter } from "../../analysis/filters"
import { getNode, GraphEdge, GraphNode } from "../../analysis/graph"
import { formatSize } from "../format"
import { makeStyles } from "../makeStyles"
import PromisedValue from "../PromisedValue"
import { useTreeContext } from "../tree/TreeContext"

type Props = {
  retainerRootNode: GraphNode | null
  edge: GraphEdge
}

const useStyles = makeStyles({ name: "EdgeSize" })((theme) => ({
  bigger: {
    color: red.A700,
  },
  smaller: {
    color: green.A700,
  },
}))

export default function EdgeSize({ edge, retainerRootNode }: Props) {
  const { classes } = useStyles()
  const { graph, graphWorker } = useTreeContext()
  const node = getNode(graph, edge.toId)

  const promise = useMemo(async () => {
    return {
      baseTreeSize: await graphWorker.calculateTreeSizeRetainedByEdge(
        retainerRootNode,
        edge,
        baseGraphFilter
      ),
      treeSize: await graphWorker.calculateTreeSizeRetainedByEdge(
        retainerRootNode,
        edge,
        currentGraphFilter
      ),
      nodeTreeSize: await graphWorker.calculateTreeSizeRetainedByNode(
        retainerRootNode,
        node,
        currentGraphFilter
      ),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph, graphWorker, node, retainerRootNode])

  return (
    <PromisedValue
      promise={promise}
      render={({ baseTreeSize, treeSize, nodeTreeSize }) => (
        <>
          <span>{formatSize(treeSize)}</span>
          {baseTreeSize != null && treeSize !== baseTreeSize ? (
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

          {nodeTreeSize > 0 && nodeTreeSize !== treeSize ? (
            <>
              {" / "}
              <span>{formatSize(nodeTreeSize)}</span>
            </>
          ) : null}
        </>
      )}
    />
  )
}
