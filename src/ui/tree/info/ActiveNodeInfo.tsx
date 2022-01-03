import CenterFocusStrong from "@mui/icons-material/CenterFocusStrong"
import CropFree from "@mui/icons-material/CropFree"
import Flag from "@mui/icons-material/Flag"
import Star from "@mui/icons-material/Star"
import StarBorder from "@mui/icons-material/StarBorder"
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material"
import { startCase } from "lodash"
import { currentGraphFilter } from "../../../analysis/filters"
import { resolveNode } from "../../../analysis/graph"
import EmptyBox from "../../EmptyBox"
import { makeStyles } from "../../makeStyles"
import NodeName from "../../nodes/NodeName"
import NodeSize from "../../nodes/NodeSize"
import PromisedValue from "../../PromisedValue"
import { useTreeContext } from "../TreeContext"
import GroupSizesInfo from "./GroupSizesInfo"

type Props = {
  className?: string
}

const useStyles = makeStyles({ name: "ActiveNodeInfo" })((theme) => ({
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
  ellipsis: {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  scrollable: {
    whiteSpace: "nowrap",
    overflowX: "auto",
  },
}))

export default function ActiveNodeInfo({ className }: Props) {
  const { classes, cx } = useStyles()
  const {
    graph,
    graphWorker,
    activeNodeId,
    openNodeChain,
    pinned,
    togglePinned,
    setActiveNodeId,
  } = useTreeContext()
  const node = resolveNode(graph, activeNodeId)
  const isPinned = pinned.includes(node?.id)

  return (
    <Paper className={cx(className, classes.root)} sx={{ padding: 2 }}>
      <Box className={classes.title}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Active {startCase(node?.kind || "Module")}
        </Typography>
        {node ? (
          <>
            <Tooltip title="Navigate to this module">
              <IconButton onClick={() => openNodeChain([node])}>
                <CenterFocusStrong />
              </IconButton>
            </Tooltip>
            <Tooltip title="Deactivate">
              <IconButton onClick={() => setActiveNodeId(null)}>
                <CropFree />
              </IconButton>
            </Tooltip>
            <IconButton onClick={() => togglePinned({ id: node.id })}>
              {isPinned ? <Star color="warning" /> : <StarBorder />}
            </IconButton>
          </>
        ) : null}
      </Box>
      {node ? (
        <>
          <NodeName node={node} tooltip />
          <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
            {"file"}
          </Typography>
          <Box className={classes.scrollable}>{node.file}</Box>
          <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
            {"imported by"}
          </Typography>
          <Box>
            <PromisedValue
              promise={graphWorker.getEnabledParentEdges(
                node,
                currentGraphFilter
              )}
              render={(edges) =>
                edges.length === 0
                  ? "nothing"
                  : edges.length === 1
                  ? "only 1 module"
                  : `${edges.length} modules`
              }
            />
          </Box>

          <div className={classes.spacer} />

          <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
            {"Dependencies used only by this module: "}
            <NodeSize retainerRootNode={graph.root} node={node} />
          </Typography>
          <GroupSizesInfo retainerRootNode={graph.root} node={node} />

          <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
            {"Dependencies used by this module: "}
            <NodeSize node={node} />
          </Typography>
          <GroupSizesInfo node={node} />
        </>
      ) : (
        <EmptyBox>
          Select module by clicking a <Flag fontSize="inherit" /> on an import
          or clicking an item in the tree below while holding <b>[shift]</b>
        </EmptyBox>
      )}
    </Paper>
  )
}
