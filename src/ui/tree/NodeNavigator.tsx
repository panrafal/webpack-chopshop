import BlockIcon from "@mui/icons-material/Block"
import StarIcon from "@mui/icons-material/Star"
import {
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  ListItemSecondaryAction,
  MenuItem,
  Select,
} from "@mui/material"
import { MouseEvent, useMemo, useState } from "react"
import { Graph, GraphNode } from "../../analysis/graph"
import EmptyBox from "../EmptyBox"
import ErrorBox from "../ErrorBox"
import { useStablePromise } from "../hooks/promises"
import { makeStyles } from "../makeStyles"
import ElementList, { ElementListProps, RenderItemProps } from "./ElementList"
import NodeNavigatorItem, { NodeNavigatorItemProps } from "./NodeNavigatorItem"
import { useTreeContext } from "./TreeContext"

export type NavigatorMode<T> = {
  getItems: () => ReadonlyArray<T> | Promise<ReadonlyArray<T>>
  getItemNode?: (graph: Graph, item: T) => GraphNode
  activateItem?: (item: T, event: MouseEvent<any>) => void
  renderTitle: () => React.ReactNode
  renderEmpty: () => string
  listProps?: () => Partial<ElementListProps<T>>
  itemProps?: (a: RenderItemProps<T>) => Partial<NodeNavigatorItemProps>
}

export type NavigatorModes = Record<string, NavigatorMode<any>>

type Props = {
  className?: string
  modes: NavigatorModes
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
}))

export default function NodeNavigator({ className, modes }: Props) {
  const { classes, cx } = useStyles()
  const [modeId, setModeId] = useState(null)
  const defaultModeId = Object.keys(modes)[0]
  const [modeMenuAnchor, setModeMenuAnchor] = useState(undefined)
  const mode = modes[modeId] || modes[defaultModeId]

  const {
    graph,
    pinned,
    togglePinned,
    setActiveNodeId,
    activeEdgeId,
    openNode,
  } = useTreeContext()

  const { getItemNode = (_, item) => item } = mode

  const nodesPromise = useMemo(() => mode.getItems(), [mode])

  const { value: nodes, loading, error } = useStablePromise(nodesPromise)

  return (
    <div className={cx(className, classes.NodeNavigator)}>
      <FormControl fullWidth>
        <InputLabel id="NodeNavigator-mode-label">Display</InputLabel>
        <Select
          labelId="NodeNavigator-mode-label"
          value={modes[modeId] ? modeId : defaultModeId}
          label="Display"
          onChange={() => {}}
        >
          {Object.entries(modes).map(([id, mode]) => (
            <MenuItem
              key={id}
              value={id}
              onClick={() => {
                setModeId(id)
              }}
            >
              {mode.renderTitle()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {
        <LinearProgress
          style={{ visibility: loading ? "visible" : "hidden" }}
        />
      }
      {error && <ErrorBox error={error} />}
      {nodes && (
        <ElementList
          className={classes.list}
          items={nodes}
          getNode={getItemNode}
          graph={graph}
          pinned={pinned}
          groupItemsBy="package"
          orderItemsBy={undefined}
          orderGroupsBy={[["size"], ["desc"]]}
          renderItem={({ item, ...itemProps }) => {
            const node = getItemNode(graph, item)
            return (
              <NodeNavigatorItem
                {...itemProps}
                node={node}
                retainerRootNode={graph.root}
                onClick={(event) => {
                  if (mode.activateItem) mode.activateItem(item, event)
                  else {
                    if (event.shiftKey) setActiveNodeId(node.id)
                    openNode(node)
                  }
                }}
                {...(mode.itemProps && mode.itemProps({ item, ...itemProps }))}
              >
                {pinned.indexOf(node.id) >= 0 ? (
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => {
                        togglePinned({ id: node.id, set: false })
                      }}
                      size="large"
                    >
                      <StarIcon color="disabled" />
                    </IconButton>
                  </ListItemSecondaryAction>
                ) : null}
              </NodeNavigatorItem>
            )
          }}
          renderEmpty={() => (
            <EmptyBox icon={<BlockIcon />}>{mode.renderEmpty()}</EmptyBox>
          )}
        />
      )}
    </div>
  )
}
