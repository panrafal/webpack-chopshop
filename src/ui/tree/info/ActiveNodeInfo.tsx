import { Box, Paper } from "@mui/material"
import { resolveNode } from "../../../analysis/graph"
import { makeStyles } from "../../makeStyles"
import NodeName from "../../nodes/NodeName"
import NodeSize from "../../nodes/NodeSize"
import { useTreeContext } from "../TreeContext"
import GroupSizesInfo from "./GroupSizesInfo"

type Props = {
  className?: string
}

const useStyles = makeStyles({ name: "ActiveNodeInfo" })({})

export default function ActiveNodeInfo({ className }: Props) {
  const { classes, cx } = useStyles()
  const { graph, activeNodeId } = useTreeContext()
  const node = resolveNode(graph, activeNodeId)

  return (
    <Paper className={cx(className)} sx={{ padding: 2 }}>
      {node ? (
        <>
          <Box>
            <NodeName node={node} />
          </Box>
          <Box>Name: {node.name}</Box>
          <Box>Kind: {node.kind}</Box>
          <Box>File: {node.file}</Box>
          <Box>Id: {node.id}</Box>
          {/* <Box>Exports: {(node.exports || []).join(", ")}</Box>
          <Box>Used Exports: {(node.usedExports || []).join(", ")}</Box> */}
          <Box>
            <NodeSize node={node} />
          </Box>
          <GroupSizesInfo node={node} />
          {/* <pre>{JSON.stringify(node.original, null, "  ")}</pre> */}
        </>
      ) : (
        "..."
      )}
    </Paper>
  )
}
