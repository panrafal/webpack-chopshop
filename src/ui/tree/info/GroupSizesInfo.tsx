import { Tooltip } from "@mui/material"
import { currentGraphFilter } from "../../../analysis/filters"
import { GraphEdge, GraphNode } from "../../../analysis/graph"
import { formatSize } from "../../format"
import { useStablePromise } from "../../hooks/promises"
import { makeStyles } from "../../makeStyles"
import { useTreeContext } from "../TreeContext"

type Props = {
  className?: string
  node: GraphNode
  retainerRootNode?: GraphNode
  filter?: (e: GraphEdge) => boolean
}

const useStyles = makeStyles({ name: "GroupSizesInfo" })({
  bar: {
    display: "flex",
    borderRadius: 2,
    overflow: "hidden",
    transition: "opacity 100ms",
    opacity: 1,
    height: 16,
    background: "#333",
  },
  loading: {
    opacity: 0.5,
  },
  part: {
    transition: "width 100ms",
    overflow: "hidden",
    textIndent: 4,
    marginRight: 1,
    fontSize: 10,
    "&:last-child": { marginRight: 0 },
    whiteSpace: "nowrap",
  },
})

export default function GroupSizesInfo({
  className,
  node,
  retainerRootNode,
  filter = currentGraphFilter,
}: Props) {
  const { classes, cx, theme } = useStyles()
  const { graphWorker } = useTreeContext()

  const { value, loading, error } = useStablePromise(
    graphWorker.calculateGroupSizes(retainerRootNode, node, filter)
  )
  const groups = value || []
  const overalSize = groups.reduce((sum, { size }) => sum + size, 0)

  return (
    <div
      className={cx(
        className,
        classes.bar,
        (loading || error) && classes.loading
      )}
    >
      {groups.map(({ group, count, size }) => (
        <Tooltip
          key={group.name}
          title={`${group.name}: ${formatSize(size)} in ${count} modules`}
        >
          <div
            className={classes.part}
            style={{
              background: theme.palette[group.colorName].main,
              color: theme.palette[group.colorName].contrastText,
              width: `${Math.max(
                1,
                Math.round(((size || 1) / (overalSize || 1)) * 100)
              )}%`,
            }}
          >
            {group.name.toLocaleUpperCase()} ({formatSize(size)})
          </div>
        </Tooltip>
      ))}
    </div>
  )
}
