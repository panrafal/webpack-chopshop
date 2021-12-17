import { GraphNode, resolveEdge } from "../../analysis/graph"

import {
  ListItem,
  ListItemText,
  Typography,
  Icon,
  Menu,
  MenuItem,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
} from "@mui/material"
import BlockIcon from "@mui/icons-material/Block"
import StarIcon from "@mui/icons-material/Star"
import { useMemo, useState } from "react"
import ElementList, { ElementListProps, RenderItemProps } from "./ElementList"
import NodeNavigatorItem, { NodeNavigatorItemProps } from "./NodeNavigatorItem"
import EmptyBox from "../EmptyBox"
import { useStablePromise } from "../hooks/promises"
import { useTreeContext } from "./TreeContext"
import ErrorBox from "../ErrorBox"
import { makeStyles } from "../makeStyles"

export type NavigatorMode = {
  getNodes: () => ReadonlyArray<GraphNode> | Promise<ReadonlyArray<GraphNode>>
  renderTitle: () => React.ReactNode
  renderInfo: () => React.ReactNode
  renderEmpty: () => string
  listProps?: () => Partial<ElementListProps<GraphNode>>
  itemProps?: (a: RenderItemProps<GraphNode>) => Partial<NodeNavigatorItemProps>
}

export type NavigatorModes = Record<string, NavigatorMode>

type Props = {
  className?: string
  modes: NavigatorModes
  defaultMode: string
}

const useStyles = makeStyles({ name: "NodeNavigator" })((theme) => ({
  NodeNavigator: {
    display: "flex",
    position: "relative",
    flexDirection: "column",
    justifyContent: "stretch",
  },
  list: {
    flexGrow: 1,
  },
  listProgress: {
    marginTop: 16,
  },
  modeMenuItem: {
    width: 300,
  },
}))

export default function NodeNavigator({
  className,
  modes,
  defaultMode,
}: Props) {
  const { classes, cx } = useStyles()
  const [modeId, setModeId] = useState(defaultMode)
  const [modeMenuAnchor, setModeMenuAnchor] = useState(null)
  const mode = modes[modeId] || modes[defaultMode]

  const {
    graph,
    pinned,
    togglePinned,
    setActiveNodeId,
    selectedEdgeId,
    openNode,
  } = useTreeContext()

  const nodesPromise = useMemo(() => mode.getNodes(), [mode])

  const { value: nodes, loading, error } = useStablePromise(nodesPromise)

  return (
    <div className={cx(className, classes.NodeNavigator)}>
      <ListItem
        button
        disableGutters
        onClick={(event) => {
          setModeMenuAnchor(event.currentTarget)
        }}
      >
        <ListItemText>
          <Typography variant="h5">{mode.renderTitle()}</Typography>
          <Typography variant="subtitle1" gutterBottom>
            {mode.renderInfo()}
          </Typography>
        </ListItemText>
        <Icon color="action">more_vert</Icon>
      </ListItem>
      <Menu
        anchorEl={modeMenuAnchor}
        open={Boolean(modeMenuAnchor)}
        onClose={() => setModeMenuAnchor(null)}
      >
        {Object.entries(modes).map(([id, mode]) => (
          <MenuItem
            className={classes.modeMenuItem}
            key={id}
            selected={id === modeId}
            onClick={() => {
              setModeId(id)
              setModeMenuAnchor(null)
            }}
          >
            {mode.renderTitle()}
          </MenuItem>
        ))}
      </Menu>
      {<LinearProgress style={{ opacity: loading ? 1 : 0 }} />}
      {error && <ErrorBox error={error} />}
      {nodes && (
        <ElementList
          className={classes.list}
          items={nodes}
          graph={graph}
          pinned={pinned}
          groupItemsBy="package"
          orderItemsBy={undefined}
          orderGroupsBy={[["size"], ["desc"]]}
          renderItem={({ item, ...itemProps }) => (
            <NodeNavigatorItem
              {...itemProps}
              node={item}
              selected={item === resolveEdge(graph, selectedEdgeId)?.to}
              retainerRootNode={graph.root}
              onClick={() => {
                openNode(item)
              }}
              onDoubleClick={() => {
                setActiveNodeId(item.id)
              }}
              {...(mode.itemProps && mode.itemProps({ item, ...itemProps }))}
            >
              {pinned.indexOf(item.id) >= 0 ? (
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => {
                      togglePinned({ id: item.id, set: false })
                    }}
                    size="large"
                  >
                    <StarIcon color="disabled" />
                  </IconButton>
                </ListItemSecondaryAction>
              ) : null}
            </NodeNavigatorItem>
          )}
          renderEmpty={() => (
            <EmptyBox icon={<BlockIcon />}>{mode.renderEmpty()}</EmptyBox>
          )}
        />
      )}
    </div>
  )
}
