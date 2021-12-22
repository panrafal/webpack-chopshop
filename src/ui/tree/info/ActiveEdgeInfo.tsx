import { Box, Paper } from "@mui/material"
import { resolveEdge } from "../../../analysis/graph"
import { getSourceLocation } from "../../../analysis/info"
import { makeStyles } from "../../makeStyles"
import NodeName from "../../nodes/NodeName"
import NodeSize from "../../nodes/NodeSize"
import { useTreeContext } from "../TreeContext"
import GroupSizesInfo from "./GroupSizesInfo"

type Props = {
  className?: string
}

const useStyles = makeStyles({ name: "ActiveEdgeInfo" })({})

export default function ActiveEdgeInfo({ className }: Props) {
  const { classes, cx } = useStyles()
  const { graph, activeEdgeId } = useTreeContext()
  const edge = resolveEdge(graph, activeEdgeId)

  return (
    <Paper className={cx(className)} sx={{ padding: 2 }}>
      {edge ? (
        <>
          <Box>
            From: <NodeName node={edge.from} />
          </Box>
          <Box>
            To: <NodeName node={edge.to} />
          </Box>
          <Box>
            {edge.from.file || null}@{edge.fromLoc || null}
          </Box>
          <Box>Name: {edge.name}</Box>
          <Box>Kind: {edge.kind}</Box>
          <pre>{edge.fromSource}</pre>
          <Box>
            <NodeSize node={edge.to} />
          </Box>
          <GroupSizesInfo node={edge.to} />
          {/* <pre>{JSON.stringify(edge.original, null, "  ")}</pre> */}
        </>
      ) : (
        "..."
      )}
    </Paper>
  )
}
