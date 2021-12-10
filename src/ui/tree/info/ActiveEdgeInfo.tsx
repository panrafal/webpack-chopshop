import Flag from "@mui/icons-material/Flag"
import Star from "@mui/icons-material/Star"
import StarBorder from "@mui/icons-material/StarBorder"
import {
  alpha,
  Box,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material"
import SyntaxHighlighter from "react-syntax-highlighter"
import syntaxStyle from "react-syntax-highlighter/dist/esm/styles/hljs/hybrid"
import { getNode, resolveEdge, resolveNode } from "../../../analysis/graph"
import EmptyBox from "../../EmptyBox"
import { makeStyles } from "../../makeStyles"
import NodeName from "../../nodes/NodeName"
import NodeSize from "../../nodes/NodeSize"
import { useTreeContext } from "../TreeContext"
import GroupSizesInfo from "./GroupSizesInfo"

type Props = {
  className?: string
}

const useStyles = makeStyles({ name: "ActiveEdgeInfo" })((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
  },
  spacer: {
    flexGrow: 1,
  },
  title: {
    display: "grid",
    grid: "1fr / 1fr",
    gridAutoFlow: "column",
  },
  code: {
    margin: 0,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
    borderRadius: 2,
  },
}))

export default function ActiveEdgeInfo({ className }: Props) {
  const { classes, cx } = useStyles()
  const {
    graph,
    activeEdgeId,
    setActiveNodeId,
    activeNodeId,
    pinned,
    togglePinned,
  } = useTreeContext()
  const edge = resolveEdge(graph, activeEdgeId)
  const fromNode = resolveNode(graph, edge?.fromId)
  const isPinned = edge ? pinned.includes(edge.toId) : false
  return (
    <Paper className={cx(className, classes.root)}>
      <Box className={classes.title}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Active Import
        </Typography>
        {edge ? (
          <>
            <Tooltip title="Set as active module">
              <IconButton
                onClick={() => setActiveNodeId(edge.toId)}
                disabled={activeNodeId === edge.toId}
              >
                <Flag />
              </IconButton>
            </Tooltip>
            <IconButton onClick={() => togglePinned({ id: edge.toId })}>
              {isPinned ? <Star color="warning" /> : <StarBorder />}
            </IconButton>
          </>
        ) : null}
      </Box>
      {edge && fromNode ? (
        <>
          <NodeName node={getNode(graph, edge.toId)} tooltip />
          <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
            {"imported by"}
          </Typography>
          <NodeName node={fromNode} tooltip />
          {edge.fromSource ? (
            <SyntaxHighlighter
              language="javascript"
              style={syntaxStyle}
              className={classes.code}
            >
              {edge.fromSource || ""}
            </SyntaxHighlighter>
          ) : null}

          <div className={classes.spacer} />

          <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
            {"Dependencies used only by this module: "}
            <NodeSize
              retainerRootNode={graph.root}
              node={getNode(graph, edge.toId)}
            />
          </Typography>
          <GroupSizesInfo
            retainerRootNode={graph.root}
            node={getNode(graph, edge.toId)}
          />

          <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
            {"Dependencies used by this module: "}
            <NodeSize node={getNode(graph, edge.toId)} />
          </Typography>
          <GroupSizesInfo node={getNode(graph, edge.toId)} />
        </>
      ) : (
        <EmptyBox>Select import in the tree below</EmptyBox>
      )}
    </Paper>
  )
}
