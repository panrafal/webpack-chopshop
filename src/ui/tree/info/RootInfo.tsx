import { Box, Paper, Typography } from "@mui/material"
import numeral from "numeral"
import { useMemo } from "react"
import {
  allAsyncAndEnabledFilter,
  baseGraphFilter,
  currentGraphFilter,
} from "../../../analysis/filters"
import ChangeValue from "../../ChangeValue"
import { makeStyles } from "../../makeStyles"
import PromisedValue from "../../PromisedValue"
import { useTreeContext } from "../TreeContext"
import GroupSizesInfo from "./GroupSizesInfo"

type Props = {
  className?: string
}

const useStyles = makeStyles({ name: "RootInfo" })((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
  },
  spacer: {
    flexGrow: 1,
  },
}))

export default function RootInfo({ className }: Props) {
  const { classes, cx } = useStyles()
  const { graph, graphWorker } = useTreeContext()

  const sizePromise = useMemo(async () => {
    const currentSize = await graphWorker.calculateTreeSize(
      graph.root,
      currentGraphFilter
    )
    const baseSize = await graphWorker.calculateTreeSize(
      graph.root,
      baseGraphFilter
    )
    const overallSize = await graphWorker.calculateTreeSize(
      graph.root,
      allAsyncAndEnabledFilter
    )
    return { currentSize, baseSize, overallSize }
  }, [graph])

  return (
    <Paper className={cx(className, classes.root)}>
      <Typography variant="h6" sx={{ marginBottom: 1 }}>
        Project
      </Typography>
      <Box>
        {"Loaded "}
        <PromisedValue
          promise={sizePromise}
          render={({ currentSize, overallSize }) => (
            <b>{Math.round((currentSize / overallSize) * 100)}%</b>
          )}
        />
        {" of split points ("}
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
        {")"}
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
        {" difference in size"}
      </Box>
      <div className={classes.spacer} />
      <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
        Loaded modules breakdown
      </Typography>
      <GroupSizesInfo node={graph.root} />
      <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
        All modules breakdown
      </Typography>
      <GroupSizesInfo node={graph.root} filter={allAsyncAndEnabledFilter} />
    </Paper>
  )
}
