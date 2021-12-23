import { Box, Paper, Tooltip, Typography } from "@mui/material"
import { useMemo } from "react"
import {
  allAsyncAndEnabledFilter,
  baseGraphFilter,
  currentGraphFilter,
} from "../../../analysis/filters"
import numeral from "numeral"

import { calculateGroupSizes, calculateTreeSize } from "../../../analysis/size"
import { useStablePromise } from "../../hooks/promises"
import { makeStyles } from "../../makeStyles"
import NodeSize from "../../nodes/NodeSize"
import PromisedValue from "../../PromisedValue"
import { useTreeContext } from "../TreeContext"
import ChangeValue from "../../ChangeValue"
import { GraphNode } from "../../../analysis/graph"
import { formatSize } from "../../format"

type Props = {
  className?: string
  node: GraphNode
}

const useStyles = makeStyles({ name: "GroupSizesInfo" })({
  bar: {
    display: "flex",
    borderRadius: 2,
    overflow: "hidden",
    transition: "opacity 100ms",
    opacity: 1,
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

export default function GroupSizesInfo({ className, node }: Props) {
  const { classes, cx, theme } = useStyles()
  const { graph, graphWorker } = useTreeContext()

  const { value, loading, error } = useStablePromise(
    graphWorker.calculateGroupSizes(graph.root, node, currentGraphFilter)
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
