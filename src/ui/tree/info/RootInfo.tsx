import { Box, Paper, Typography } from "@mui/material"
import { useMemo } from "react"
import {
  allAsyncAndEnabledFilter,
  baseGraphFilter,
  currentGraphFilter,
} from "../../../analysis/dependencies"
import numeral from "numeral"

import { calculateTreeSize } from "../../../analysis/size"
import { useStablePromise } from "../../hooks/promises"
import { makeStyles } from "../../makeStyles"
import NodeSize from "../../nodes/NodeSize"
import PromisedValue from "../../PromisedValue"
import { useTreeContext } from "../TreeContext"
import ChangeValue from "../../ChangeValue"

type Props = {
  className?: string
}

const useStyles = makeStyles({ name: "RootInfo" })({})

export default function RootInfo({ className }: Props) {
  const { classes, cx } = useStyles()
  const { graph } = useTreeContext()

  const sizePromise = useMemo(async () => {
    const currentSize = await calculateTreeSize(graph, graph.root, {
      filter: currentGraphFilter,
    })
    const baseSize = await calculateTreeSize(graph, graph.root, {
      filter: baseGraphFilter,
    })
    const overallSize = await calculateTreeSize(graph, graph.root, {
      filter: allAsyncAndEnabledFilter,
    })
    return { currentSize, baseSize, overallSize }
  }, [graph])

  return (
    <Paper className={cx(className)} sx={{ padding: 2 }}>
      <Box>
        {"Loaded "}
        <PromisedValue
          promise={sizePromise}
          render={({ currentSize, overallSize }) => (
            <b>{Math.round((currentSize / overallSize) * 100)}%</b>
          )}
        />
        {", "}
        <PromisedValue
          promise={sizePromise}
          render={({ currentSize }) => (
            <b>{numeral(currentSize).format("0[.]0b")}</b>
          )}
        />
        {" of "}
        <PromisedValue
          promise={sizePromise}
          render={({ overallSize }) => (
            <b>{numeral(overallSize).format("0[.]0b")}</b>
          )}
        />
      </Box>
      <Box>
        {"Changes give "}
        <PromisedValue
          promise={sizePromise}
          render={({ currentSize, baseSize }) => (
            <b>
              <ChangeValue
                value={currentSize - baseSize}
                desc
                format="0[.]0b"
              />
            </b>
          )}
        />
        {" difference"}
      </Box>
    </Paper>
  )
}